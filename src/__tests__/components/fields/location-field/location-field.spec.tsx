import { Breakpoint, LifeSGTheme } from "@lifesg/react-design-system";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MockViewport, mockIntersectionObserver, mockViewport, mockViewportForTestGroup } from "jsdom-testing-mocks";
import { useEffect, useRef, useState } from "react";
import {
	FrontendEngine,
	IFrontendEngineData,
	IFrontendEngineProps,
	IFrontendEngineRef,
	IYupValidationRule,
} from "../../../../components";
import { ILocationFieldSchema, TSetCurrentLocationDetail } from "../../../../components/fields";
import { LocationHelper } from "../../../../components/fields/location-field/location-helper";
import { ERROR_SVG } from "../../../../components/fields/location-field/location-modal/location-modal.data";
import { ErrorImage } from "../../../../components/fields/location-field/location-modal/location-modal.styles";
import { IMapPin } from "../../../../components/fields/location-field/location-modal/location-picker/types";
import { ERROR_MESSAGES, Prompt } from "../../../../components/shared";
import { GeoLocationHelper, TestHelper } from "../../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";
import {
	fetchSingleLocationByLatLngSingleReponse,
	mock1PageFetchAddressResponse,
	mockEmptyFetchAddressResponse,
	mockInputValues,
	mockReverseGeoCodeResponse,
	mockStaticMapDataUri,
} from "./mock-values";
jest.mock("../../../../services/onemap/onemap-service.ts");

window.HTMLElement.prototype.scrollTo = jest.fn; // required for .scrollTo in location-search

const io = mockIntersectionObserver();

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "location-field";
const LABEL = "Location field";

const setCurrentLocationSpy = jest.fn();
const editButtonOnClickSpy = jest.fn();
const confirmLocationOnClickSpy = jest.fn();

enum ELocationInputEvents {
	"SET_CURRENT_LOCATION" = "set-current-location",
	"GET_CURRENT_LOCATION" = "get-current-location",
	"MOUNT" = "mount",
	"SHOW_MODAL" = "show-location-modal",
	"HIDE_MODAL" = "hide-location-modal",
	"CLICK_EDIT_BUTTON" = "click-edit-button",
	"CLICK_CONFIRM_LOCATION" = "click-confirm-location",
	"CONFIRM_LOCATION" = "confirm-location",
	"BEFORE_HIDE_PERMISSION_MODAL" = "before-hide-permission-modal",
	"HIDE_PERMISSION_MODAL" = "hide-permission-modal",
	"DISMISS_LOCATION_MODAL" = "dismiss-location-modal",
	"CLICK_REFRESH_CURRENT_LOCATION" = "click-refresh-current-location",
}
interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	locationDetails?: TSetCurrentLocationDetail;
	withEvents?: boolean;
	eventType?: string;
	eventListener?: (formRef: IFrontendEngineRef) => (this: Element, ev: Event) => any;
}

const FrontendEngineWithEventListener = ({
	withEvents,
	locationDetails,
	eventType,
	eventListener,
	...otherProps
}: ICustomFrontendEngineProps) => {
	const formRef = useRef<IFrontendEngineRef>();
	const [showEditPrompt, setShowEditPrompt] = useState<boolean>(false);
	const [showConfirmLocationPrompt, setShowConfirmLocationPrompt] = useState<boolean>(false);

	useEffect(() => {
		if (!withEvents || !locationDetails) return;

		const { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener } = formRef.current;

		const handleAddFieldEventListener = () => {
			addFieldEventListener(
				UI_TYPE,
				ELocationInputEvents.GET_CURRENT_LOCATION,
				COMPONENT_ID,
				setCurrentLocationSpy.mockImplementation((e) => {
					e.preventDefault();

					dispatchFieldEvent(
						UI_TYPE,
						ELocationInputEvents.SET_CURRENT_LOCATION,
						COMPONENT_ID,
						locationDetails
					);
				})
			);
			addFieldEventListener(
				UI_TYPE,
				ELocationInputEvents.CLICK_EDIT_BUTTON,
				COMPONENT_ID,
				editButtonOnClickSpy.mockImplementation((e) => {
					e.preventDefault();
					handleShowEditPrompt(e);
				})
			);
			addFieldEventListener(
				UI_TYPE,
				ELocationInputEvents.CLICK_CONFIRM_LOCATION,
				COMPONENT_ID,
				confirmLocationOnClickSpy.mockImplementation((e) => {
					e.preventDefault();
					handleShowConfirmLocationPrompt(e);
				})
			);
		};

		const handleRemoveFieldEventListener = () => {
			removeFieldEventListener(ELocationInputEvents.GET_CURRENT_LOCATION, COMPONENT_ID, setCurrentLocationSpy);
			removeFieldEventListener(ELocationInputEvents.CLICK_EDIT_BUTTON, COMPONENT_ID, editButtonOnClickSpy);
			removeFieldEventListener(
				ELocationInputEvents.CLICK_CONFIRM_LOCATION,
				COMPONENT_ID,
				confirmLocationOnClickSpy
			);
		};

		handleAddFieldEventListener();
		return () => handleRemoveFieldEventListener();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (eventType && eventListener) {
			const currentFormRef = formRef.current;
			const eventListenerWithFormRef = eventListener(currentFormRef);
			currentFormRef.addFieldEventListener(UI_TYPE, eventType as any, "field", eventListenerWithFormRef);
			return () =>
				currentFormRef.removeFieldEventListener(UI_TYPE, eventType as any, "field", eventListenerWithFormRef);
		}
	}, [eventListener, eventType]);

	const handleShowEditPrompt = (e) => {
		e.preventDefault();
		setShowEditPrompt(true);
	};

	const handleShowLocationModal = () => {
		setShowEditPrompt(false);
		formRef.current.dispatchFieldEvent(UI_TYPE, ELocationInputEvents.SHOW_MODAL, COMPONENT_ID);
	};

	const handleCancelOnClick = () => {
		setShowEditPrompt(false);
	};

	const handleShowConfirmLocationPrompt = async (e) => {
		e.preventDefault();
		setShowConfirmLocationPrompt(true);
		await new Promise(() =>
			setTimeout(() => {
				setShowConfirmLocationPrompt(false);
				formRef.current.dispatchFieldEvent(
					UI_TYPE,
					ELocationInputEvents.CONFIRM_LOCATION,
					COMPONENT_ID,
					e.detail
				);
			}, 3000)
		);
	};

	return (
		<>
			<FrontendEngine {...otherProps} ref={formRef} />
			<Prompt
				id={TestHelper.generateId(COMPONENT_ID, "edit-prompt")}
				title="Edit Location?"
				size="large"
				show={showEditPrompt}
				image={<ErrorImage src={ERROR_SVG} />}
				description="sample prompt message"
				buttons={[
					{
						id: "edit",
						title: "Edit location",
						onClick: handleShowLocationModal,
					},
					{
						id: "cancel",
						title: "Cancel",
						onClick: handleCancelOnClick,
						buttonStyle: "secondary",
					},
				]}
			/>
			<Prompt
				id={TestHelper.generateId(COMPONENT_ID, "confirm-location-prompt")}
				title="Confirm Location"
				size="large"
				show={showConfirmLocationPrompt}
				description="Timeout"
			/>
		</>
	);
};

