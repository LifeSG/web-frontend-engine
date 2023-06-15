import { Text } from "@lifesg/react-design-system/text";
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { OneMapBoolean } from "../../../../../services/onemap/types";
import { TestHelper } from "../../../../../utils";
import { useFieldEvent } from "../../../../../utils/hooks";
import { Prompt } from "../../../../shared";
import { LocationHelper, ONE_MAP_ERROR_NAME } from "../../location-helper";
import {
	IDisplayResultListParams,
	ILocationSearchProps,
	IResultListItem,
	IResultsMetaData,
	TSetCurrentLocationDetail,
} from "../../types";
import { InfiniteScrollList } from "../infinite-scroll";
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
	SearchBarIcon,
	SearchBarIconButton,
	SearchBarInput,
	SearchBarModalCross,
	SearchWrapper,
} from "./location-search.styles";

const LocationPinBlack = "https://assets.life.gov.sg/web-frontend-engine/img/icons/location-pin-black.svg";
const SearchSvg = "https://assets.life.gov.sg/web-frontend-engine/img/icons/search.svg";

export const LocationSearch = ({
	id = "location-search",
	formValues,
	gettingCurrentLocation,

	showLocationModal,
	mustHavePostalCode,

	panelInputMode,
	selectedAddressInfo,
	mapPickedLatLng,

	reverseGeoCodeEndpoint,
	addressFieldPlaceholder = "Street Name, Postal Code",
	gettingCurrentLocationFetchMessage = "Getting current location...",
	locationListTitle = "Select location",

	handleApiErrors,

	onGetLocationCallback,
	onChangeSelectedAddressInfo,
	onCancel,
	onConfirm,

	setSinglePanelMode,
	updateFormValues,
}: ILocationSearchProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { addFieldEventListener, removeFieldEventListener } = useFieldEvent();

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
		pagination,
		debounceFetchAddress,
		cleanHtml,
		fetchSingleLocationByAddress,
		fetchSingleLocationByLatLng,
		boldResultsWithQuery,
		fetchLocationList,
	} = LocationHelper;

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
				handleApiErrors(new Error(ONE_MAP_ERROR_NAME, { cause: error }));
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
			if (!isEmpty(errors)) {
				handleApiErrors(errors);
				return;
			}

			// TODO: no op or error? onGetLocationError(undefined, disableErrorPromptOnApp)
			if (!payload?.lat || !payload?.lng) return;

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
		/**
		 * then the external api will have transform to this internal representation
		 *
		 * when saving to form we transform into the forms representation
		 */
		const handleResult = ({ displayAddressText, ...locationInputValue }: IResultListItem) => {
			const validPostalCode =
				!mustHavePostalCode || LocationHelper.hasGotAddressValue(locationInputValue.postalCode);

			if (isEmpty(locationInputValue) || !validPostalCode) {
				updateFormValues({});
				onChangeSelectedAddressInfo({});
				return;
			}

			// complete form state with valid location
			updateFormValues(locationInputValue);

			// set map mode
			// reset user click map
			// trigger smth in search
			// - no references
			// trigger smth in picker
			// - zoom with markers
			onChangeSelectedAddressInfo(locationInputValue);

			// FIXME edge case: reopening more than once the location modal will not cause a query string rerender
			// search deps
			// - if no address, reset list
			// - debounceFetchAddress
			//   - setSelectedIndex
			// 	 - populateDisplayList
			setQueryString(locationInputValue.address);
		};

		if (formValues?.lat && formValues?.lng && formValues?.address) {
			// TODO: trust input or validate formvalue?
			fetchSingleLocationByAddress(formValues.address, handleResult, handleApiErrors);
		} else if (formValues?.address && !formValues?.lat && !formValues?.lng) {
			fetchSingleLocationByAddress(formValues.address, handleResult, handleApiErrors);
		} else if (reverseGeoCodeEndpoint && !formValues?.address && formValues?.lat && formValues?.lng) {
			fetchSingleLocationByLatLng(
				reverseGeoCodeEndpoint,
				formValues.lat,
				formValues.lng,
				handleResult,
				handleApiErrors
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
	 * when to search
	 * - querystring changes
	 * - querystring is not empty
	 * when will query string change
	 * (which should not cause this to run again)
	 * - prefill on mount (r)
	 * - handleClickCancel (nr) (p)
	 * - handleInputChange (r)
	 * - handleClearInput (nr)
	 * - handleClickResult (nr) (p) handled
	 * - displayLocationList
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

				if (resultRef.current.scrollTo) {
					resultRef.current.scrollTo(0, 0);
				}
			},
			(e) => {
				if (e instanceof SyntaxError || e instanceof TypeError) {
					populateDisplayList({ results: [], queryString });
				} else {
					resetResultsList();
					handleApiErrors(new Error(ONE_MAP_ERROR_NAME, { cause: e }));
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

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleClickCancel = () => {
		resetResultsList();
		setQueryString(formValues?.address || "");
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
		const { displayAddressText, ...locationInputValue } = listitem;
		if (mustHavePostalCode && !LocationHelper.hasGotAddressValue(locationInputValue.postalCode)) {
			setShowPostalCodeError(true);
			return;
		}

		setResultState("found");
		setSelectedIndex(index);
		setQueryString(locationInputValue.address ?? "");
		onChangeSelectedAddressInfo(locationInputValue);
	};

	const handleScrollResult = () => {
		if (resultRef.current) {
			if (resultRef.current.scrollTop > 0 && !hasScrolled) {
				setHasScrolled(true);
			} else if (resultRef.current.scrollTop <= 0 && hasScrolled) {
				setHasScrolled(false);
			}
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const resetResultsList = () => {
		setLoading(false);
		setSelectedIndex(-1);
		setCurrentPaginationPageNum(1);
		setTotalNumPages(0);
		setAPIPageNum(0);
		setAPIResults([]);
		setSearchBuildingResults([]);
		if (resultRef.current.scrollTo) {
			resultRef.current.scrollTo(0, 0);
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
	 * all the data will be dumped into you
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
				() => {
					resetResultsList();
					handleApiErrors(new Error(ONE_MAP_ERROR_NAME));
				}
			);
		}
	};

	/**
	 * Used when
	 * - getting current location
	 * - internet restored
	 * - map picked latlng
	 *
	 * When in map mode, should the view switch search mode?
	 * If not, result is hidden
	 */
	const displayResultsFromLatLng = async (addressLat: number, addressLng: number) => {
		if (!reverseGeoCodeEndpoint) return;

		let resultListItem: IResultListItem[];
		try {
			resultListItem = await fetchLocationList(
				reverseGeoCodeEndpoint,
				addressLat,
				addressLng,
				mustHavePostalCode,
				reverseGeocodeAborter,
				handleApiErrors,
				true
			);
		} catch (error) {
			setQueryString("");
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
		populateDisplayList({ results: resultListItem });

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [{ displayAddressText, ...firstItem }] = resultListItem;

		if (mustHavePostalCode && !LocationHelper.hasGotAddressValue(firstItem.address)) {
			setShowPostalCodeError(true);
			setQueryString("");
			return;
		}

		setQueryString(firstItem.address);

		onChangeSelectedAddressInfo(firstItem);
		setSelectedIndex(0);
	};

	// reverse geocode dumps all
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
	const renderList = () => {
		return searchBuildingResults.map((item, index) => (
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
				<ResultItemPin src={LocationPinBlack} alt="Location" />
				<Text.BodySmall dangerouslySetInnerHTML={cleanHtml(item.displayAddressText)}></Text.BodySmall>
			</ResultItem>
		));
	};

	// TODO: make it generic?
	const renderPostalCodeError = () => (
		<Prompt
			id={`${id}-postal-code-error`}
			title="Oops"
			size="large"
			show={true}
			description="The location you have selected does not contain a postal code. Please pick the building where the high-rise littering took place."
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
					>
						<SearchBarIcon src={SearchSvg} alt="Search" />
					</SearchBarIconButton>
					<SearchBarInput
						id={TestHelper.generateId(id, "location-search-modal-input")}
						data-testid={TestHelper.generateId(id, "location-search-modal-input")}
						type="text"
						onFocus={handleInputFocus}
						onChange={handleInputChange}
						placeholder={addressFieldPlaceholder}
						readOnly={gettingCurrentLocation}
						value={!gettingCurrentLocation ? queryString : gettingCurrentLocationFetchMessage}
						ref={inputRef}
					/>

					<SearchBarIconButton
						onClick={handleClearInput}
						id={TestHelper.generateId(id, "location-search-input-clear")}
						data-testid={TestHelper.generateId(id, "location-search-input-clear")}
					>
						<SearchBarCross type="cross" />
					</SearchBarIconButton>
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
