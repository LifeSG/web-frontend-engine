import { Filter } from "@lifesg/react-design-system/filter";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { TestHelper } from "../../../../utils";
import { useValidationConfig } from "../../../../utils/hooks";
import { Sanitize } from "../../../shared";
import { IGenericCustomFieldProps } from "../../types";
import { FilterHelper } from "../filter-helper";
import { IFilterCheckboxSchema, IOption, IParentOption } from "./types";

export const FilterCheckbox = (props: IGenericCustomFieldProps<IFilterCheckboxSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, expanded, validation, ...otherSchema },
		id,
		value,
		onChange,
	} = props;

	const { setValue } = useFormContext();
	const [selectedOptions, setSelectedOptions] = useState<IOption[]>(); // Current selected value state
	const [expandedState, setExpandedState] = useState(expanded);
	const { setFieldValidationConfig } = useValidationConfig();
	const { title, addon } = FilterHelper.constructFormattedLabel(label, id);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================

	const isParentOption = (option: IOption): option is IParentOption => {
		return "options" in option && Array.isArray(option.options);
	};

	const getOptionValue = (option: IOption): string => {
		return isParentOption(option) ? option.key : option.value;
	};

	const flattenOptions = (options: IOption[]): IOption[] => {
		return options.reduce<IOption[]>((acc, option) => {
			return [...acc, option, ...(isParentOption(option) ? flattenOptions(option.options) : [])];
		}, []);
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.array().of(Yup.string()), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useDeepCompareEffect(() => {
		const flatOptions = flattenOptions(options);
		const updatedValues = value?.filter((v) => flatOptions.find((option) => getOptionValue(option) === v));
		const selectedOpts = flatOptions.filter((opt) => value?.find((val) => getOptionValue(opt) === val));

		setSelectedOptions(selectedOpts);
		setValue(id, updatedValues);
	}, [options, value]);

	useEffect(() => {
		setExpandedState(expanded);
	}, [expanded]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (options: IOption[]): void => {
		onChange({ target: { value: options.map((opt) => getOptionValue(opt)) } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Filter.Checkbox
			id={id}
			{...otherSchema}
			data-testid={TestHelper.generateId(id, "filter-checkbox")}
			title={title}
			addon={addon}
			selectedOptions={selectedOptions}
			options={options}
			expanded={expandedState}
			onExpandChange={setExpandedState}
			onSelect={handleChange}
			valueExtractor={(item) => (isParentOption(item) ? item.key : item.value)}
			labelExtractor={(item) => (
				<Sanitize inline sanitizeOptions={{ allowedAttributes: false }}>
					{item.label}
				</Sanitize>
			)}
		></Filter.Checkbox>
	);
};
