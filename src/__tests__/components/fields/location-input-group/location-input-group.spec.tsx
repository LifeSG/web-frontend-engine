import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import { FrontendEngine, IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../../components";
import { ILocationInputSchema, TSetCurrentLocationDetail } from "../../../../components/fields";
import {
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getField,
	getResetButtonProps,
	getSubmitButtonProps,
} from "../../../common";
import { TestHelper } from "../../../../utils";
import { MediaWidths } from "@lifesg/react-design-system";
import { MutableRefObject, useEffect, useRef } from "react";
const { matchMedia } = global;

class MockMediaQueryList {
	public readonly media: string;
	public matches: boolean;
	private defaultMedia = "desktop maybe?";
	private listeners?: ((e: MediaQueryListEvent) => void)[];

	public constructor(media: string) {
		this.media = media;
		this.listeners = [];
		this.matches = media == this.defaultMedia; // FIXME
	}

	public addEventListener(listener) {
		this.listeners.push(listener);
	}

	public removeEventListener(listener) {
		const index = this.listeners.indexOf(listener);
		if (index > -1) {
			this.listeners.splice(index, 1);
		}
	}

	// Simulate the change event by triggering the listeners
	public change(newMediaQuery: string) {
		this.matches = newMediaQuery === this.media;
		this.listeners.forEach((listener) =>
			listener(new MediaQueryListEvent("change", { matches: this.matches, media: this.media }))
		);
	}
}

const mockGeolocation = {
	getCurrentPosition: jest.fn(),
	watchPosition: jest.fn(),
	clearWatch: jest.fn(),
};

const setWindowInnerWidth = (width) => {
	Object.defineProperty(window, "innerWidth", {
		writable: true,
		configurable: true,
		value: width,
	});
	window.dispatchEvent(new Event("resize"));
};

class GeolocationPositionError extends Error {
	readonly code: number;
	readonly message: string;
	readonly PERMISSION_DENIED: number;
	readonly POSITION_UNAVAILABLE: number;
	readonly TIMEOUT: number;

	constructor(msg?: string) {
		super(msg);
	}
}

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "location-input";
const LABEL = "Location input";

const mountSpy = jest.fn();
const setCurrentLocationSpy = jest.fn();

enum ELocationInputEvents {
	"SET_CURRENT_LOCATION" = "set-current-location",
	"GET_CURRENT_LOCATION" = "get-current-location",
	"MOUNT" = "mount",
}
interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	locationDetails?: TSetCurrentLocationDetail;
	withEvents: boolean;
}
const FrontendEngineWithEventListener = ({
	withEvents,
	locationDetails,
	...otherProps
}: ICustomFrontendEngineProps) => {
	const formRef = useRef<IFrontendEngineRef>();

	useEffect(() => {
		if (!withEvents && locationDetails) return;
		const { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener } = formRef.current;

		const handleAddFieldEventListener = () => {
			addFieldEventListener(
				ELocationInputEvents.GET_CURRENT_LOCATION,
				COMPONENT_ID,
				setCurrentLocationSpy.mockImplementation(() => {
					dispatchFieldEvent<TSetCurrentLocationDetail>(
						ELocationInputEvents.SET_CURRENT_LOCATION,
						COMPONENT_ID,
						locationDetails
					);
				})
			);

			addFieldEventListener(ELocationInputEvents.MOUNT, COMPONENT_ID, mountSpy);
		};

		const handleRemoveFieldEventListener = () => {
			removeFieldEventListener(ELocationInputEvents.GET_CURRENT_LOCATION, COMPONENT_ID, setCurrentLocationSpy);
		};

		handleAddFieldEventListener();
		return () => handleRemoveFieldEventListener();
	}, []);

	return <FrontendEngine {...otherProps} ref={formRef} />;
};

interface IRenderProps {
	overrideField?: TOverrideField<ILocationInputSchema>;
	overrideSchema?: TOverrideSchema;
	withEvents: boolean;
	locationDetails?: TSetCurrentLocationDetail;
}

const renderComponent = (
	{ overrideField, overrideSchema, locationDetails, withEvents }: IRenderProps = { withEvents: false }
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
						...overrideField,
					},
					...getSubmitButtonProps(),
					...getResetButtonProps(),
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
		/>
	);
};

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
 * mock one map
 */

