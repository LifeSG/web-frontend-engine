import { Form } from "@lifesg/react-design-system/form";
import { InputSelect } from "@lifesg/react-design-system/input-select";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { IOption } from "../types";
import { ISelectSchema } from "./types";

export const Select = (props: IGenericFieldProps<ISelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, ...otherSchema },
		id,
		name,
		value,
		error,
		onChange,
	} = props;

	const [stateValue, setStateValue] = useState<IOption>(value || []);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (value) {
			setStateValue(value);
		}
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (option: IOption): void => {
		setStateValue(option);
		onChange({
			target: {
				value: option,
			},
		});
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			<InputSelect
				{...otherSchema}
				id={TestHelper.generateId(id, "select")}
				name={name}
				onSelectOption={handleChange}
				selectedOption={stateValue}
				valueExtractor={(item: IOption) => item.value}
				listExtractor={(item: IOption) => item.label}
			/>
		</Form.CustomField>
	);
};
