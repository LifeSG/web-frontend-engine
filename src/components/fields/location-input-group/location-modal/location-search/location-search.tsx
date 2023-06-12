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
import { LocationHelper, TestHelper } from "../../../../../utils";
import { useFieldEvent } from "../../../../../utils/hooks";
import { Prompt } from "../../../../shared";
import { LocationInputHelper } from "../../location-input-helper";
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
	onCancel,
	panelInputMode,
	isSinglePanel,
	onConfirm,
	addressFieldPlaceholder = "Street Name, Postal Code",
	gettingCurrentLocation,
	gettingCurrentLocationFetchMessage = "Getting current location...",
	locationListTitle = "Select location",
	selectedAddressInfo,
	onChangeSelectedAddressInfo,
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
	const { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener } = useFieldEvent();

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
	} = LocationInputHelper;

	// =============================================================================
	// EFFECTS
	// =============================================================================

	// Handle default values
	useEffect(() => {
		const onSuccess = (locationInputValue) => {
			const validPostalCode =
				!mustHavePostalCode || LocationHelper.hasGotAddressValue(locationInputValue.postalCode);
			if (!locationInputValue || !validPostalCode) {
				updateFormValues({});
				onChangeSelectedAddressInfo({});
				return;
			}

			updateFormValues(locationInputValue);
			onChangeSelectedAddressInfo(locationInputValue);
			// populate result list
			setQueryString(locationInputValue.address);
			setUseQuerySearch(true);
		};

		// if only address
		if (formValues?.address && !formValues?.lat && !formValues?.lng) {
			fetchSingleLocationByAddress(formValues.address, onSuccess);
			// if only latlng
		} else if (reverseGeoCodeEndpoint && !formValues?.address && formValues?.lat && formValues?.lng) {
			fetchSingleLocationByLatLng(reverseGeoCodeEndpoint, formValues.lat, formValues.lng, onSuccess);
		}

		addFieldEventListener<TSetCurrentLocationDetail>("set-current-location", id, (e) => {
			// TODO better value format
			const {
				detail: { payload, errors },
			} = e;

			// what takes priority?
			// if (!reverseGeoCodeEndpoint) {
			// 	return;
			// }

			if (!isEmpty(errors)) {
				onGetLocationError(errors, disableErrorPromptOnApp);
				return;
			}

			if (!payload.lat || !payload.lng) {
				// no op or error? onGetLocationError(undefined, disableErrorPromptOnApp)
				return;
			}

			const { lat, lng } = payload;
			//TODO check if need to be synchronous?
			displayLocationList(lat, lng);
			onGetLocationCallback(lat, lng);
		});

		// Maybe check if component can be used?
		// services healthcheck
		return () => {
			removeFieldEventListener("set-current-location", id, () => {
				// no op
			});
		};
	}, []);

	useEffect(() => {
		if (!showLocationModal) return;
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
		if (!mapPickedLatLng?.lat || !mapPickedLatLng?.lng || !didUserClickMap) return;
		displayLocationList(mapPickedLatLng.lat, mapPickedLatLng.lng);
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
	}, [PAGE_SIZE, queryString, useQuerySearch]);

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
		onChangeSelectedAddressInfo(addressInfo);
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

	// This can be done on the modal
	const getUserCurrentLocation = async (disableErrorPromptOnApp?: boolean) => {
		//  dispatchFieldEvent("get-current-location", id);
		// if (!reverseGeoCodeEndpoint) {
		// 	return;
		// }
		// try {
		// 	const currentLatLng = await LocationHelper.getCurrentLocation({ maxAttempts: 3, disableErrorPromptOnApp });
		// 	await displayLocationList(currentLatLng.lat, currentLatLng.lng);
		// 	onGetLocationCallback(currentLatLng.lat, currentLatLng.lng);
		// } catch (error) {
		// 	onGetLocationError(error as GeolocationPositionError | undefined, disableErrorPromptOnApp);
		// }
	};

	/**
	 * Used when
	 * - getting current location
	 * - internet restored
	 * - map picked latlng
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
				onChangeSelectedAddressInfo(updatedInfo);
			}
			return;
		}

		populateDisplayList({ results: locationList });
		const [{ POSTAL, ADDRESS, BLK_NO, BUILDING, ROAD_NAME, X, Y }] = locationList;

		if (!mustHavePostalCode || (mustHavePostalCode && LocationHelper.hasGotAddressValue(POSTAL))) {
			setQueryString(ADDRESS);
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
		if (displayResults.length > PAGE_SIZE) {
			const data = pagination(displayResults, PAGE_SIZE, 1);
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
			<SearchWrapper
				id={TestHelper.generateId(id, "location-search")}
				data-testid={TestHelper.generateId(id, "location-search")}
				panelInputMode={panelInputMode}
			>
				<SearchBarIconButton
					onClick={handleClickCancel}
					id={TestHelper.generateId(id, "location-search-modal-close")}
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
						id={TestHelper.generateId(id, "location-search-modal-clear")}
					>
						<SearchBarCross type="cross" />
					</SearchBarIconButton>
				</SearchBarContainer>
				<ResultWrapper
					id={TestHelper.generateId(id, "location-search-results")}
					data-testid={TestHelper.generateId(id, "location-search-results")}
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
							{!loading && useQuerySearch && searchBuildingResults.length === 0 && (
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