describe("location-input-group", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		// Possibly refactor screen size detection
		// How to synchronize
		// global.matchMedia
		// MockMediaQueryList
		// use global.matchMedia.simulateChange

		delete window.matchMedia;
		global.matchMedia = jest.fn().mockImplementation((query: string) => {
			return new MockMediaQueryList(query);
		});
	});

	afterEach(() => {
		window.matchMedia = matchMedia;
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
		// test cleanup
		it("should fire mount event on mount", async () => {
			await renderComponent();

			expect(mountSpy).toBeCalled();
		});
		// device geolocation
		describe.only("geolocation events", () => {
			// When does it request
			// - open location
			// - when you click on the picker button
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

				screen.getByTestId("input").focus();

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
							GeolocationPositionError: {
								code: "3",
							},
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

				expect(
					screen.queryByTestId(TestHelper.generateId(COMPONENT_ID, "modal", "show"))
				).not.toBeInTheDocument();
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
		// should we also invert the onemap service?
	});

	describe("functionality", () => {
		it("should be able to render the location input field", async () => {
			await renderComponent();

			expect(screen.getByTestId(COMPONENT_ID)).toBeInTheDocument();
			expect(screen.getByLabelText(LABEL)).toBeInTheDocument();
		});

		describe.skip("when there are default values", () => {
			it.todo("should show both static map and input value and open the modal when clicked");

			it.todo("should show static map only and open the modal when clicked");

			it.todo("show input value only and open the modal when clicked");

			// What other scenarios?
		});

		// cancelled

		// something in state

		describe("when the location modal is open", () => {
			// what it should do
			// mobile
			// desktop

			describe("when there is internet connectivity", () => {
				beforeEach(async () => {
					await renderComponent();

					await waitFor(() => window.dispatchEvent(new Event("online")));
				});

				// on what state and flow
				it("should open location modal when input is clicked", async () => {
					fireEvent.click(screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-input")));

					// this case might a false pass
					await waitFor(() => {
						expect(
							screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-picker"))
						).toBeInTheDocument();
					});
				});

				describe.skip("when geolocation is not supported", () => {
					// ?
				});

				// FIX geolocation mocking
				describe.skip("when geolocation is supported", () => {
					describe.skip("when geolocation is not enabled", () => {
						it("should warn user about location not enabled and allow the user to continue after dismissing modal", async () => {
							await waitFor(() =>
								fireEvent.click(
									screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-input"))
								)
							);

							await waitFor(() => {
								expect(
									screen.getByTestId(
										TestHelper.generateId(COMPONENT_ID, "get-location-error", "show")
									)
								).toBeInTheDocument();
							});

							await waitFor(() =>
								fireEvent.click(screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "btn-ok")))
							);

							expect(
								screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-picker"))
							).toBeInTheDocument();
						});
					});

					describe.skip("when geolocation is enabled", () => {
						// do smth
					});

					// geolocation state changes?
				});

				// rename
				describe("when user does smth", () => {
					// device specific screen behaviour
					describe.skip("when on tablet", () => {
						// beforeEach(() => {
						// 	setWindowInnerWidth(MediaWidths.tablet);
						// });
						// verifiy map and search switching behaviour
					});

					describe.skip("when on desktop", () => {
						// beforeEach(() => {
						// 	setWindowInnerWidth(MediaWidths.desktopL);
						// });
						// verify double panel behaviour
					});

					// on what state?
					// on what flow
					// how to detect double or single panel?
					it("should show the map picker", () => {
						expect(
							screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-search-modal-input"))
						).toBeInTheDocument();

						expect(
							screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-picker"))
						).toBeInTheDocument();

						expect(
							screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-search-results"))
								.offsetHeight
						).toEqual(0);

						expect(
							screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-search-controls"))
						).toBeInTheDocument();
					});

					// fix broken test
					describe.skip("when using location picker", () => {
						// map touch controls
						// zoom
						// recenter
						// click to search
					});

					describe.skip("when using location search", () => {
						// query interaction
						it("should automatically search as user types", () => {
							// how does user navigate to the search input
							// click
							// type
							// select

							// click
							// type
							// clear
							fireEvent.change(
								screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-search-modal-input")),
								{ target: { value: "A" } }
							);

							// write better test
							// how to test external components?
							expect(
								screen.getByTestId(TestHelper.generateId(COMPONENT_ID, "location-search-results"))
									.offsetHeight
							).not.toEqual(0);
						});

						it.todo("should allow user to select result");

						it.todo("should allow user to scroll to see more results");

						it.todo("should allow user to clear query string");
					});

					describe.skip("when actions cause cross component state change", () => {
						// search behaviours?
						describe.skip("when user click map", () => {
							// do smth
						});

						describe.skip("when user selects a search result", () => {
							// do smth
						});

						describe.skip("when user clears query", () => {
							// do smth
						});

						describe.skip("when user recenters", () => {
							// do smth
						});
					});

					describe.skip("map controls", () => {
						it.todo("should allow user to close the modal");

						it.todo("should allow user to cancel");

						it.todo("should allow user to continue with selection");
					});

					describe.skip("when user continue", () => {
						it.todo("should show both static map and input value and dismiss location modal");
					});
				});
			});

			describe.skip("when internet connectivity errors occurs", () => {
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
			describe.skip("network errors", () => {
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
	});

	describe.skip("customisation", () => {
		it.todo("should support placeholder texts");
	});
});
