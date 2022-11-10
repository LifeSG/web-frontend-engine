import { Form } from "@lifesg/react-design-system/form";
import { InputMultiSelect } from "@lifesg/react-design-system/input-select";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ERROR_MESSAGES } from "../../shared";
import { ISelectOption } from "../select/types";
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
		const isRequiredRule = validation?.find((rule) => "required" in rule);

		setFieldValidationConfig(
			id,
			Yup.array()
				.of(Yup.string())
				.test(
					"is-empty-array",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.REQUIRED_OPTION,
					(value) => {
						if (!value || !isRequiredRule?.required) return true;

						return value.length > 0;
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || []);
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getSelectOptions = (): IMultiSelectOption[] => options.filter((option) => stateValue.includes(option.value));

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (options: ISelectOption[]): void => {
		const parsedValues = options.map((option) => option.value);
		onChange({ target: { value: parsedValues } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
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
