import { Filter } from "@lifesg/react-design-system";
import { useEffect, useState } from "react";
import { useValidationConfig } from "../../../../utils/hooks";
import { ERROR_MESSAGES } from "../../../shared";
import { IFilterItemCheckboxProps, IOption } from "./types";
import * as Yup from "yup";
import { useFormContext } from "react-hook-form";
import { IGenericFieldProps } from "../../../frontend-engine";
import useDeepCompareEffect from "use-deep-compare-effect";
import { without } from "lodash";

export const FilterItemCheckbox = (props: IGenericFieldProps<IFilterItemCheckboxProps>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, validation },
		id,
		name,
		value,
		onChange,
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();
	const { setValue, getValues } = useFormContext();
	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const [selectedOptions, setSelectedOptions] = useState<IOption[]>();
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

	useDeepCompareEffect(() => {
		const updatedValues = value?.filter((v) => options.find((option) => option.value === v));
		const selectedOpts = options.filter((opt) => value?.find((val) => opt.value === val));
		setSelectedOptions(selectedOpts);
		setValue(id, updatedValues);
	}, [options]);

	useEffect(() => {
		console.log("reachedVal", id, value, name, getValues());
		setStateValue(value || []);
	}, [value, name]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (options: IOption[]): void => {
		let updatedStateValues = [...stateValue];

		options.forEach((opt) => {
			if (updatedStateValues.includes(opt.value)) {
				updatedStateValues = without(updatedStateValues, opt.value);
			} else {
				updatedStateValues.push(opt.value);
			}
		});
		onChange({ target: { value: updatedStateValues } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Checkbox
			title={label}
			selectedOptions={selectedOptions}
			options={options}
			onSelect={handleChange}
		></Filter.Checkbox>
	);
};
