import { Suspense, lazy, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks/use-validation-config";
import { ERROR_MESSAGES } from "../../shared";
import { StyledStaticMap } from "./location-field.styles";
import { LocationHelper } from "./location-helper";
import { LocationInput } from "./location-input/location-input";
import { ILocationFieldSchema, ILocationFieldValues } from "./types";

const LocationModal = lazy(() => import("./location-modal/location-modal"));

export const LocationField = (props: IGenericFieldProps<ILocationFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: {
			label,
			className = "location",
			locationInputPlaceholder,
			staticMapPinColor,
			mapPanZoom,
			interactiveMapPinIconUrl,
			reverseGeoCodeEndpoint,
			convertLatLngToXYEndpoint,
			gettingCurrentLocationFetchMessage,
			mustHavePostalCode,
			locationModalStyles,
			validation,
		},
		// form values can initially be undefined when passed in via props
		value: formValue,
		error,
	} = props;

	const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
	const { setValue } = useFormContext();
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);

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
				.test("must-have-postal-code", ERROR_MESSAGES.LOCATION.MUST_HAVE_POSTAL_CODE, (value) => {
					if (!isRequiredRule || !mustHavePostalCode) return true;
					return LocationHelper.hasGotAddressValue(value.postalCode);
				}),
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

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<div id={id} data-testid={TestHelper.generateId(id)} className={className}>
			<LocationInput
				id={id}
				label={label}
				className={className}
				locationInputPlaceholder={locationInputPlaceholder}
				onChange={(e) => e.currentTarget.blur()}
				onFocus={(e) => {
					setShowLocationModal(true);
					e.currentTarget.blur();
				}}
				value={formValue?.address || ""}
				errorMessage={error?.message}
			/>
			{!!formValue?.lat && !!formValue?.lng && (
				<StyledStaticMap
					id={id}
					className={`${className}-static-map`}
					lat={formValue.lat}
					lng={formValue.lng}
					staticMapPinColor={staticMapPinColor}
					onClick={() => setShowLocationModal(true)}
				/>
			)}
			<Suspense fallback={null}>
				{LocationModal && (
					<LocationModal
						id={id}
						className={className}
						showLocationModal={showLocationModal}
						onClose={() => setShowLocationModal(false)}
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
					/>
				)}
			</Suspense>
		</div>
	);
};
