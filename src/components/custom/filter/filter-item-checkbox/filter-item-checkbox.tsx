import { Filter } from "@lifesg/react-design-system";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { TestHelper } from "../../../../utils";
import { useValidationConfig } from "../../../../utils/hooks";
import { IGenericFieldProps } from "../../../frontend-engine";
import { ERROR_MESSAGES } from "../../../shared";
import { IFilterItemCheckboxSchema, IOption } from "./types";

export const FilterItemCheckbox = (props: IGenericFieldProps<IFilterItemCheckboxSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, validation, ...otherSchema },
		id,
		value,
		onChange,
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();
	const { setValue } = useFormContext();
	const [selectedOptions, setSelectedOptions] = useState<IOption[]>(); // Current selected value state
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
	}, [options, value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (options: IOption[]): void => {
		onChange({ target: { value: options.map((opt) => opt.value) } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Checkbox
			id={id}
			{...otherSchema}
			data-testid={TestHelper.generateId(id, "filter-item-checkbox")}
			title={label}
			selectedOptions={selectedOptions}
			options={options}
			onSelect={handleChange}
		></Filter.Checkbox>
	);
};
