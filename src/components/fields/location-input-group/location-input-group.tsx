import { Suspense, lazy, useState } from "react";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { StyledStaticMap } from "./location-input-group.styles";
import { LocationInput } from "./location-input/location-input";
import { ILocationInputSchema, ILocationInputValues } from "./types";

const LocationModal = lazy(() => import("./location-modal/location-modal"));

export const LocationInputGroup = (props: IGenericFieldProps<ILocationInputSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		schema: {
			label,
			locationInputPlaceholder,
			staticMapPinColor,

			mastheadHeight = 0,
			/* eslint-disable @typescript-eslint/no-unused-vars */
			showIf,
			validation,
			uiType,
			customOptions,
			/* eslint-disable @typescript-eslint/no-unused-vars */
			...otherSchema
		},
		// form values can initially be undefined when passed in via props
		value: formValue,
		onChange,
	} = props;

	const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

	// =============================================================================
	// USEEFFECTS
	// =============================================================================

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const updateFormValues = (updatedValues: ILocationInputValues) => {
		onChange?.({ target: { value: updatedValues } });
	};
	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================

	return (
		<div id={id} data-testid={TestHelper.generateId(id)}>
			<LocationInput
				id={id}
				label={label}
				locationInputPlaceholder={locationInputPlaceholder}
				onChange={(e) => e.currentTarget.blur()}
				onFocus={(e) => {
					setShowLocationModal(true);
					e.currentTarget.blur();
				}}
				value={formValue?.address || ""}
			/>
			{formValue?.lat && formValue?.lng && (
				<StyledStaticMap
					id={id}
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
						mastheadHeight={mastheadHeight}
						showLocationModal={showLocationModal}
						onClose={() => setShowLocationModal(false)}
						formValues={formValue}
						onConfirm={updateFormValues}
						updateFormValues={updateFormValues}
						{...otherSchema}
					/>
				)}
			</Suspense>
		</div>
	);
};
