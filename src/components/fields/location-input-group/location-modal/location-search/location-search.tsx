import { Text } from "@lifesg/react-design-system/text";
import { isEmpty, isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import LocationPinBlack from "../../../../../assets/img/icons/location-pin-black.svg";
import SearchSvg from "../../../../../assets/img/icons/search.svg";
import { OneMapService } from "../../../../../services";
import {
	OneMapBoolean,
	OneMapGeocodeInfo,
	OneMapSearchBuildingResult,
	OneMapSearchResults,
} from "../../../../../services/onemap/types";
import { GeoLocationHelper, TestHelper } from "../../../../../utils";
import { useFieldEvent } from "../../../../../utils/hooks";
import { Prompt } from "../../../../shared";
import { LocationHelper } from "../../location-helper";
import {
	IListItem,
	ILocationDisplayListParams,
	ILocationInputValues,
	ILocationSearchProps,
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

export const LocationSearch = ({
	id = "location-search",
	formValues,

	gettingCurrentLocation,

	showLocationModal,
	mustHavePostalCode,
	disableErrorPromptOnApp,

	panelInputMode,
	selectedAddressInfo,
	mapPickedLatLng,

	reverseGeoCodeEndpoint,
	addressFieldPlaceholder = "Street Name, Postal Code",
	gettingCurrentLocationFetchMessage = "Getting current location...",
	locationListTitle = "Select location",

	onOneMapError,
	onGetLocationError,

	onGetLocationCallback,

	onChangeSelectedAddressInfo,
	onAddressChange,

	onClearInput,
	onCancel,
	onConfirm,

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
	const [searchBuildingResults, setSearchBuildingResults] = useState<OneMapSearchBuildingResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [apiResults, setAPIResults] = useState<OneMapSearchBuildingResult[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	// pagination logic
	const PAGE_SIZE = 10;
	const [hasNextPage, setHasNextPage] = useState(false);
	const [totalNumPages, setTotalNumPages] = useState(0);
	const [apiPageNum, setAPIPageNum] = useState(1);
	const [currentPaginationPageNum, setCurrentPaginationPageNum] = useState(1);
	const {
		pagination,
		debounceFetchAddress,
		boldResultsWithQuery,
		cleanHtml,
		fetchSingleLocationByAddress,
		fetchSingleLocationByLatLng,
		fetchLocationList,
	} = LocationHelper;

	// =============================================================================
	// EFFECTS
	// =============================================================================

	// Prefill previous values on mount
	useEffect(() => {
		const onSuccess = (locationInputValue: ILocationInputValues) => {
			const validPostalCode =
				!mustHavePostalCode || LocationHelper.hasGotAddressValue(locationInputValue.postalCode);

			console.log("sanity onSuccess: ", {
				locationInputValue,
				validPostalCode,
				emptyTest: isEmpty(locationInputValue) || !validPostalCode,
			});

			if (isEmpty(locationInputValue) || !validPostalCode) {
				console.log("prefill updating empty");

				updateFormValues({});
				console.log("selectedAddressInfo changed: empty Prefill");

				onChangeSelectedAddressInfo({});
				return;
			}

			console.log("prefill updating: ", locationInputValue);

			// sync form state
			updateFormValues(locationInputValue);

			// set map mode
			// reset user click map
			// trigger smth in search
			// - no references
			// trigger smth in picker
			// - zoom with markers
			console.log("selectedAddressInfo changed: Prefill fetch callback");

			onChangeSelectedAddressInfo(locationInputValue);

			// search deps
			// - if no address, reset list
			// - debounceFetchAddress
			//   - setSelectedIndex
			// 	 - populateDisplayList
			console.log("prefill updating after: ", locationInputValue);
			console.log("loc address: ", locationInputValue.address);

			setQueryString(locationInputValue.address);
		};

		// if both
		if (formValues?.lat && formValues?.lng && formValues?.address) {
			// ASK WEILI
			// Two ways
			// we trust user
			// OR
			// we validate and search by lat lng (less buggy)
			// hold in temporary selection
			console.log("selectedAddressInfo changed: prefill trust");
			onChangeSelectedAddressInfo(formValues);
			setQueryString(formValues.address);
			setResultState("found");
			// fill result?

			// if only address
		} else if (formValues?.address && !formValues?.lat && !formValues?.lng) {
			fetchSingleLocationByAddress(formValues.address, onSuccess);
			// if only latlng
		} else if (reverseGeoCodeEndpoint && !formValues?.address && formValues?.lat && formValues?.lng) {
			fetchSingleLocationByLatLng(reverseGeoCodeEndpoint, formValues.lat, formValues.lng, onSuccess);
		}
	}, []);

	// Attach event handlers
	useEffect(() => {
		addFieldEventListener<TSetCurrentLocationDetail>("set-current-location", id, (e) => {
			// TODO better value format
			const {
				detail: { payload, errors },
			} = e;

			// what takes priority?
			// should i check if i need to block on getting current location
			// if (!reverseGeoCodeEndpoint) {
			// 	return;
			// }

			console.log("handling event: set-current-location");

			if (!isEmpty(errors)) {
				onGetLocationError(errors, disableErrorPromptOnApp);
				return;
			}

			if (!payload?.lat || !payload?.lng) {
				// no op or error? onGetLocationError(undefined, disableErrorPromptOnApp)
				console.log("no op");

				return;
			}

			const { lat, lng } = payload;
			//TODO check if need to be synchronous?

			displayLocationList(lat, lng);

			// sync location available
			// finish state
			onGetLocationCallback(lat, lng);
			console.log("completed set-current-location");
		});

		return () => {
			removeFieldEventListener("set-current-location", id, () => {
				// no op
			});
		};
	}, []);

	// check if any of the services is vorking
	useEffect(() => {
		if (!showLocationModal) return;
		// check if one map or reverse code is working
		// - get location error
		// - first load
		// the map should not be usable if any of these services fail
		debounceFetchAddress("singapore", 1, undefined, onOneMapError);
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
			onOneMapError();
		}
	}, []);

	useEffect(() => {
		if (!navigator.onLine) return;
		// internet restored
		if (!queryString && selectedAddressInfo?.lat && selectedAddressInfo?.lng) {
			displayLocationList(selectedAddressInfo.lat, selectedAddressInfo.lng);
			return;
		}
	}, [navigator.onLine]);

	/**
	 * Gets the address of the location where user clicks on the map
	 */
	useEffect(() => {
		// if (!mapPickedLatLng?.lat || !mapPickedLatLng?.lng || !didUserClickMap) return;
		if (!mapPickedLatLng?.lat || !mapPickedLatLng?.lng) return;
		displayLocationList(mapPickedLatLng.lat, mapPickedLatLng.lng);
		// }, [mapPickedLatLng, didUserClickMap]);
	}, [mapPickedLatLng]);

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
	 * - handleClickResult (nr) (p)
	 * - displayLocationList
	 */
	useEffect(() => {
		console.log("isResultsFound", resultState);
		console.log("validateQueryString", queryString);

		if (resultState === "found") return;

		const parsedString = validateQueryString(queryString);

		if (!parsedString) return resetList();

		if (
			inputRef.current?.value !== gettingCurrentLocationFetchMessage &&
			inputRef.current?.value !== selectedAddressInfo?.address
		) {
			setLoading(true);
		}

		console.log("going to debounceFetchAddress");

		debounceFetchAddress(
			parsedString,
			1,
			(res: OneMapSearchResults) => {
				if (selectedAddressInfo?.address === parsedString) {
					setSelectedIndex(0);
				} else {
					setSelectedIndex(-1);
				}
				console.log("going to populateDisplayList");

				// paginated
				populateDisplayList({
					results: res.results,
					queryString,
					boldResults: true,
					apiPageNum: res.pageNum,
					totalNumPages: res.totalNumPages,
				});

				console.log("should populate");

				if (resultRef.current.scrollTo) {
					resultRef.current.scrollTo(0, 0);
				}
			},
			(e) => {
				// This might break if I update api client error handling
				if (e instanceof SyntaxError || e instanceof TypeError) {
					populateDisplayList({ results: [], queryString });
				} else {
					resetList();
					onOneMapError();
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
		resetList();
		setQueryString(formValues?.address || "");
		onCancel();
	};

	const handleInputFocus = () => {
		inputRef.current?.focus();
	};

	const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setQueryString(value);
		setResultState("pristine");
		onAddressChange();
	};

	const handleClearInput = () => {
		setQueryString("");
		resetList();
		setResultState("pristine");
		onClearInput();
	};

	const handleClickResult = (listitem: IListItem, index: number) => {
		const { displayText, ...locationInputValue } = listitem;
		if (mustHavePostalCode && !LocationHelper.hasGotAddressValue(locationInputValue.postalCode)) {
			setShowPostalCodeError(true);
			return;
		}

		setSelectedIndex(index);
		setQueryString(locationInputValue.address ?? "");
		setResultState("found");
		console.log("selectedAddressInfo changed: handleClickResult");
		onChangeSelectedAddressInfo(locationInputValue);
	};

	const handleScrollResult = () => {
		if (resultRef.current) {
			console.log("should scroll");

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
	const resetList = () => {
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

	const getMoreAddress = () => {
		console.log("getMoreAddress");

		setLoading(true);

		// two get more address use case
		// if you are searching by fetch address
		// - searching through input field
		// there will be pagination through the api

		// if your are searching by reverse geocode endpoint
		// clicking on map
		// all the data will be dumped into you

		// how is api results possibly more than searchBuildingResults?
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
				(res: OneMapSearchResults) => {
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
					setAPIPageNum(res.pageNum);
				},
				() => {
					resetList();
					onOneMapError();
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
	const displayLocationList = async (addressLat: number, addressLng: number) => {
		if (!reverseGeoCodeEndpoint) return;

		// FIXME: fetching logic
		const onemapLocationList = await fetchLocationList(
			reverseGeoCodeEndpoint,
			addressLat,
			addressLng,
			mustHavePostalCode,
			reverseGeocodeAborter,
			onOneMapError
		);

		// FIXME: parsing logic
		resultRef.current?.scrollTo(0, 0);
		// not bolding searchval because it's not searching by keyword
		const locationList = onemapLocationList
			.map<OneMapSearchBuildingResult>((geoCodeInfo: OneMapGeocodeInfo) => {
				const address = LocationHelper.formatAddressFromGeocodeInfo(geoCodeInfo, true);
				return {
					SEARCHVAL: geoCodeInfo.BUILDINGNAME,
					BLK_NO: geoCodeInfo.BLOCK,
					ROAD_NAME: geoCodeInfo.ROAD,
					BUILDING: geoCodeInfo.BUILDINGNAME,
					POSTAL: geoCodeInfo.POSTALCODE,
					X: geoCodeInfo.XCOORD,
					Y: geoCodeInfo.YCOORD,
					LATITUDE: geoCodeInfo.LATITUDE,
					LONGITUDE: geoCodeInfo.LONGITUDE,
					LONGTITUDE: geoCodeInfo.LONGTITUDE,
					ADDRESS: address,
					DISPLAY_ADDRESS: address,
				};
			})
			.filter(({ SEARCHVAL }) => SEARCHVAL !== "JOHOR (MALAYSIA)");

		// FIXME: presentational logic
		if (locationList.length === 0) {
			// FIXME: "error" logic
			/**
			 * If nothing is found, clear everything and if the selected address is
			 * not the same at the currently searched latlg, change it to be the current one
			 * - current latlng
			 * - mapPicked latlng
			 * - selectedAddress
			 */
			resetList();
			setQueryString("");
			const updatedInfo = {
				lat: addressLat,
				lng: addressLng,
			};
			if (!isEqual(selectedAddressInfo, updatedInfo)) {
				console.log("selectedAddressInfo changed: !isEqual(selectedAddressInfo, updatedInfo)");
				onChangeSelectedAddressInfo(updatedInfo);
			}
			return;
		}

		populateDisplayList({ results: locationList });
		const [{ POSTAL, ADDRESS, BLK_NO, BUILDING, ROAD_NAME, X, Y }] = locationList;

		if (!mustHavePostalCode || (mustHavePostalCode && LocationHelper.hasGotAddressValue(POSTAL))) {
			setQueryString(ADDRESS);
			console.log("selectedAddressInfo changed: displayLocationList");

			onChangeSelectedAddressInfo({
				address: ADDRESS,
				blockNo: BLK_NO,
				building: BUILDING,
				postalCode: POSTAL,
				roadName: ROAD_NAME,
				lat: addressLat,
				lng: addressLng,
				x: parseFloat(X) || undefined,
				y: parseFloat(Y) || undefined,
			});
			setSelectedIndex(0);
		} else if (mustHavePostalCode && !LocationHelper.hasGotAddressValue(POSTAL)) {
			setShowPostalCodeError(true);
			setQueryString("");
		}
	};

	// reverse geocode dumps all
	const populateDisplayList = (params: ILocationDisplayListParams) => {
		const { results, boldResults, apiPageNum, totalNumPages, queryString } = params;

		let displayResults = results.map((obj) => {
			//convert to follow our standard address
			return {
				...obj,
				ADDRESS: LocationHelper.formatAddressFromGeocodeInfo(obj, true), // builds from address info, fallback back to pin location latlng
				DISPLAY_ADDRESS: obj.ADDRESS,
			};
		});
		if (boldResults && queryString) {
			displayResults = boldResultsWithQuery(displayResults, queryString);
		}

		// REFACTOR THIS
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
		const searchBuildingResultToListItem = (result: OneMapSearchBuildingResult): IListItem => ({
			address: result.ADDRESS,
			blockNo: result.BLK_NO,
			building: result.BUILDING,
			postalCode: result.POSTAL,
			roadName: result.ROAD_NAME,
			lat: parseFloat(result.LATITUDE) || undefined,
			lng: parseFloat(result.LONGITUDE) || undefined,
			x: parseFloat(result.X) || undefined,
			y: parseFloat(result.Y) || undefined,
			displayText: result.DISPLAY_ADDRESS,
		});

		const list: IListItem[] = searchBuildingResults.map(searchBuildingResultToListItem);

		return list.map((item, index) => (
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
				<Text.BodySmall dangerouslySetInnerHTML={cleanHtml(item.displayText)}></Text.BodySmall>
			</ResultItem>
		));
	};

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
								loadMore={getMoreAddress}
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
