import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { isEmpty } from "lodash";
import { ReactElement, useEffect, useRef, useState } from "react";
import { OneMapService } from "../../../../../services";
import { OneMapBoolean, OneMapError } from "../../../../../services/onemap/types";
import { TestHelper } from "../../../../../utils";
import { useFieldEvent } from "../../../../../utils/hooks";
import { Prompt, Sanitize } from "../../../../shared";
import { LocationHelper } from "../../location-helper";
import {
	GeolocationPositionErrorWrapper,
	IDisplayResultListParams,
	ILocationCoord,
	IResultListItem,
	IResultsMetaData,
	TErrorType,
	TLocationFieldErrorDetail,
	TSetCurrentLocationDetail,
} from "../../types";
import { InfiniteScrollList } from "../infinite-scroll";
import { boldResultsWithQuery, pagination } from "./helper";
import {
	ButtonItem,
	ButtonWrapper,
	NoResultTitle,
	ResultItem,
	ResultItemPin,
	ResultTitle,
	ResultWrapper,
	SearchBarContainer,
	SearchBarCross,
	SearchBarIconButton,
	SearchBarIconWrapper,
	SearchBarInput,
	SearchBarModalCross,
	SearchIcon,
	SearchWrapper,
} from "./location-search.styles";
import { ILocationSearchProps } from "./types";