interface IRenderProps {
	overrideField?: TOverrideField<ILocationFieldSchema>;
	overrideSchema?: TOverrideSchema;
	withEvents?: boolean;
	locationDetails?: TSetCurrentLocationDetail;
	validation?: ILocationFieldSchema["validation"];
	eventType?: string;
	eventListener?: (formRef: IFrontendEngineRef) => (this: Element, ev: Event) => any;
}

const renderComponent = (
	{
		overrideField,
		overrideSchema,
		locationDetails,
		withEvents,
		validation,
		eventType,
		eventListener,
	}: IRenderProps = { withEvents: false }
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: LABEL,
						uiType: UI_TYPE,
						validation,
						...overrideField,
					},
					...getSubmitButtonProps(),
				},
			},
		},
		...overrideSchema,
	};

	return render(
		<FrontendEngineWithEventListener
			data={json}
			onSubmit={SUBMIT_FN}
			locationDetails={locationDetails}
			withEvents={withEvents}
			eventListener={eventListener}
			eventType={eventType}
		/>
	);
};

const testIdCmd = (query = false) => {
	return query ? screen.queryByTestId : screen.getByTestId;
};

const getLocationModal = (query = false, view = "show") => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "modal", view));
};

const getLocationPicker = (query = false, view = "show") => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-picker", view));
};

const getLocationSearch = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search"));
};

const getLocationSearchResults = (query = false, view = "double") => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search-results", view));
};

const getLocationCloseButton = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search-modal-close"));
};

const getCurrentLocationErrorModal = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "get-location-error", "show"));
};

const getLocationSearchInput = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search-modal-input"));
};

const getLocationSearchButton = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search-modal-search"));
};

const getLocationInput = (query = false) => {
	return within(testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-input"))).getByTestId("input");
};

const getLocationSearchClearButton = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search-input-clear"));
};

const getLocationModalControlButtons = (type, query = false) => {
	return within(testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "location-search-controls"))).getByText(type);
};

const getStaticMap = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "static-map"));
};

const getEditLocationButton = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "edit-button"));
};

const getEditLocationModal = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "edit-prompt", "show"));
};

const getEditLocationModalTitle = (query = false) => {
	return within(testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "edit-prompt", "show"))).getByText(
		"Edit Location?"
	);
};

const getEditLocationModalDesc = (query = false) => {
	return within(testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "edit-prompt", "show"))).getByText(
		"sample prompt message"
	);
};

const getEditLocationModalEditButton = (query = false) => {
	return within(testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "edit-prompt", "show"))).getByText(
		"Edit location"
	);
};

const getEditLocationModalCancelButton = (query = false) => {
	return within(testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "edit-prompt", "show"))).getByText("Cancel");
};

const getConfirmLocationModal = (query = false) => {
	return testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "confirm-location-prompt", "show"));
};

const getOneMapErrorModal = (query = false) => testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "onemap-error"));

const getCurrentLocationButton = (query = false) =>
	testIdCmd(query)(TestHelper.generateId(COMPONENT_ID, "refresh-current-location-button"));

// assert network error

/**
 * TODO check error state at every interaction juncture?
 *
 * What to test?
 *
 * We have the normal actions
 * Each action have variation depending on side effect resolution and current state
 * Then we have stateful changes that dont need user input
 *
 * We test
 * - following user actions
 * - then non-user actions (changes that can happen without user action)
 * - external state variations (device or api (non-failures))
 * - internal state variations (component)
 * - error handling
 *
 * TODO:
 * double check all network calls are mocked
 * trace broken test
 * break down test files
 * - events
 * - search
 * - map
 * - full flow
 *
 * FIXME
 * Testing geolocation errors is inconsistent and unpredictabl
 * - hard to mock
 * - geolocation error is not an instanceof erro
 * - cant seem to match the GeolocationPositionError class
 */

