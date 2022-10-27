import { Form, InputMultiSelect } from "@lifesg/react-design-system";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { IOption } from "../types";
import { IMultiSelectSchema } from "./types";

export const MultiSelect = (props: IGenericFieldProps<IMultiSelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, ...otherSchema },
		id,
		name,
		value,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<IOption[]>(value || []);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.array().of(
				Yup.object().shape({
					label: Yup.string(),
					value: Yup.string(),
				})
			),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (value) {
			setStateValue(value);
		}
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (options: IOption[]): void => {
		setStateValue(options);
		onChange({
			target: {
				value: options,
			},
		});
	};

	return (
		<Form.CustomField {...otherProps} id={id} label={label} errorMessage={otherProps.error?.message}>
			<InputMultiSelect
				{...otherSchema}
				id={TestHelper.generateId(id, "multiselect")}
				name={name}
				onSelectOptions={handleChange}
				selectedOptions={stateValue}
				valueExtractor={(item: IOption) => item.value}
				listExtractor={(item: IOption) => item.label}
			/>
		</Form.CustomField>
	);
};
