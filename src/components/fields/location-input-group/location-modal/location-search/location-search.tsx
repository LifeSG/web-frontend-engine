import { Text } from "@lifesg/react-design-system/text";
import axios, { CancelTokenSource } from "axios";
import { debounce, isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import sanitizeHtml from "sanitize-html";
import LocationPinBlack from "src/assets/img/icons/location-pin-black.svg";
import SearchSvg from "src/assets/img/icons/search.svg";
import { OneMapService } from "../../../../../services";
import {
	OneMapBoolean,
	OneMapGeocodeInfo,
	OneMapSearchBuildingResult,
	OneMapSearchResults,
} from "../../../../../services/types";
import { ILocationCoord, LocationHelper, TestHelper } from "../../../../../utils";
import { InfiniteScrollList, Prompt } from "../../../../elements";
import { ILocationDisplayListParams, ILocationInputValues, TSinglePanelInputMode } from "../../types";
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

interface IListItem extends ILocationInputValues {
	displayText?: string;
}

export interface ILocationSearchProps {
	id?: string;
	onCancel: () => void;
	onConfirm: () => void;
	isSinglePanel: boolean;
	singelPanelInputMode: TSinglePanelInputMode;
	addressFieldPlaceholder?: string;
	gettingCurrentLocation: boolean;
	gettingCurrentLocationFetchMessage?: string;
	locationListTitle?: string;
	selectedAddressInfo: ILocationInputValues;
	changeSelectedAddressInfo: (addressInfo: ILocationInputValues) => void;
	pageSize?: number;
	onOneMapError: () => void;
	mustHavePostalCode?: boolean;
	disableErrorPromptOnApp?: boolean;
	reverseGeoCodeEndpoint?: string;
	onGetLocationCallback: (lat?: number, lng?: number) => void;
	onGetLocationError: (
		geolocationPositionError?: GeolocationPositionError,
		disableErrorPromptOnApp?: boolean
	) => void;
	onAddressChange: () => void;
	showLocationModal: boolean;
	mapPickedLatLng?: ILocationCoord;
	didUserClickMap: boolean;
	onClearInput: () => void;
	formValues?: ILocationInputValues;
	updateFormValues: (values: ILocationInputValues) => void;
}

const pagination = <T,>(array: T[], pageSize: number, pageNum: number) => {
	return array.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

const fetchAddress = async (
	query: string,
	pageNum: number,
	onSuccess?: (results: OneMapSearchResults) => void,
	onFail?: (error: unknown) => void
) => {
	if (query) {
		try {
			const results = await OneMapService.searchByAddress({
				searchValue: query,
				getAddressDetails: OneMapBoolean.YES,
				returnGeom: OneMapBoolean.YES,
				pageNum: pageNum,
			});
			onSuccess?.(results);
		} catch (error) {
			onFail?.(error);
		}
	}
};

const debounceFetchAddress = debounce(fetchAddress, 500);

const boldResultsWithQuery = (arr: OneMapSearchBuildingResult[], query: string) => {
	const regex = new RegExp(query, "gi");
	return arr.map((obj) => {
		const newAddress = (obj.DISPLAY_ADDRESS || obj.ADDRESS).replace(regex, `<span class="keyword">${query}</span>`);
		return {
			...obj,
			DISPLAY_ADDRESS: newAddress,
		};
	});
};

const cleanHtml = (html: string | undefined) => {
	if (!html) return;
	return {
		__html: sanitizeHtml(html, {
			allowedTags: ["span"],
			allowedAttributes: {
				span: ["class"],
			},
		}),
	};
};

export const LocationSearch = ({
	id = "location-search",
	onCancel,
	singelPanelInputMode,
	isSinglePanel,
	onConfirm,
	addressFieldPlaceholder = "Street Name, Postal Code",
	gettingCurrentLocation,
	gettingCurrentLocationFetchMessage = "Getting current location...",
	locationListTitle = "Select location",
	selectedAddressInfo,
	changeSelectedAddressInfo,
	pageSize = 10,
	onOneMapError,
	mustHavePostalCode,
	disableErrorPromptOnApp,
	reverseGeoCodeEndpoint,
	onGetLocationCallback,
	onGetLocationError,
	onAddressChange,
	showLocationModal,
	mapPickedLatLng,
	didUserClickMap,
	onClearInput,
	formValues,
	updateFormValues,
}: ILocationSearchProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const inputRef = useRef<HTMLInputElement>(null);
	const resultRef = useRef<HTMLDivElement>(null);
	const reverseGeocodeAborter = useRef<AbortController | null>(null);

	const [hasScrolled, setHasScrolled] = useState(false);
	const [queryString, setQueryString] = useState("");
	const [showPostalCodeError, setShowPostalCodeError] = useState(false);

	// searching
	const [useQuerySearch, setUseQuerySearch] = useState(false);
	const [searchBuildingResults, setSearchBuildingResults] = useState<OneMapSearchBuildingResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [apiResults, setAPIResults] = useState<OneMapSearchBuildingResult[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	// pagination logic
	const [hasNextPage, setHasNextPage] = useState(false);
	const [totalNumPages, setTotalNumPages] = useState(0);
	const [apiPageNum, setAPIPageNum] = useState(1);
	const [currentPaginationPageNum, setCurrentPaginationPageNum] = useState(1);
	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		// if only address
		if ((formValues?.address && !formValues?.lat) || !formValues?.lng) {
			(async () => {
				try {
					const res = await OneMapService.searchByAddress({
						searchValue: formValues.address,
						returnGeom: OneMapBoolean.YES,
						getAddressDetails: OneMapBoolean.YES,
						pageNum: 1,
					});
					const postalCodeCheck =
						!mustHavePostalCode || LocationHelper.hasGotAddressValue(res.results?.[0].POSTAL);
					if (res.results?.[0] && postalCodeCheck) {
						// Get full address
						const fetchedFormValue = {
							address: formValues.address || "",
							blockNo: res.results?.[0].BLK_NO,
							building: res.results?.[0].BUILDING,
							postalCode: res.results?.[0].POSTAL,
							roadName: res.results?.[0].ROAD_NAME,
							lat: parseFloat(res.results?.[0].LATITUDE) || undefined,
							lng: parseFloat(res.results?.[0].LONGITUDE) || undefined,
							x: parseFloat(res.results?.[0].X) || undefined,
							y: parseFloat(res.results?.[0].Y) || undefined,
						};
						updateFormValues(fetchedFormValue);
						changeSelectedAddressInfo(fetchedFormValue);
						// populate result list
						setQueryString(fetchedFormValue.address);
						setUseQuerySearch(true);
					} else {
						updateFormValues({});
						changeSelectedAddressInfo({});
					}
				} catch (error) {}
			})();
			// if only latlng
		} else if (reverseGeoCodeEndpoint && !formValues?.address && formValues?.lat && formValues?.lng) {
			(async () => {
				try {
					const locationList = await OneMapService.reverseGeocode({
						route: reverseGeoCodeEndpoint,
						latitude: formValues.lat,
						longitude: formValues.lng,
					});
					const postalCodeCheck =
						!mustHavePostalCode || LocationHelper.hasGotAddressValue(locationList?.[0].POSTALCODE);
					if (locationList?.[0] && postalCodeCheck) {
						const address = LocationHelper.formatAddressFromGeocodeInfo(locationList?.[0], true);
						// Get full address
						const fetchedFormValue = {
							address,
							blockNo: locationList[0].BLOCK,
							building: locationList[0].BUILDINGNAME,
							postalCode: locationList[0].POSTALCODE,
							roadName: locationList[0].ROAD,
							lat: formValues.lat,
							lng: formValues.lng,
							x: parseFloat(locationList[0].XCOORD) || undefined,
							y: parseFloat(locationList[0].YCOORD) || undefined,
						};
						updateFormValues(fetchedFormValue);
						changeSelectedAddressInfo(fetchedFormValue);
						// populate result list
						setQueryString(fetchedFormValue.address);
						setUseQuerySearch(true);
					}
				} catch (error) {}
			})();
		}
	}, []);

	useEffect(() => {
		if (!showLocationModal) return;

		if (gettingCurrentLocation) {
			getUserCurrentLocation(disableErrorPromptOnApp);
			return;
		}

		if (!navigator.onLine) return;

		// internet restored
		if (!queryString && selectedAddressInfo?.lat && selectedAddressInfo?.lng) {
			getAddressInfo(selectedAddressInfo.lat, selectedAddressInfo.lng);
			return;
		} else {
			// check if one map or reverse code is working
			// - get location error
			// - first load
			// the map should not be usable if any of these services fail
			debounceFetchAddress("singapore", 1, undefined, onOneMapError);
			const reverseGeocodeCheck = async () => {
				try {
					reverseGeocodeAborter.current?.abort();
					reverseGeocodeAborter.current = new AbortController();
					// esclipse latlng
					await OneMapService.reverseGeocode({
						route: reverseGeoCodeEndpoint,
						latitude: 1.29994179707526,
						longitude: 103.789404349716,
						bufferRadius: 1,
						abortSignal: reverseGeocodeAborter.current.signal,
						otherFeatures: OneMapBoolean.YES,
					});
					reverseGeocodeAborter.current = null;
				} catch (error) {
					onOneMapError();
				}
			};
			reverseGeocodeCheck();
		}
	}, [gettingCurrentLocation, navigator.onLine]);

	/**
	 * Gets the address of the location where user clicks on the map
	 */
	useEffect(() => {
		if (!mapPickedLatLng?.lat || !mapPickedLatLng?.lng || !didUserClickMap) return;
		getAddressInfo(mapPickedLatLng.lat, mapPickedLatLng.lng);
	}, [mapPickedLatLng, didUserClickMap]);

	/**
	 * Handles query searching and search results display
	 */
	useEffect(() => {
		if (!useQuerySearch) return;

		const parsedString = validateQueryString(queryString);

		if (!parsedString) return resetList();

		if (
			inputRef.current?.value !== gettingCurrentLocationFetchMessage &&
			inputRef.current?.value !== selectedAddressInfo?.address
		) {
			setLoading(true);
		}

		debounceFetchAddress(
			parsedString,
			1,
			(res: OneMapSearchResults) => {
				if (selectedAddressInfo?.address === parsedString) {
					setSelectedIndex(0);
				} else {
					setSelectedIndex(-1);
				}

				populateDisplayList({
					results: res.results,
					queryString,
					boldResults: true,
					apiPageNum: res.pageNum,
					totalNumPages: res.totalNumPages,
				});
				if (resultRef.current) {
					resultRef.current?.scrollTo(0, 0);
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
	}, [pageSize, queryString, useQuerySearch]);

	// Determine if there are more items to be fetched
	useEffect(() => {
		setHasNextPage(false);
		if (apiPageNum < totalNumPages) {
			setHasNextPage(true);
		}
		if (currentPaginationPageNum < apiResults.length / pageSize) {
			setHasNextPage(true);
		}
	}, [totalNumPages, apiPageNum, currentPaginationPageNum, apiResults.length, pageSize]);

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
		setUseQuerySearch(!!value);
		onAddressChange();
	};

	const handleClearInput = () => {
		setQueryString("");
		resetList();
		setUseQuerySearch(false);
		onClearInput();
	};

	const handleClickResult = (addressInfo: ILocationInputValues, index: number) => {
		if (mustHavePostalCode && !LocationHelper.hasGotAddressValue(addressInfo.postalCode)) {
			setShowPostalCodeError(true);
			return;
		}

		setSelectedIndex(index);
		setQueryString(addressInfo.address ?? "");
		setUseQuerySearch(false);
		changeSelectedAddressInfo(addressInfo);
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
	const resetList = () => {
		setLoading(false);
		setSelectedIndex(-1);
		setCurrentPaginationPageNum(1);
		setTotalNumPages(0);
		setAPIPageNum(0);
		setAPIResults([]);
		setSearchBuildingResults([]);
		if (resultRef.current) {
			resultRef.current?.scrollTo(0, 0);
		}
	};

	const getMoreAddress = () => {
		setLoading(true);
		if (searchBuildingResults.length < apiResults.length) {
			const newCurrentPageNum = currentPaginationPageNum + 1;
			setCurrentPaginationPageNum(newCurrentPageNum);
			const data = pagination(apiResults, pageSize, newCurrentPageNum);
			const boldData = boldResultsWithQuery(data, queryString);
			setSearchBuildingResults(searchBuildingResults.concat(boldData));
			setLoading(false);
		} else {
			debounceFetchAddress(
				queryString,
				apiPageNum + 1,
				(res: OneMapSearchResults) => {
					const tempResults = res.results.map((obj) => {
						const address = LocationHelper.formatAddressFromGeocodeInfo(obj, true);
						return {
							...obj,
							ADDRESS: address,
							DISPLAY_ADDRESS: address,
						};
					});
					const results = boldResultsWithQuery(tempResults, queryString);
					if (results.length > pageSize) {
						const data = pagination(results, pageSize, 1);
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

	const getUserCurrentLocation = async (disableErrorPromptOnApp?: boolean) => {
		if (!reverseGeoCodeEndpoint) {
			return;
		}

		try {
			const currentLatLng = await LocationHelper.getCurrentLocation({ maxAttempts: 3, disableErrorPromptOnApp });

			await getAddressInfo(currentLatLng.lat, currentLatLng.lng);

			onGetLocationCallback(currentLatLng.lat, currentLatLng.lng);
		} catch (error) {
			onGetLocationError(error as GeolocationPositionError | undefined, disableErrorPromptOnApp);
		}
	};

	/**
	 * Used when
	 * - getting current location
	 * - internet restored
	 * - map picked latlng
	 */
	const getAddressInfo = async (addressLat: number, addressLng: number) => {
		if (!reverseGeoCodeEndpoint) return;

		/*
		2 API calls are made to OneMap due to how the reverse geocoding search works.
		If a place with no postal code is selected, it will be excluded from the search results
		if there are other results with postal codes within the search buffer distance. e.g. (Punggol Waterway Park)
		 */
		let defaultDistanceLocations: OneMapGeocodeInfo[] = [];
		let onemapLocationList: OneMapGeocodeInfo[] = [];

		try {
			reverseGeocodeAborter.current?.abort();
			reverseGeocodeAborter.current = new AbortController();
			// first call will get the location on the spot within 10 meters
			if (!mustHavePostalCode) {
				defaultDistanceLocations = await OneMapService.reverseGeocode({
					route: reverseGeoCodeEndpoint,
					latitude: addressLat,
					longitude: addressLng,
					abortSignal: reverseGeocodeAborter.current.signal,
					bufferRadius: 10,
					otherFeatures: OneMapBoolean.YES,
				});
			}
			// second call with get a list of locations within 500m
			const expandedSearchDistanceLocations = await OneMapService.reverseGeocode({
				route: reverseGeoCodeEndpoint,
				latitude: addressLat,
				longitude: addressLng,
				abortSignal: reverseGeocodeAborter.current.signal,
				bufferRadius: 500,
				otherFeatures: OneMapBoolean.YES,
			});
			// ensure that there are no duplicate search results
			const buildingNames = new Set(expandedSearchDistanceLocations.map((val) => val.BUILDINGNAME));
			onemapLocationList = onemapLocationList.concat(
				defaultDistanceLocations.filter((res) => !buildingNames.has(res.BUILDINGNAME)),
				expandedSearchDistanceLocations
			);
			reverseGeocodeAborter.current = null;
		} catch (error) {
			onOneMapError();
		}

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

		if (locationList.length > 0) {
			populateDisplayList({ results: locationList });
			const [{ POSTAL, ADDRESS, BLK_NO, BUILDING, ROAD_NAME, X, Y }] = locationList;

			if (!mustHavePostalCode || (mustHavePostalCode && LocationHelper.hasGotAddressValue(POSTAL))) {
				setQueryString(ADDRESS);
				changeSelectedAddressInfo({
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
		} else {
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
				changeSelectedAddressInfo(updatedInfo);
			}
		}
	};

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

		setSearchBuildingResults(displayResults);
		if (displayResults.length > pageSize) {
			const data = pagination(displayResults, pageSize, 1);
			setSearchBuildingResults(data);
		}
		setAPIResults(results);
		setTotalNumPages(totalNumPages || 1);
		setLoading(false);
		setAPIPageNum(apiPageNum || 1);
		setUseQuerySearch(false);
	};

	const validateQueryString = (stringToQuery: string) => {
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
			<SearchWrapper singelPanelInputMode={singelPanelInputMode}>
				<SearchBarIconButton
					onClick={handleClickCancel}
					id={TestHelper.generateId("location-search-modal-close-icon")}
				>
					<SearchBarModalCross />
				</SearchBarIconButton>

				<SearchBarContainer hasScrolled={hasScrolled}>
					<SearchBarIconButton
						onClick={handleInputFocus}
						id={TestHelper.generateId("location-search-modal-search-icon")}
					>
						<SearchBarIcon src={SearchSvg} alt="Search" />
					</SearchBarIconButton>
					<SearchBarInput
						type="text"
						onFocus={handleInputFocus}
						onChange={handleInputChange}
						placeholder={addressFieldPlaceholder}
						readOnly={gettingCurrentLocation}
						value={!gettingCurrentLocation ? queryString : gettingCurrentLocationFetchMessage}
						ref={inputRef}
						id={TestHelper.generateId("location-search-modal-search-text-input-field")}
					/>

					<SearchBarIconButton
						onClick={handleClearInput}
						id={TestHelper.generateId("location-search-modal-clear-icon")}
					>
						<SearchBarCross type="cross" />
					</SearchBarIconButton>
				</SearchBarContainer>
				<ResultWrapper
					singelPanelInputMode={singelPanelInputMode}
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
							{!loading && useQuerySearch && searchBuildingResults.length === 0 && (
								<NoResultTitle>No results found for &ldquo;{queryString}&rdquo;</NoResultTitle>
							)}
						</>
					)}
				</ResultWrapper>

				<ButtonWrapper singelPanelInputMode={singelPanelInputMode}>
					<ButtonItem buttonType="cancel" styleType="light" onClick={handleClickCancel}>
						Cancel
					</ButtonItem>
					<ButtonItem
						buttonType="confirm"
						onClick={onConfirm}
						disabled={
							!queryString || selectedIndex < 0 || !selectedAddressInfo?.lat || !selectedAddressInfo?.lng
						}
					>
						{isSinglePanel ? "Confirm location" : "Confirm"}
					</ButtonItem>
				</ButtonWrapper>
			</SearchWrapper>
			{showPostalCodeError && renderPostalCodeError()}
		</>
	);
};