describe("location-input-group", () => {
	let fetchAddressSpy;
	let getCurrentLocationSpy;
	let reverseGeocodeSpy;
	let viewport: MockViewport;
	let staticMapSpy;
	let fetchSingleLocationByAddressSpy;
	let fetchSingleLocationByLatLngSpy;
	let fetchLocationListSpy;

	const setWindowAndViewPort = (width: number, height = Breakpoint["xl-max"]({ theme: LifeSGTheme })) => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: Breakpoint["xxs-max"]({ theme: LifeSGTheme }), // Set the desired screen width for the desktop view
		});
		Object.defineProperty(window, "innerHeight", {
			writable: true,
			value: Breakpoint["xxs-max"]({ theme: LifeSGTheme }), // Set the desired screen width for the desktop view
		});

		const createMockVisualViewport = (width, height) => ({
			width,
			height,
			offsetLeft: 0,
			offsetTop: 0,
			pageLeft: 0,
			pageTop: 0,
			scale: 1,
			zoom: 1,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		});

		const mockVisualViewport = createMockVisualViewport(width, height);
		Object.defineProperty(window, "visualViewport", {
			writable: true,
			value: mockVisualViewport,
		});

		viewport.set({
			width,
			height: Breakpoint["xl-max"]({ theme: LifeSGTheme }),
		});
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		getCurrentLocationSpy = jest.spyOn(GeoLocationHelper, "getCurrentLocation");
		fetchAddressSpy = jest.spyOn(LocationHelper, "debounceFetchAddress");
		reverseGeocodeSpy = jest.spyOn(LocationHelper, "reverseGeocode");
		fetchSingleLocationByAddressSpy = jest.spyOn(LocationHelper, "fetchSingleLocationByAddress");
		staticMapSpy = jest.spyOn(LocationHelper, "getStaticMapUrl").mockReturnValue(mockStaticMapDataUri);
		fetchSingleLocationByLatLngSpy = jest.spyOn(LocationHelper, "fetchSingleLocationByLatLng");
		fetchLocationListSpy = jest.spyOn(LocationHelper, "fetchLocationList");

		viewport = mockViewport({
			width: Breakpoint["xl-max"]({ theme: LifeSGTheme }),
			height: Breakpoint["xl-max"]({ theme: LifeSGTheme }),
		});
		setWindowAndViewPort(Breakpoint["xl-max"]({ theme: LifeSGTheme }));
	});

	afterEach(() => {
		delete window.visualViewport;
		delete window.innerWidth;
		delete window.innerHeight;
		viewport.cleanup();
		getCurrentLocationSpy.mockReset();
		fetchAddressSpy.mockRestore();
		reverseGeocodeSpy.mockRestore();
		staticMapSpy.mockRestore();
		fetchSingleLocationByAddressSpy.mockRestore();
		fetchSingleLocationByLatLngSpy.mockRestore();
	});

	/**
	 * Control is inverted and now I need to figure what needs to be passed from
	 * device and what information should live in FE
	 *
	 * Analyze what the prop really wants to do
	 * Generalize the use case
	 *
	 * Data refactoring
	 * What data objects do I need
	 * What variance do I need for ui elements
	 * What formatting is needed at which level?
	 *
	 * When something is hard to test and mocked
	 * - probably too decoupled
	 * - too complicated
	 * - unintuitive
	 */
	describe("events", () => {
		describe("geolocation events", () => {
			// When does it request
			// - open location
			// - when you click on the picker button

			it("should run default location getCurrentLocation", async () => {
				getCurrentLocationSpy.mockResolvedValue({
					lat: 1.29994179707526,
					lng: 103.789404349716,
				});

				renderComponent({ withEvents: false });

				await waitFor(() => window.dispatchEvent(new Event("online")));

				expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
				expect(screen.getByLabelText(LABEL)).toBeInTheDocument();

				getLocationInput().focus();

				await waitFor(() => {
					expect(getCurrentLocationErrorModal(true)).not.toBeInTheDocument();
					expect(getLocationPicker(true)).toBeInTheDocument();
					expect(getLocationSearch(true)).toBeInTheDocument();
				});
			});

			it.todo(
				"should handle when navigator does not support geolocation in default location getCurrentLocation "
			);

			it("should set-current-location when FE requests for current location", async () => {
				const locationDetails = {
					payload: {
						lat: 1.29994179707526,
						lng: 103.789404349716,
					},
				};
				renderComponent({ withEvents: true, locationDetails });
				await waitFor(() => window.dispatchEvent(new Event("online")));

				expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
				expect(screen.getByLabelText(LABEL)).toBeInTheDocument();

				getLocationInput().focus();

				expect(setCurrentLocationSpy).toBeCalled();

				// test for side effects

				expect(
					screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-timeout-error", "show"))
				).not.toBeInTheDocument();

				expect(
					screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-error", "show"))
				).not.toBeInTheDocument();
			});

			it("should handle timeout GeolocationPositionError when FE requests for current location", async () => {
				renderComponent({
					withEvents: true,
					locationDetails: {
						errors: {
							code: "3",
						},
					},
				});
				await waitFor(() => window.dispatchEvent(new Event("online")));

				expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
				expect(screen.getByLabelText(LABEL)).toBeInTheDocument();

				screen.getByTestId("input").focus();

				expect(setCurrentLocationSpy).toBeCalled();

				await waitFor(() => {
					expect(
						screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-timeout-error", "show"))
					).toBeInTheDocument();
				});

				within(screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-timeout-error", "show")))
					.getByRole("button")
					.click();

				await waitFor(() => {
					expect(
						screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-timeout-error", "show"))
					).not.toBeInTheDocument();

					expect(
						screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-error", "show"))
					).not.toBeInTheDocument();
				});

				expect(getLocationModal(false, "hide")).toBeInTheDocument();
			});

			it("should handle non app error when FE requests for current location", async () => {
				renderComponent({
					withEvents: true,
					locationDetails: {
						errors: {
							generic: "throw something",
						},
					},
				});
				await waitFor(() => window.dispatchEvent(new Event("online")));

				expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
				expect(screen.getByLabelText(LABEL)).toBeInTheDocument();

				screen.getByTestId("input").focus();

				expect(setCurrentLocationSpy).toBeCalled();

				await waitFor(() => {
					expect(
						screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-error", "show"))
					).toBeInTheDocument();
				});

				expect(
					screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-timeout-error", "show"))
				).not.toBeInTheDocument();

				within(screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-error", "show")))
					.getByRole("button")
					.click();

				await waitFor(() => {
					expect(
						screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "get-location-error", "show"))
					).not.toBeInTheDocument();
				});

				expect(screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "modal", "show"))).toBeVisible();
			});
		});

		// isLifeSGapp

		// custom error modal
		// OneMapError
		// GetLocationError
		// GetLocationTimeoutError
		// PostalCodeError

		//Modal Events
		describe("Modal events", () => {
			it("should fire show-location-modal event on showing location modal", async () => {
				const handleShowReviewModal = jest.fn();
				renderComponent({
					eventType: ELocationInputEvents.SHOW_MODAL,
					eventListener: () => handleShowReviewModal,
				});
				getLocationInput().focus();
				expect(handleShowReviewModal).toBeCalled();
			});

			it("should fire hide-location-modal event on hiding location modal", async () => {
				const handleHideReviewModal = jest.fn();
				renderComponent({
					eventType: "hide-location-modal",
					eventListener: () => handleHideReviewModal,
				});
				getLocationInput().focus();
				await waitFor(() => fireEvent.click(getField("button", "Cancel", false)));
				expect(handleHideReviewModal).toBeCalled();
			});
		});

		//Explicit Edit Events
		describe("Explicit Edit events", () => {
			it("should fire click-edit-button event when edit button been clicked", async () => {
				renderComponent({
					withEvents: true,
					locationDetails: {
						errors: {
							generic: "throw something",
						},
					},
					overrideSchema: {
						defaultValues: {
							[COMPONENT_ID]: {
								address: "Fusionopolis View",
							},
						},
					},
					overrideField: {
						hasExplicitEdit: "explicit",
					},
				});
				await waitFor(() => window.dispatchEvent(new Event("online")));

				expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
				expect(screen.getByLabelText(LABEL)).toBeInTheDocument();
				expect(getEditLocationButton(true)).toBeInTheDocument();
				expect(getLocationInput()).toHaveAttribute("disabled");
				fireEvent.click(getEditLocationButton());

				expect(editButtonOnClickSpy).toBeCalled();

				await waitFor(() => {
					expect(getEditLocationModal(true)).toBeInTheDocument();
					expect(getEditLocationModalTitle(true)).toBeInTheDocument();
					expect(getEditLocationModalDesc(true)).toBeInTheDocument();
					expect(getEditLocationModalEditButton(true)).toBeInTheDocument();
					expect(getEditLocationModalCancelButton(true)).toBeInTheDocument();
				});

				fireEvent.click(getEditLocationModalCancelButton());
				await waitFor(() => {
					expect(getEditLocationModal(true)).not.toBeInTheDocument();
				});

				fireEvent.click(getEditLocationButton());
				fireEvent.click(getEditLocationModalEditButton());
				expect(screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "modal", "show"))).toBeVisible();
			});
		});

		//Confirm Location Events
		describe("Confirm Location events", () => {
			beforeEach(async () => {
				jest.useFakeTimers();
				getCurrentLocationSpy.mockRejectedValue({
					code: 1,
				});

				renderComponent({
					withEvents: true,
					locationDetails: {
						errors: {
							generic: "throw something",
						},
					},
				});

				await waitFor(() => window.dispatchEvent(new Event("online")));

				getLocationInput().focus();

				await waitFor(() => {
					expect(getCurrentLocationErrorModal()).toBeInTheDocument();
				});

				within(getCurrentLocationErrorModal()).getByRole("button").click();
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it("should show confirm location prompt when confirm location", async () => {
				fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
					onSuccess(mock1PageFetchAddressResponse);
				});

				fireEvent.change(getLocationSearchInput(), { target: { value: "found somthing" } });

				expect(fetchAddressSpy).toHaveBeenCalled();

				await waitFor(() => {
					expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
				});

				const resultContainer = getLocationSearchResults();
				const selectedResult = resultContainer.getElementsByTagName("div")[0];
				fireEvent.click(selectedResult);

				await waitFor(() => {
					expect(selectedResult).toHaveAttribute("data-testid", expect.stringContaining("active"));
					expect(getLocationModalControlButtons("Confirm")).not.toHaveAttribute("disabled");
				});

				fireEvent.click(getLocationModalControlButtons("Confirm"));

				await waitFor(() => {
					expect(confirmLocationOnClickSpy).toBeCalled();
					expect(getConfirmLocationModal()).toBeInTheDocument();
				});
				act(() => jest.advanceTimersByTime(3500));

				await waitFor(() => {
					expect(getConfirmLocationModal(true)).not.toBeInTheDocument();
					expect(getLocationModal(true)).not.toBeInTheDocument();
				});
			});
		});

		// Selectable Pin Events
		describe("Selectable Pin events", () => {
			const getSelectablePinsEvent = "get-selectable-pins";

			describe("get-selectable-pins", () => {
				const getSelectablePins = jest.fn();
				const event = {
					eventType: getSelectablePinsEvent,
					eventListener: () => getSelectablePins,
				};

				beforeEach(() => {
					jest.clearAllMocks;
				});

				it("should fire get-selectable-pins event if default location is set", async () => {
					renderComponent({
						...event,
						overrideSchema: {
							defaultValues: {
								[COMPONENT_ID]: {
									lat: 1.29994179707526,
									lng: 103.789404349716,
								},
							},
						},
					});
					getLocationInput().focus();
					await waitFor(() => {
						expect(getSelectablePins).toHaveBeenCalled();
					});
				});

				it("should fire get-selectable-pins event if current location is fetched", async () => {
					getCurrentLocationSpy.mockResolvedValue({
						lat: 1.29994179707526,
						lng: 103.789404349716,
					});

					renderComponent(event);
					getLocationInput().focus();
					await waitFor(() => {
						expect(getSelectablePins).toHaveBeenCalled();
					});
				});

				it("should not fire get-selectable-pins event if failed to get current location", async () => {
					renderComponent(event);
					getLocationInput().focus();
					await waitFor(() => {
						expect(getSelectablePins).not.toHaveBeenCalled();
					});
				});
			});

			describe("set-selectable-pins", () => {
				it("should show error modal if selectable pins is not an array", async () => {
					renderComponent({
						eventType: getSelectablePinsEvent,
						eventListener: (formRef) => () => {
							formRef.dispatchFieldEvent(UI_TYPE, "set-selectable-pins", COMPONENT_ID, {
								pins: "not array" as unknown as IMapPin[],
							});
						},
						overrideSchema: {
							defaultValues: {
								[COMPONENT_ID]: {
									lat: 1.29994179707526,
									lng: 103.789404349716,
								},
							},
						},
					});
					getLocationInput().focus();

					await waitFor(() => {
						expect(getOneMapErrorModal(true)).toBeDefined();
					});
				});

				it("should populate results list with pins", async () => {
					renderComponent({
						eventType: getSelectablePinsEvent,
						eventListener: (formRef) => () => {
							formRef.dispatchFieldEvent(UI_TYPE, "set-selectable-pins", COMPONENT_ID, {
								pins: [
									{
										lat: 1.21,
										lng: 103.78,
										resultListItemText: "address 1",
										address: "address 1",
									},
									{
										lat: 1.23,
										lng: 103.79,
										resultListItemText: "address 2",
										address: "address 2",
									},
								],
							});
						},
						overrideSchema: {
							defaultValues: {
								[COMPONENT_ID]: {
									lat: 1.29994179707526,
									lng: 103.789404349716,
								},
							},
						},
					});
					getLocationInput().focus();

					await waitFor(() => {
						expect(screen.queryByText("address 1")).toBeDefined();
						expect(screen.queryByText("address 2")).toBeDefined();
					});
				});
			});
		});

		describe("Refresh location events", () => {
			it("should fire click-refresh-current-location event when get current location button is clicked", async () => {
				const mockRefreshLocation = jest.fn();
				renderComponent({
					eventType: ELocationInputEvents.CLICK_REFRESH_CURRENT_LOCATION,
					eventListener: () => mockRefreshLocation,
					overrideSchema: {
						defaultValues: {
							[COMPONENT_ID]: {
								lat: 1.29994179707526,
								lng: 103.789404349716,
							},
						},
					},
				});

				await waitFor(() => window.dispatchEvent(new Event("online")));

				getLocationInput().focus();

				const refreshCurrentLocationButton = getCurrentLocationButton();

				expect(refreshCurrentLocationButton).toBeInTheDocument();

				fireEvent.click(refreshCurrentLocationButton);

				expect(mockRefreshLocation).toHaveBeenCalled();
			});
		});
	});

	describe("functionality", () => {
		describe("when rendering the input field", () => {
			it("should be able to render the location input field", async () => {
				renderComponent();

				expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
				expect(screen.getByLabelText(LABEL)).toBeInTheDocument();
			});

			labelTestSuite((overrideField: TOverrideField<ILocationFieldSchema>) => {
				renderComponent({ overrideField });
			});
			warningTestSuite<ILocationFieldSchema>({ label: LABEL, uiType: UI_TYPE });

			// test functionality
			describe("when there are default values", () => {
				describe("when only address", () => {
					beforeEach(async () => {
						fetchSingleLocationByAddressSpy.mockImplementation((_, onSuccess) => {
							onSuccess(mockInputValues);
						});
						reverseGeocodeSpy.mockImplementation(() => {
							return mockReverseGeoCodeResponse;
						});
						renderComponent({
							withEvents: false,
							overrideSchema: {
								defaultValues: {
									[COMPONENT_ID]: {
										address: "Fusionopolis View",
									},
								},
							},
						});

						await waitFor(() => {
							expect(getLocationInput(true)).toBeInTheDocument();
							expect(getStaticMap(true)).toBeInTheDocument();
						});
					});

					it("should open location modal when static map is clicked", async () => {
						fireEvent.click(getStaticMap());

						await waitFor(() => {
							expect(getLocationModal(true)).toBeInTheDocument();
						});
					});

					it("should open location model when location input is clicked", async () => {
						getLocationInput().focus();

						await waitFor(() => {
							expect(getLocationModal(true)).toBeInTheDocument();
						});
					});

					// FIXME reverse geocode is broken for full address searches
					describe("when location modal is open", () => {
						it.todo("should have search input field and single search result shown and selected");
					});
				});

				describe("when only lat lng", () => {
					beforeEach(async () => {
						fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
							onSuccess(mock1PageFetchAddressResponse);
						});
						fetchSingleLocationByLatLngSpy.mockImplementation(
							(_reverseGeoCodeEndpoint, _convertLatLngToXYEndpoint, _lat, _lng, handleResult) => {
								handleResult(fetchSingleLocationByLatLngSingleReponse);
							}
						);
						renderComponent({
							withEvents: false,
							overrideSchema: {
								defaultValues: {
									[COMPONENT_ID]: {
										lat: 1.29994179707526,
										lng: 103.789404349716,
									},
								},
							},
							overrideField: {
								reverseGeoCodeEndpoint: "https://www.mock.com/reverse-geo-code",
							},
						});

						await waitFor(() => {
							expect(fetchSingleLocationByLatLngSpy).toBeCalledTimes(1);
							expect(getLocationInput(true)).toBeInTheDocument();
							expect(getStaticMap(true)).toBeInTheDocument();
						});
					});

					it("should show static map only and open the modal when clicked", async () => {
						fireEvent.click(getStaticMap());

						await waitFor(() => {
							expect(getLocationModal(true)).toBeInTheDocument();
						});
					});

					it("show input value only and open the modal when clicked", async () => {
						getLocationInput().focus();

						await waitFor(() => {
							expect(getLocationModal(true)).toBeInTheDocument();
						});
					});

					describe("when location modal is open", () => {
						it.todo("should have search input field and single search result shown and selected");
					});
				});

				describe("when location is a pin location with only latlng values", () => {
					beforeEach(async () => {
						fetchSingleLocationByLatLngSpy.mockImplementation(
							(_reverseGeoCodeEndpoint, _convertLatLngToXYEndpoint, _lat, _lng, handleResult) => {
								handleResult(fetchSingleLocationByLatLngSingleReponse);
							}
						);
						renderComponent({
							withEvents: false,
							overrideSchema: {
								defaultValues: {
									[COMPONENT_ID]: {
										lat: 1.29994179707526,
										lng: 103.789404349716,
										address: "Pin location 1.30, 103.79",
									},
								},
							},
							overrideField: {
								reverseGeoCodeEndpoint: "https://www.mock.com/reverse-geo-code",
							},
						});

						await waitFor(() => {
							expect(fetchSingleLocationByLatLngSpy).toBeCalledTimes(1);
							expect(fetchSingleLocationByAddressSpy).not.toBeCalled();
							expect(getLocationInput(true)).toBeInTheDocument();
							expect(getStaticMap(true)).toBeInTheDocument();
						});
					});

					it("show input value only and open the modal when clicked", async () => {
						getLocationInput().focus();

						await waitFor(() => {
							expect(getLocationModal(true)).toBeInTheDocument();
						});
					});
				});

				describe("when both address and lat lng", () => {
					// TODO
				});

				it.todo("should show static map only and open the modal when clicked");

				it.todo("show input value only and open the modal when clicked");

				describe("when there are network errors", () => {
					it.todo("handle when static map endpoint is down");

					it.todo("handle when fetch address endpoint is down");

					it.todo("handle when reverse geocode endpoint is down");
				});
				// What other scenarios?
			});
		});

		// cancelled

		// something in state

		describe("when the location modal is open", () => {
			// what it should do
			// mobile
			// desktop

			describe("when there is internet connectivity", () => {
				it("should open location modal when input is clicked", async () => {
					renderComponent();

					expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
					expect(screen.getByLabelText(LABEL)).toBeInTheDocument();

					getLocationInput().focus();

					await waitFor(() => {
						expect(getLocationModal(true)).toBeInTheDocument();
					});
				});

				describe("when geolocation is supported", () => {
					describe("when geolocation is not enabled", () => {
						it("should warn user about location not enabled and allow the user to continue after dismissing modal", async () => {
							getCurrentLocationSpy.mockRejectedValue({
								code: 1,
							});
							renderComponent();

							await waitFor(() => window.dispatchEvent(new Event("online")));

							getLocationInput().focus();

							await waitFor(() => {
								expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
							});

							within(getCurrentLocationErrorModal(true)).getByRole("button").click();

							await waitFor(() => {
								expect(getLocationPicker(true)).toBeVisible();
								expect(getLocationSearchResults(true, "double")).toBeInTheDocument();
							});
						});
					});

					describe("when geolocation is enabled", () => {
						// get current location
					});

					// geolocation state changes?
				});

				// rename
				describe("when geolocation is disabled", () => {
					beforeEach(() => {
						getCurrentLocationSpy.mockRejectedValue({
							code: 1,
						});
					});
					describe("modal controls", () => {
						describe("for tablet and below", () => {
							mockViewportForTestGroup({
								width: Breakpoint["md-min"]({ theme: LifeSGTheme }),
								height: Breakpoint["md-min"]({ theme: LifeSGTheme }),
							});

							it("should allow user to close the location modal when in map mode", async () => {
								setWindowAndViewPort(Breakpoint["md-min"]({ theme: LifeSGTheme }));

								renderComponent();

								await waitFor(() => window.dispatchEvent(new Event("online")));

								getLocationInput().focus();

								await waitFor(() => {
									expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
								});

								within(getCurrentLocationErrorModal(true)).getByRole("button").click();

								await waitFor(() => {
									expect(getLocationModal(true)).toBeVisible();
									expect(getLocationPicker(true)).toBeVisible();
									expect(getLocationSearchResults(true, "map")).toBeInTheDocument();
								});

								fireEvent.click(getLocationCloseButton());

								await waitFor(() => {
									expect(getLocationModal(true, "hide")).toBeInTheDocument();
								});
							});

							it("should allow user to close the modal when in search mode", async () => {
								setWindowAndViewPort(Breakpoint["md-min"]({ theme: LifeSGTheme }));

								renderComponent();

								await waitFor(() => window.dispatchEvent(new Event("online")));

								getLocationInput().focus();

								await waitFor(() => {
									expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
								});

								await waitFor(() => {
									within(getCurrentLocationErrorModal(true)).getByRole("button").click();
								});

								await waitFor(() => {
									expect(getLocationPicker(true)).toBeVisible();
									expect(getLocationSearchResults(true, "map")).toBeInTheDocument();
								});

								fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
									onSuccess(mock1PageFetchAddressResponse);
								});

								fireEvent.change(getLocationSearchInput(), { target: { value: "A" } });

								expect(fetchAddressSpy).toHaveBeenCalled();

								await waitFor(() => {
									expect(getLocationModal(true)).toBeVisible();
									expect(getLocationPicker(true, "hide")).toBeInTheDocument();
									expect(getLocationSearchResults(true, "search")).toBeInTheDocument();
								});

								fireEvent.click(getLocationCloseButton());

								await waitFor(() => {
									expect(getLocationModal(true, "hide")).toBeInTheDocument();
								});
							});
						});

						describe("for desktop", () => {
							it("should allow user to cancel", async () => {
								setWindowAndViewPort(Breakpoint["xxl-min"]({ theme: LifeSGTheme }));

								renderComponent();

								await waitFor(() => window.dispatchEvent(new Event("online")));

								getLocationInput().focus();

								await waitFor(() => {
									expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
								});

								within(getCurrentLocationErrorModal(true)).getByRole("button").click();

								await waitFor(() => {
									expect(getLocationPicker(true)).toBeVisible();
									expect(getLocationSearchResults(true, "double")).toBeInTheDocument();
								});

								const buttons = screen.getAllByTestId("button");
								const [cancelButton] = buttons.filter((el) => {
									return el.textContent === "Cancel";
								});

								expect(cancelButton).toBeInTheDocument();

								cancelButton.click();

								await waitFor(() => {
									expect(getLocationModal(true)).not.toBeInTheDocument();
								});
							});
						});

						it.todo("should allow user to continue with selection");
					});

					// library so no need
					describe("map controls", () => {
						// move
						// click
						// click zoom +/-
						// click location
						// location variants
					});

					describe("when using location picker", () => {
						// map touch controls
						// zoom
						// recenter
						// click to search
					});

					describe("when using location search in desktop", () => {
						beforeEach(async () => {
							renderComponent();

							await waitFor(() => window.dispatchEvent(new Event("online")));

							getLocationInput().focus();

							await waitFor(() => {
								expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
							});

							within(getCurrentLocationErrorModal(true)).getByRole("button").click();
						});

						it("should automatically search as user types", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mockEmptyFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found nothing" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true)).toHaveTextContent("No results found");
							});

							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found something" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
							});
						});

						it("should allow user to clear query string", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found something" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
							});

							fireEvent.click(getLocationSearchClearButton());

							await waitFor(() => {
								expect(getLocationSearchInput()).toHaveValue("");
								expect(getLocationSearchResults(true)).toBeEmptyDOMElement();
							});
						});

						it("should allow user to select result", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found somthing" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
							});

							const resultContainer = getLocationSearchResults();
							const selectedResult = resultContainer.getElementsByTagName("div")[0];
							fireEvent.click(selectedResult);

							await waitFor(() => {
								expect(selectedResult).toHaveAttribute(
									"data-testid",
									expect.stringContaining("active")
								);
								expect(getLocationModalControlButtons("Confirm")).not.toHaveAttribute("disabled");
							});
						});

						it("should allow user to scroll to see more results", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found somthing" } });

							expect(fetchAddressSpy).toHaveBeenCalledTimes(1);

							await waitFor(() => {
								expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
							});

							const resultContainer = getLocationSearchResults();
							fireEvent.scroll(resultContainer, {
								target: {
									scrollTop: (resultContainer.scrollTop += 9999),
								},
							});

							act(() => {
								io.enterNode(screen.getByTestId("InfiniteScrollList__InfiniteListItem-sentryRef"));
							});

							await waitFor(() => {
								expect(fetchAddressSpy).toHaveBeenCalledTimes(2);
							});
						});

						it("should close location modal when confirm", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found somthing" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
							});

							const resultContainer = getLocationSearchResults();
							const selectedResult = resultContainer.getElementsByTagName("div")[0];
							fireEvent.click(selectedResult);

							await waitFor(() => {
								expect(selectedResult).toHaveAttribute(
									"data-testid",
									expect.stringContaining("active")
								);
								expect(getLocationModalControlButtons("Confirm")).not.toHaveAttribute("disabled");
							});

							fireEvent.click(getLocationModalControlButtons("Confirm"));

							await waitFor(() => {
								expect(getLocationModal(true)).not.toBeInTheDocument();
							});

							// should I assert static map?
						});
					});

					describe("when using location search in mobile", () => {
						beforeEach(async () => {
							setWindowAndViewPort(Breakpoint["md-min"]({ theme: LifeSGTheme }));
							getCurrentLocationSpy.mockRejectedValue({
								code: 1,
							});
							renderComponent();

							await waitFor(() => window.dispatchEvent(new Event("online")));

							getLocationInput().focus();

							await waitFor(() => {
								expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
							});

							within(getCurrentLocationErrorModal(true)).getByRole("button").click();
						});

						it("should switch to map mode when result is selected", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found somthing" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true, "search")).not.toBeEmptyDOMElement();
							});

							const resultContainer = getLocationSearchResults(false, "search");
							const selectedResult = resultContainer.getElementsByTagName("div")[0];
							fireEvent.click(selectedResult);

							await waitFor(() => {
								expect(getLocationModal(true)).toBeVisible();
								expect(getLocationPicker(true)).toBeVisible();
								expect(getLocationSearchResults(true, "map")).toBeInTheDocument();
							});
						});

						it("should close location modal when confirm", async () => {
							fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
								onSuccess(mock1PageFetchAddressResponse);
							});

							fireEvent.change(getLocationSearchInput(), { target: { value: "found somthing" } });

							expect(fetchAddressSpy).toHaveBeenCalled();

							await waitFor(() => {
								expect(getLocationSearchResults(true, "search")).not.toBeEmptyDOMElement();
							});

							const resultContainer = getLocationSearchResults(false, "search");
							const selectedResult = resultContainer.getElementsByTagName("div")[0];
							fireEvent.click(selectedResult);

							await waitFor(() => {
								expect(selectedResult).toHaveAttribute(
									"data-testid",
									expect.stringContaining("active")
								);
								expect(getLocationModalControlButtons("Confirm location")).not.toHaveAttribute(
									"disabled"
								);
							});

							fireEvent.click(getLocationModalControlButtons("Confirm location"));

							await waitFor(() => {
								expect(getLocationModal(true)).not.toBeInTheDocument();
							});

							// should I assert static map?
						});
					});

					describe("when actions cause cross component state change", () => {
						// search behaviours?
						describe("when user click map", () => {
							// do smth
						});

						describe("when user selects a search result", () => {
							// do smth
						});

						describe("when user clears query in tablet or smaller screens", () => {
							// do smth
						});

						describe("when user recenters", () => {
							// do smth
						});
					});

					describe("when user cancels", () => {
						// restore value as untouched
						// reopen behaviour
						// as is input visual
					});

					// test screen resize?

					describe("when user continue", () => {
						it.todo("should show both static map and input value and dismiss location modal");
					});
				});

				describe("when using the map banner", () => {
					it("should render a banner if banner text is specified", async () => {
						const mapBannerText = "This is some sample banner text";

						renderComponent({ overrideField: { mapBannerText } });

						expect(screen.getByText(mapBannerText)).toBeInTheDocument();
					});

					it("should not render a banner if banner text is undefined", async () => {
						renderComponent();

						expect(
							screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "location-banner"))
						).not.toBeInTheDocument();
					});
				});

				describe("when using the disableSearch", () => {
					it("should allow text input when disableSearch is default (undefined))", () => {
						renderComponent();

						getLocationSearchInput().focus();
						fireEvent.change(getLocationSearchInput(), { target: { value: "text input" } });

						expect(getLocationSearchButton()).toBeEnabled();
						expect(getLocationSearchInput()).toHaveFocus();
						expect(getLocationSearchInput()).toHaveValue("text input");
						expect(getLocationSearchClearButton()).toBeEnabled();
					});

					it("should disable text input when disableSearch is 'disabled'", () => {
						renderComponent({ overrideField: { disableSearch: "disabled" } });

						expect(getLocationSearchButton()).toBeDisabled();
						expect(getLocationSearchInput()).toBeDisabled();
						expect((getLocationSearchInput() as HTMLInputElement).readOnly).not.toBe(true);
						expect(getLocationSearchClearButton()).toBeDisabled();
					});

					it("should set text input to readonly when disableSearch is 'readonly'", () => {
						renderComponent({ overrideField: { disableSearch: "readonly" } });

						expect(getLocationSearchButton()).toBeDisabled();
						expect(getLocationSearchInput()).not.toBeDisabled();
						expect((getLocationSearchInput() as HTMLInputElement).readOnly).toBe(true);
						expect(getLocationSearchClearButton()).toBeDisabled();
					});
				});
			});

			describe("when internet connectivity errors occurs", () => {
				it("should show no internet connectivity error modal if no internet", async () => {
					await renderComponent();

					await waitFor(() =>
						fireEvent.click(screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-input")))
					);

					await waitFor(() => window.dispatchEvent(new Event("offline")));

					expect(
						screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "no-internet-connectivity"))
					).toBeInTheDocument();
				});

				it("should dismiss the modal when internet is restored", async () => {
					await renderComponent();

					await waitFor(() =>
						fireEvent.click(screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-input")))
					);

					await waitFor(() => window.dispatchEvent(new Event("offline")));
					await waitFor(() => window.dispatchEvent(new Event("online")));

					expect(
						screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "no-internet-connectivity"))
					).not.toBeInTheDocument();
				});

				// it("should do the custom logic when internet restores");
			});

			// TODO
			describe("network errors", () => {
				// show one map error
				// - first load useEffect
				// - query searching
				// -- getting more address when
				// 		- scrolling down to load more search results
				// showGetLocationError
				// - first load useEffect
				// - getting location
				// 		- getCurrentLocation when we click on the location modal
				//		- when clicking location button on the map
				// showGetLocationTimeoutError
				// - handleGetLocationError variance (triggered by device)
			});
		});

		describe("locationSelectionMode = 'pins'", () => {
			beforeEach(async () => {
				getCurrentLocationSpy.mockResolvedValue({
					lat: 1.29994179707526,
					lng: 103.789404349716,
				});
			});

			it("should not render search clear button", async () => {
				renderComponent({ overrideField: { locationSelectionMode: "pins-only" } });

				getLocationInput().focus();

				await waitFor(() => {
					const a = getLocationSearchClearButton(true);
					expect(a).toBeNull();
				});
			});

			it("should not populate search bar input ", async () => {
				fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
					onSuccess(mock1PageFetchAddressResponse);
				});
				reverseGeocodeSpy.mockImplementation(() => mockReverseGeoCodeResponse);
				fetchLocationListSpy.mockImplementation(() => mockReverseGeoCodeResponse);
				renderComponent({
					overrideField: {
						reverseGeoCodeEndpoint: "https://www.mock.com/reverse-geo-code",
						locationSelectionMode: "pins-only",
					},
				});

				getLocationInput().focus();

				await waitFor(() => {
					const locationListTitle = screen.queryByText(mockReverseGeoCodeResponse[0].address);
					expect(locationListTitle).not.toBeInTheDocument();
				});
			});
		});
	});

	describe("customisation", () => {
		it.todo("should support placeholder texts");
	});

	describe("validation", () => {
		it("should allow empty if validation not required", async () => {
			renderComponent({
				withEvents: false,
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalled();
		});

		describe.each`
			name                 | value
			${"empty"}           | ${{}}
			${"lat lng missing"} | ${{ address: "Fusionopolis View" }}
			${"lng missing"}     | ${{ lat: 1 }}
			${"lat missing"}     | ${{ lng: 1 }}
		`("$name", (name, value) => {
			it("should validate if required", async () => {
				renderComponent({
					validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
					withEvents: false,
					overrideSchema: {
						defaultValues: {
							[COMPONENT_ID]: value,
						},
					},
				});

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(getErrorMessage()).toBeInTheDocument();
			});
		});

		it("should pass validation if required values are provided", async () => {
			renderComponent({
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				withEvents: false,
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: {
							address: "Fusionopolis View",
							lat: 1,
							lng: 1,
						},
					},
				},
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalled();
		});

		it("should validate mustHavePostalCode", async () => {
			renderComponent({
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				withEvents: false,
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: {
							address: "Fusionopolis View",
							lat: 1,
							lng: 1,
						},
					},
				},
				overrideField: {
					mustHavePostalCode: true,
				},
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGES.LOCATION.MUST_HAVE_POSTAL_CODE)).toBeInTheDocument();
		});

		it("should allow customisation of missing postal code error message", async () => {
			renderComponent({
				validation: [{ required: true }, { postalCode: true, errorMessage: ERROR_MESSAGE }],
				withEvents: false,
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: {
							address: "Fusionopolis View",
							lat: 1,
							lng: 1,
						},
					},
				},
				overrideField: {
					mustHavePostalCode: true,
				},
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});

	describe("dirty state", () => {
		let formIsDirty: boolean;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};
		const json: IFrontendEngineData = {
			id: FRONTEND_ENGINE_ID,
			sections: {
				section: {
					uiType: "section",
					children: {
						[COMPONENT_ID]: {
							label: LABEL,
							uiType: UI_TYPE,
						},
						...getSubmitButtonProps(),
						...getResetButtonProps(),
					},
				},
			},
		};

		beforeEach(() => {
			getCurrentLocationSpy.mockRejectedValue({ code: 1 });
			fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
				onSuccess(mock1PageFetchAddressResponse);
			});
			formIsDirty = undefined;
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			await waitFor(() => window.dispatchEvent(new Event("online")));
			getLocationInput().focus();
			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
			});
			within(getCurrentLocationErrorModal(true)).getByRole("button").click();
			fireEvent.change(getLocationSearchInput(), { target: { value: "found something" } });
			await waitFor(() => {
				expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
			});
			const resultContainer = getLocationSearchResults();
			const selectedResult = resultContainer.getElementsByTagName("div")[0];
			fireEvent.click(selectedResult);
			fireEvent.click(getLocationModalControlButtons("Confirm"));
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...json,
						defaultValues: {
							[COMPONENT_ID]: {
								address: "Fusionopolis View",
							},
						},
					}}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			await waitFor(() => window.dispatchEvent(new Event("online")));
			getLocationInput().focus();
			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
			});
			within(getCurrentLocationErrorModal(true)).getByRole("button").click();
			fireEvent.change(getLocationSearchInput(), { target: { value: "found something" } });
			await waitFor(() => {
				expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
			});
			const resultContainer = getLocationSearchResults();
			const selectedResult = resultContainer.getElementsByTagName("div")[0];
			fireEvent.click(selectedResult);
			fireEvent.click(getLocationModalControlButtons("Confirm"));

			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...json,
						defaultValues: {
							[COMPONENT_ID]: {
								address: "Fusionopolis View",
							},
						},
					}}
					onClick={handleClick}
				/>
			);
			await waitFor(() => window.dispatchEvent(new Event("online")));
			getLocationInput().focus();
			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
			});
			within(getCurrentLocationErrorModal(true)).getByRole("button").click();
			fireEvent.change(getLocationSearchInput(), { target: { value: "found something" } });
			await waitFor(() => {
				expect(getLocationSearchResults(true)).not.toBeEmptyDOMElement();
			});
			const resultContainer = getLocationSearchResults();
			const selectedResult = resultContainer.getElementsByTagName("div")[0];
			fireEvent.click(selectedResult);
			fireEvent.click(getLocationModalControlButtons("Confirm"));

			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	describe("search results list title", () => {
		beforeEach(async () => {
			fetchAddressSpy.mockImplementation((queryString, pageNumber, onSuccess) => {
				onSuccess(mock1PageFetchAddressResponse);
			});
			fetchSingleLocationByLatLngSpy.mockImplementation(
				(_reverseGeoCodeEndpoint, _convertLatLngToXYEndpoint, _lat, _lng, handleResult) => {
					handleResult(fetchSingleLocationByLatLngSingleReponse);
				}
			);
		});

		it("should show default location list title if locationListTitle is not provided", async () => {
			renderComponent({
				withEvents: false,
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: {
							lat: 1.29994179707526,
							lng: 103.789404349716,
						},
					},
				},
				overrideField: {
					reverseGeoCodeEndpoint: "https://www.mock.com/reverse-geo-code",
				},
			});
			await waitFor(() => {
				const locationListTitle = screen.getByText("Select location");
				expect(locationListTitle).toBeInTheDocument();
			});
		});

		it("should show location list title according to locationListTitle", async () => {
			renderComponent({
				withEvents: false,
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: {
							lat: 1.29994179707526,
							lng: 103.789404349716,
						},
					},
				},
				overrideField: {
					reverseGeoCodeEndpoint: "https://www.mock.com/reverse-geo-code",
					locationListTitle: "Nearest car parks",
				},
			});
			await waitFor(() => {
				const locationListTitle = screen.getByText("Nearest car parks");
				expect(locationListTitle).toBeInTheDocument();
			});
		});
	});

	describe("Permission Modal events", () => {
		it("should hide location modal for strict location", async () => {
			renderComponent({
				withEvents: true,
				locationDetails: {
					errors: {
						generic: "throw something",
					},
				},
				eventType: ELocationInputEvents.BEFORE_HIDE_PERMISSION_MODAL,
				eventListener: (formRef: IFrontendEngineRef) => (e) => {
					formRef.dispatchFieldEvent(UI_TYPE, ELocationInputEvents.DISMISS_LOCATION_MODAL, COMPONENT_ID);
				},
			});

			await waitFor(() => window.dispatchEvent(new Event("online")));

			getLocationInput().focus();

			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
			});

			within(getCurrentLocationErrorModal(true)).getByRole("button").click();

			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).not.toBeInTheDocument();
				expect(getLocationModal(true)).not.toBeInTheDocument();
			});
		});

		it("should hide permission modal and still show location modal for non-strict location", async () => {
			renderComponent({
				withEvents: true,
				locationDetails: {
					errors: {
						generic: "throw something",
					},
				},
				eventType: ELocationInputEvents.BEFORE_HIDE_PERMISSION_MODAL,
				eventListener: (formRef: IFrontendEngineRef) => (e) => {
					formRef.dispatchFieldEvent(UI_TYPE, ELocationInputEvents.HIDE_PERMISSION_MODAL, COMPONENT_ID);
				},
			});

			await waitFor(() => window.dispatchEvent(new Event("online")));

			getLocationInput().focus();

			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).toBeInTheDocument();
			});

			within(getCurrentLocationErrorModal(true)).getByRole("button").click();

			await waitFor(() => {
				expect(getCurrentLocationErrorModal(true)).not.toBeInTheDocument();
				expect(getLocationModal(true)).toBeInTheDocument();
			});
		});
	});
});
