import { Form } from "@lifesg/react-design-system/form";
import { InputSelect } from "@lifesg/react-design-system/input-select";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ISelectSchema } from "./types";

export const Select = (props: IGenericFieldProps<ISelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { id, title, validation, ...otherSchema },
		name,
		value,
		error,
		onChange,
	} = props;

	const [stateValue, setStateValue] = useState<string>(value || "");
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
	const handleChange = (_, extractedValue: string): void => {
		setStateValue(extractedValue);
		onChange({
			target: {
				value: extractedValue,
			},
		});
	};

	return (
		<Form.CustomField id={id} label={title} errorMessage={error?.message}>
			<InputSelect
				{...otherSchema}
				id={TestHelper.generateId(id, "select")}
				name={name}
				onSelectOption={handleChange}
				selectedOption={stateValue}
			/>
		</Form.CustomField>
	);
};