export const LocationSearch = ({
	id = "location-search",
	className,
	formValues,
	gettingCurrentLocation,

	showLocationModal,
	mustHavePostalCode,
	disableSearch,

	panelInputMode,
	selectedAddressInfo,
	mapPickedLatLng,

	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
	addressFieldPlaceholder = "Street Name, Postal Code",
	gettingCurrentLocationFetchMessage = "Getting current location...",
	locationListTitle = "Select location",

	handleApiErrors,

	onGetLocationCallback,

	// set map mode
	// reset user click map
	// trigger smth in search
	// - no references
	// trigger smth in picker
	// - zoom with markers
	onChangeSelectedAddressInfo,
	onCancel,
	onConfirm,

	setSinglePanelMode,
	updateFormValues,
	restrictLocationSelection,
	selectablePins,
	searchBarIcon = "search",
	bufferRadius,
}: ILocationSearchProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { addFieldEventListener, removeFieldEventListener, dispatchFieldEvent } = useFieldEvent();

	const inputRef = useRef<HTMLInputElement>(null);
	const resultRef = useRef<HTMLDivElement>(null);
	const reverseGeocodeAborter = useRef<AbortController | null>(null);

	const [hasScrolled, setHasScrolled] = useState(false);
	const [queryString, setQueryString] = useState("");
	const [showPostalCodeError, setShowPostalCodeError] = useState(false);

	// searching
	const [resultState, setResultState] = useState<"pristine" | "found" | "not-found">("pristine");

	// USED TO SHOW AS SEARCH RESULTS
	const [loading, setLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [searchBuildingResults, setSearchBuildingResults] = useState<IResultListItem[]>([]);
	const [apiResults, setAPIResults] = useState<IResultListItem[]>([]);

	// pagination logic
	const PAGE_SIZE = 10;
	const [hasNextPage, setHasNextPage] = useState(false);
	const [totalNumPages, setTotalNumPages] = useState(0);
	const [apiPageNum, setAPIPageNum] = useState(1);
	const [currentPaginationPageNum, setCurrentPaginationPageNum] = useState(1);
	const {
		debounceFetchAddress,
		fetchSingleLocationByAddress,
		fetchSingleLocationByLatLng,
		fetchLocationList,
		hasGotPinLocationValue,
		checkAndSetPinLocationAsResult,
	} = LocationHelper;

	const iconPath: Record<typeof searchBarIcon, ReactElement> = {
		search: <SearchIcon />,
		"location-pin": <PinFillIcon />,
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	// check if any of the services is working
	useEffect(() => {
		if (!showLocationModal) return;
		// check if one map or reverse code is working
		// - get location error
		// - first load
		// the map should not be usable if any of these services fail
		const reverseGeoCodeCheck = async () => {
			try {
				LocationHelper.reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: 1.29994179707526,
					longitude: 103.789404349716,
					bufferRadius: 1,
					abortSignal: reverseGeocodeAborter.current.signal,
					otherFeatures: OneMapBoolean.YES,
				});
			} catch (error) {
				handleApiErrors(new OneMapError(error));
			}
		};
		Promise.all([debounceFetchAddress("singapore", 1, undefined, handleApiErrors), reverseGeoCodeCheck()]);
	}, []);

	useEffect(() => {
		if (!navigator.onLine) return;
		// internet restored
		if (!queryString && selectedAddressInfo?.lat && selectedAddressInfo?.lng) {
			displayResultsFromLatLng(selectedAddressInfo.lat, selectedAddressInfo.lng);
			return;
		}
	}, [navigator.onLine]);

	// Attach event handlers
	useEffect(() => {
		const setCurrentLocationHandler = ({ detail: { payload, errors } }: CustomEvent<TSetCurrentLocationDetail>) => {
			if (errors instanceof Object && errors.code !== undefined) {
				handleApiErrors(new GeolocationPositionErrorWrapper(errors));
				return;
			}

			if (!isEmpty(errors)) {
				handleApiErrors(errors);
				return;
			}

			// TODO: no op or error?
			if (!payload?.lat || !payload?.lng) return;

			dispatchFieldEvent<ILocationCoord>("get-selectable-pins", id, payload);
			const { lat, lng } = payload;
			displayResultsFromLatLng(lat, lng);
			onGetLocationCallback(lat, lng);
		};

		addFieldEventListener("set-current-location", id, setCurrentLocationHandler);

		return () => {
			removeFieldEventListener("set-current-location", id, setCurrentLocationHandler);
		};
	}, []);

	/**
	 * Prefill based on lat lng or address with the appropriate api
	 */
	useEffect(() => {
		const handleResult = ({ displayAddressText, ...locationFieldValue }: IResultListItem) => {
			const validPostalCode =
				!mustHavePostalCode || LocationHelper.hasGotAddressValue(locationFieldValue.postalCode);

			if (isEmpty(locationFieldValue) || !validPostalCode) {
				updateFormValues({}, false);
				onChangeSelectedAddressInfo({});
				return;
			}

			// complete form state with valid location
			updateFormValues(locationFieldValue, false);
			onChangeSelectedAddressInfo(locationFieldValue);
			setQueryString(locationFieldValue.address);
		};

		const validAddressString = formValues?.address && !formValues?.address.toLowerCase().includes("pin location");

		if (formValues?.lat && formValues?.lng && validAddressString) {
			// TODO: trust input or validate formvalue?
			fetchSingleLocationByAddress(formValues.address, handleResult, handleApiErrors);
		} else if (validAddressString && !formValues?.lat && !formValues?.lng) {
			fetchSingleLocationByAddress(formValues.address, handleResult, handleApiErrors);
		} else if (reverseGeoCodeEndpoint && !validAddressString) {
			let reverseGeoCodeLat = formValues?.lat;
			let reverseGeoCodeLng = formValues?.lng;
			// extract latlng
			// falls back to formValues.lat, formValues.lng if address string is in the wrong format
			if (hasGotPinLocationValue(formValues?.address)) {
				const [lat, lng] = formValues.address
					.split(":")[1]
					.split(",")
					.map((value) => parseFloat(value.trim()));

				reverseGeoCodeLat = lat;
				reverseGeoCodeLng = lng;
			}

			if (!reverseGeoCodeLat || !reverseGeoCodeLng) {
				return;
			}

			fetchSingleLocationByLatLng(
				reverseGeoCodeEndpoint,
				convertLatLngToXYEndpoint,
				reverseGeoCodeLat,
				reverseGeoCodeLng,
				handleResult,
				handleApiErrors,
				mustHavePostalCode
			);
		}
	}, []);

	/**
	 * Gets the address of the location with lat lng when user clicks on the map
	 */
	useEffect(() => {
		if (!mapPickedLatLng?.lat || !mapPickedLatLng?.lng) return;
		displayResultsFromLatLng(mapPickedLatLng.lat, mapPickedLatLng.lng);
	}, [mapPickedLatLng?.lat, mapPickedLatLng?.lng]);

	/**
	 * Handles query searching and search results display
	 */
	useEffect(() => {
		if (resultState === "found") return;

		const parsedString = validateQueryString(queryString);
		if (!parsedString) return resetResultsList();
		if (
			(inputRef.current?.value !== gettingCurrentLocationFetchMessage &&
				inputRef.current?.value !== selectedAddressInfo?.address) ||
			resultState === "pristine"
		) {
			setLoading(true);
		}

		debounceFetchAddress(
			parsedString,
			1,
			(res: IResultsMetaData) => {
				if (res.results.length == 0 && hasGotPinLocationValue(parsedString)) {
					res = checkAndSetPinLocationAsResult(queryString);
				}

				if (selectedAddressInfo?.address === parsedString) {
					setSelectedIndex(0);
				} else {
					setSelectedIndex(-1);
				}

				// paginated
				populateDisplayList({
					results: res.results,
					queryString,
					boldResults: true,
					apiPageNum: res.apiPageNum,
					totalNumPages: res.totalNumPages,
				});

				if (resultRef.current?.scrollTo) {
					resultRef.current?.scrollTo(0, 0);
				}
			},
			(error) => {
				if (error instanceof SyntaxError || error instanceof TypeError) {
					populateDisplayList({ results: [], queryString });
				} else {
					resetResultsList();
					handleApiErrors(new OneMapError(error));
				}
			}
		);
	}, [PAGE_SIZE, queryString]);

	// Determine if there are more items to be fetched
	useEffect(() => {
		setHasNextPage(false);
		if (apiPageNum < totalNumPages) {
			setHasNextPage(true);
		}
		if (currentPaginationPageNum < apiResults.length / PAGE_SIZE) {
			setHasNextPage(true);
		}
	}, [totalNumPages, apiPageNum, currentPaginationPageNum, apiResults.length, PAGE_SIZE]);

	useEffect(() => {
		if (selectablePins.length) {
			populateDisplayList({
				results: selectablePins.map((pin) => ({
					...pin,
					displayText: pin.resultListItemText,
					displayAddressText: pin.resultListItemText,
				})),
			});
		}
	}, [selectablePins]);

	useEffect(() => {
		if (selectedAddressInfo.address) {
			setQueryString(selectedAddressInfo.address);
		}
	}, [selectedAddressInfo.address]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleClickCancel = () => {
		const validFormLocation = formValues?.address && formValues?.lat && formValues?.lng;
		if (validFormLocation) {
			setQueryString(formValues.address);
		} else {
			setQueryString("");
			resetResultsList();
		}
		setResultState("pristine");
		onCancel();
	};

	const handleInputFocus = () => {
		inputRef.current?.focus();
		if (searchBuildingResults.length > 0) {
			setSinglePanelMode("search");
		}
	};

	const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setQueryString(value);
		setResultState("pristine");
		setSinglePanelMode("search");
	};

	const handleClearInput = () => {
		setQueryString("");
		setResultState("pristine");
		setSinglePanelMode("map");
	};

	const handleClickResult = (listitem: IResultListItem, index: number) => {
		const { displayAddressText, ...locationFieldValue } = listitem;
		if (mustHavePostalCode && !LocationHelper.hasGotAddressValue(locationFieldValue.postalCode)) {
			handleError("PostalCodeError", () => {
				setShowPostalCodeError(true);
			});
			return;
		}

		setResultState("found");
		setSelectedIndex(index);
		setQueryString(locationFieldValue.address ?? "");
		onChangeSelectedAddressInfo(locationFieldValue);
	};

	const handleScrollResult = () => {
		if (resultRef.current) {
			if (resultRef.current?.scrollTop > 0 && !hasScrolled) {
				setHasScrolled(true);
			} else if (resultRef.current?.scrollTop <= 0 && hasScrolled) {
				setHasScrolled(false);
			}
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleError = (errorType: TErrorType["errorType"], defaultHandle: () => void) => {
		const shouldPreventDefault = !dispatchFieldEvent<TLocationFieldErrorDetail>("error", id, {
			payload: {
				errorType,
			},
		});

		if (shouldPreventDefault) return;
		defaultHandle();
	};

	const resetResultsList = () => {
		setSelectedIndex(-1);
		setCurrentPaginationPageNum(1);
		setTotalNumPages(0);
		setAPIPageNum(0);
		setAPIResults([]);
		setSearchBuildingResults([]);
		if (resultRef.current?.scrollTo) {
			resultRef.current?.scrollTo(0, 0);
		}
	};

	/**
	 * two get more address use case
	 * if you are searching by fetch address
	 * - searching through input field
	 * there will be pagination through the api
	 *
	 * if your are searching by reverse geocode endpoint
	 * clicking on map
	 * all the data will be fetched
	 */
	const getMoreLocationResults = () => {
		setLoading(true);

		if (searchBuildingResults.length < apiResults.length) {
			const newCurrentPageNum = currentPaginationPageNum + 1;
			setCurrentPaginationPageNum(newCurrentPageNum);
			const data = pagination(apiResults, PAGE_SIZE, newCurrentPageNum);
			const boldData = boldResultsWithQuery(data, queryString);
			setSearchBuildingResults(searchBuildingResults.concat(boldData));
			setLoading(false);
		} else {
			debounceFetchAddress(
				queryString,
				apiPageNum + 1,
				(res) => {
					const results = boldResultsWithQuery(res.results, queryString);
					if (results.length > PAGE_SIZE) {
						const data = pagination(results, PAGE_SIZE, 1);
						setSearchBuildingResults(searchBuildingResults.concat(data));
					} else {
						setSearchBuildingResults(searchBuildingResults.concat(results));
					}

					setAPIResults(apiResults.concat(results));
					setTotalNumPages(res.totalNumPages);
					setLoading(false);
					setAPIPageNum(res.apiPageNum);
				},
				(error) => {
					resetResultsList();
					handleApiErrors(new OneMapError(error));
				}
			);
		}
	};

	/**
	 * Used when
	 * - getting current location
	 * - internet restored
	 * - map picked latlng
	 */
	const displayResultsFromLatLng = async (addressLat: number, addressLng: number) => {
		if (!reverseGeoCodeEndpoint) return;
		const onError = (error: any) => {
			setQueryString("");
			handleApiErrors(error);
		};

		if (selectablePins.length) {
			const index = selectablePins.findIndex((pin) => pin.lat === addressLat && pin.lng === addressLng);
			setSelectedIndex(index);
			setQueryString(selectablePins[index]?.address ?? "");
			onChangeSelectedAddressInfo({
				lat: addressLat,
				lng: addressLng,
				address: selectablePins[index]?.address,
			});
			return;
		}

		let resultListItem: IResultListItem[];
		try {
			resultListItem = await fetchLocationList(
				reverseGeoCodeEndpoint,
				addressLat,
				addressLng,
				mustHavePostalCode,
				reverseGeocodeAborter,
				onError,
				true,
				bufferRadius
			);
		} catch (error) {
			return;
		}

		if (resultListItem.length === 0) {
			setQueryString("");
			const shouldPanToCurrentLocation =
				selectedAddressInfo.lat !== addressLat || selectedAddressInfo.lng !== addressLng;
			if (shouldPanToCurrentLocation) {
				onChangeSelectedAddressInfo({
					lat: addressLat,
					lng: addressLng,
				});
			}
			return;
		}

		resultRef.current?.scrollTo(0, 0);

		const nearestLocationIndex = LocationHelper.getNearestLocationIndexFromList(
			resultListItem,
			addressLat,
			addressLng,
			mustHavePostalCode
		);
		const nearestLocation = resultListItem[nearestLocationIndex];

		if (!nearestLocation || (mustHavePostalCode && !LocationHelper.hasGotAddressValue(nearestLocation.address))) {
			setShowPostalCodeError(true);
			setQueryString("");
			return;
		}

		if (!restrictLocationSelection) {
			populateDisplayList({ results: resultListItem });
			setQueryString(nearestLocation.address);
			setSelectedIndex(nearestLocationIndex);
		}

		const locationFieldValue = {
			...nearestLocation,
			lat: addressLat,
			lng: addressLng,
		};
		if (convertLatLngToXYEndpoint) {
			const { X, Y } = await OneMapService.convertLatLngToXY(convertLatLngToXYEndpoint, addressLat, addressLng);
			locationFieldValue.x = X;
			locationFieldValue.y = Y;
		}
		onChangeSelectedAddressInfo(locationFieldValue);
	};

	/**
	 * Handles how much to initially show
	 * Configures pagination
	 * Stores proper state
	 */
	const populateDisplayList = (params: IDisplayResultListParams) => {
		const { results, boldResults, apiPageNum, totalNumPages, queryString } = params;

		let displayResults = results;
		if (boldResults && queryString) {
			displayResults = boldResultsWithQuery(displayResults, queryString);
		}

		if (displayResults.length > PAGE_SIZE) {
			const data = pagination(displayResults, PAGE_SIZE, 1);
			setSearchBuildingResults(data);
		} else {
			setSearchBuildingResults(displayResults);
		}

		setAPIResults(results);
		setTotalNumPages(totalNumPages || 1);
		setLoading(false);
		setAPIPageNum(apiPageNum || 1);
		setResultState(displayResults.length > 0 ? "found" : "not-found");
	};

	const validateQueryString = (stringToQuery: string) => {
		if (!stringToQuery) return;
		return stringToQuery.trim().replace(/^[$\s]*/, "");
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderList = () =>
		searchBuildingResults.map((item, index) => (
			<ResultItem
				key={`${index}_${item.lat}_${item.lng}`}
				onClick={() => handleClickResult(item, index)}
				active={selectedIndex === index}
				id={TestHelper.generateId(`location-search-modal-search-result-${index + 0}`)}
				data-testid={TestHelper.generateId(
					`location-search-modal-search-result-${index + 0}`,
					undefined,
					selectedIndex === index ? "active" : undefined
				)}
			>
				<ResultItemPin />
				<Sanitize
					sanitizeOptions={{
						allowedTags: ["span"],
						allowedAttributes: {
							span: ["class"],
						},
					}}
				>
					{item.displayAddressText}
				</Sanitize>
			</ResultItem>
		));

	const renderPostalCodeError = () => (
		<Prompt
			id={`${id}-postal-code-error`}
			title="Oops"
			size="large"
			show={true}
			description="The location you have selected does not contain a postal code."
			buttons={[
				{
					id: "ok",
					title: "OK",
					onClick: () => setShowPostalCodeError(false),
				},
			]}
		/>
	);

	return (
		<>
			<SearchWrapper
				id={TestHelper.generateId(id, "location-search")}
				data-testid={TestHelper.generateId(id, "location-search")}
				className={`${className}-location-search`}
				panelInputMode={panelInputMode}
			>
				<SearchBarIconButton
					onClick={handleClickCancel}
					id={TestHelper.generateId(id, "location-search-modal-close")}
					data-testid={TestHelper.generateId(id, "location-search-modal-close")}
				>
					<SearchBarModalCross />
				</SearchBarIconButton>
				<SearchBarContainer hasScrolled={hasScrolled}>
					<SearchBarIconButton
						onClick={handleInputFocus}
						id={TestHelper.generateId(id, "location-search-modal-search")}
						data-testid={TestHelper.generateId(id, "location-search-modal-search")}
						disabled={!!disableSearch}
					>
						<SearchBarIconWrapper>{iconPath[searchBarIcon]}</SearchBarIconWrapper>
					</SearchBarIconButton>
					<SearchBarInput
						id={TestHelper.generateId(id, "location-search-modal-input")}
						data-testid={TestHelper.generateId(id, "location-search-modal-input")}
						type="text"
						onFocus={handleInputFocus}
						onChange={handleInputChange}
						placeholder={addressFieldPlaceholder}
						readOnly={gettingCurrentLocation || disableSearch === "readonly"}
						value={!gettingCurrentLocation ? queryString : gettingCurrentLocationFetchMessage}
						ref={inputRef}
						disabled={disableSearch === "disabled"}
					/>
					{!restrictLocationSelection && (
						<SearchBarIconButton
							onClick={handleClearInput}
							id={TestHelper.generateId(id, "location-search-input-clear")}
							data-testid={TestHelper.generateId(id, "location-search-input-clear")}
							disabled={!!disableSearch}
						>
							<SearchBarCross type="cross" />
						</SearchBarIconButton>
					)}
				</SearchBarContainer>
				<ResultWrapper
					id={TestHelper.generateId(id, "location-search-results")}
					data-testid={TestHelper.generateId(id, "location-search-results", panelInputMode)}
					panelInputMode={panelInputMode}
					ref={resultRef}
					onScroll={handleScrollResult}
				>
					{!gettingCurrentLocation && (
						<>
							{searchBuildingResults.length ? <ResultTitle>{locationListTitle}</ResultTitle> : null}
							<InfiniteScrollList
								items={renderList()}
								loading={loading}
								hasNextPage={hasNextPage}
								loadMore={getMoreLocationResults}
							/>
							{!loading && resultState === "not-found" && (
								<NoResultTitle>No results found for &ldquo;{queryString}&rdquo;</NoResultTitle>
							)}
						</>
					)}
				</ResultWrapper>

				<ButtonWrapper
					id={TestHelper.generateId(id, "location-search-controls")}
					data-testid={TestHelper.generateId(id, "location-search-controls")}
					panelInputMode={panelInputMode}
				>
					<ButtonItem buttonType="cancel" styleType="light" onClick={handleClickCancel}>
						Cancel
					</ButtonItem>
					<ButtonItem
						id={TestHelper.generateId(id, "location-search-controls-confirm")}
						data-testid={TestHelper.generateId(id, "location-search-controls-confirm")}
						buttonType="confirm"
						onClick={onConfirm}
						disabled={selectedIndex < 0 || resultState !== "found"}
					>
						{panelInputMode !== "double" ? "Confirm location" : "Confirm"}
					</ButtonItem>
				</ButtonWrapper>
			</SearchWrapper>
			{showPostalCodeError && renderPostalCodeError()}
		</>
	);
};
