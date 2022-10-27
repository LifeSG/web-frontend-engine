import { Form } from "@lifesg/react-design-system/form";
import { InputMultiSelect } from "@lifesg/react-design-system/input-select";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectHelper, TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { IMultiSelectOption, IMultiSelectSchema } from "./types";

export const MultiSelect = (props: IGenericFieldProps<IMultiSelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, options, ...otherSchema },
		id,
		name,
		value,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.array().of(Yup.string()), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (value) {
			handleChange(value);
		}
	}, []);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getSelectOptions = (): IMultiSelectOption[] => {
		return options.filter((option) => stateValue.includes(option.value));
	};

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (options: IMultiSelectOption[] | string[]): void => {
		if (
			!ObjectHelper.isStringArray(options) &&
			options.every((option) => ObjectHelper.containsKey(option, "value"))
		) {
			const initStateValue = options.map((option) => option.value);
			setStateValue(initStateValue);
			onChange({ target: { value: initStateValue } });
		} else {
			setStateValue(options as string[]);
			onChange({
				target: {
					value: options,
				},
			});
		}
	};

	return (
		<Form.CustomField id={id} label={label} errorMessage={otherProps.error?.message}>
			<InputMultiSelect
				{...otherSchema}
				id={TestHelper.generateId(id, "multiselect")}
				name={name}
				options={options}
				onSelectOptions={handleChange}
				selectedOptions={getSelectOptions()}
				valueExtractor={(item: IMultiSelectOption) => item.value}
				listExtractor={(item: IMultiSelectOption) => item.label}
			/>
		</Form.CustomField>
	);
};
