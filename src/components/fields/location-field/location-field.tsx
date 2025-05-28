import { Button } from "@lifesg/react-design-system/button";
import { Suspense, lazy, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useFieldEvent, useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, StaticMap, Warning } from "../../shared";
import { LocationHelper } from "./location-helper";
import { LocationInput } from "./location-input";
import { ILocationFieldSchema, ILocationFieldValues } from "./types";

const LocationModal = lazy(() => import("./location-modal/location-modal"));

export const LocationField = (props: IGenericFieldProps<ILocationFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		schema: {
			className = "location",
			convertLatLngToXYEndpoint,
			disabled,
			gettingCurrentLocationFetchMessage,
			interactiveMapPinIconUrl,
			label: _label,
			locationInputPlaceholder,
			locationListTitle,
			locationModalStyles,
			mapBannerText,
			mapPanZoom,
			mustHavePostalCode,
			readOnly,
			reverseGeoCodeEndpoint,
			staticMapPinColor,
			validation,
			hasExplicitEdit,
			locationSelectionMode = "default",
			disableSearch,
			addressFieldPlaceholder,
			searchBarIcon,
			bufferRadius,
		},
		// form values can initially be undefined when passed in via props
		value: formValue,
		warning,
	} = props;

	const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
	const { setValue } = useFormContext();
	const { setFieldValidationConfig } = useValidationConfig();
	const { dispatchFieldEvent, addFieldEventListener, removeFieldEventListener } = useFieldEvent();
	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		addFieldEventListener("show-location-modal", id, handleLocationModalShow);

		return () => {
			removeFieldEventListener("show-location-modal", id, handleLocationModalShow);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const postalCodeRule = validation?.find((rule) => "postalCode" in rule);

		setFieldValidationConfig(
			id,
			Yup.object({
				address: Yup.string(),
				blockNo: Yup.string(),
				building: Yup.string(),
				lat: Yup.number(),
				lng: Yup.number(),
				postalCode: Yup.string(),
				roadName: Yup.string(),
				x: Yup.number(),
				y: Yup.number(),
			})
				.test("is-required", isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.FIELD_REQUIRED, (value) => {
					if (!isRequiredRule?.required) return true;
					return !!value && !!value.lat && !!value.lng;
				})
				.test(
					"must-have-postal-code",
					postalCodeRule?.errorMessage || ERROR_MESSAGES.LOCATION.MUST_HAVE_POSTAL_CODE,
					(value) => {
						if (!isRequiredRule || !mustHavePostalCode) return true;
						return LocationHelper.hasGotAddressValue(value.postalCode);
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const updateFormValues = (updatedValues: ILocationFieldValues, shouldDirty = true) => {
		setValue(id, updatedValues, { shouldDirty });
	};

	const handleFocus = (e?: React.FocusEvent<HTMLInputElement, Element>) => {
		if (readOnly || disabled) {
			return;
		}
		setShowLocationModal(true);
		dispatchFieldEvent("show-location-modal", id);
		e?.currentTarget.blur();
	};

	const handleClose = () => {
		setShowLocationModal(false);
		dispatchFieldEvent("hide-location-modal", id);
	};

	const handleEditLocationOnClick = () => {
		const shouldPreventDefault = !dispatchFieldEvent("click-edit-button", id);
		if (!shouldPreventDefault) {
			setShowLocationModal(true);
		}
	};

	const handleLocationModalShow = () => {
		setShowLocationModal(true);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<div id={id} data-testid={TestHelper.generateId(id)} className={className}>
			<LocationInput
				id={id}
				label={formattedLabel}
				className={className}
				locationInputPlaceholder={locationInputPlaceholder}
				onChange={(e) => e.currentTarget.blur()}
				onFocus={handleFocus}
				value={formValue?.address || ""}
				errorMessage={error?.message}
				disabled={(hasExplicitEdit === "explicit" && formValue?.address) || disabled}
				readOnly={readOnly}
			/>
			{hasExplicitEdit && formValue?.address && (
				<Button.Default
					id={TestHelper.generateId(id, "edit-button")}
					data-testid={TestHelper.generateId(id, "edit-button")}
					styleType="secondary"
					onClick={handleEditLocationOnClick}
					type="button"
				>
					Edit
				</Button.Default>
			)}
			{!!formValue?.lat && !!formValue?.lng && (
				<StaticMap
					id={id}
					className={`${className}-static-map`}
					lat={formValue.lat}
					lng={formValue.lng}
					staticMapPinColor={staticMapPinColor}
					onClick={handleFocus}
					disabled={disabled}
				/>
			)}
			<Suspense fallback={null}>
				{LocationModal && (
					<LocationModal
						id={id}
						className={className}
						showLocationModal={showLocationModal}
						onClose={handleClose}
						formValues={formValue}
						onConfirm={updateFormValues}
						updateFormValues={updateFormValues}
						mapPanZoom={mapPanZoom}
						reverseGeoCodeEndpoint={reverseGeoCodeEndpoint}
						convertLatLngToXYEndpoint={convertLatLngToXYEndpoint}
						interactiveMapPinIconUrl={interactiveMapPinIconUrl}
						gettingCurrentLocationFetchMessage={gettingCurrentLocationFetchMessage}
						mustHavePostalCode={mustHavePostalCode}
						locationModalStyles={locationModalStyles}
						locationListTitle={locationListTitle}
						mapBannerText={mapBannerText}
						locationSelectionMode={locationSelectionMode}
						disableSearch={disableSearch}
						addressFieldPlaceholder={addressFieldPlaceholder}
						searchBarIcon={searchBarIcon}
						bufferRadius={bufferRadius}
					/>
				)}
			</Suspense>
			<Warning id={id} message={warning} />
		</div>
	);
};
