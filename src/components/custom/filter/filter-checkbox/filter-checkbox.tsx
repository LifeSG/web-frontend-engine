import { Filter } from "@lifesg/react-design-system/filter";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import { TestHelper } from "../../../../utils";
import { Sanitize } from "../../../shared";
import { IGenericCustomFieldProps } from "../../types";
import { FilterHelper } from "../filter-helper";
import { IFilterCheckboxSchema, IOption } from "./types";

export const FilterCheckbox = (props: IGenericCustomFieldProps<IFilterCheckboxSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, expanded, ...otherSchema },
		id,
		value,
		onChange,
	} = props;

	const { setValue } = useFormContext();
	const [selectedOptions, setSelectedOptions] = useState<IOption[]>(); // Current selected value state
	const [expandedState, setExpandedState] = useState(expanded);
	const { title, addon } = FilterHelper.constructFormattedLabel(label, id);
	// =============================================================================
	// EFFECTS
	// =============================================================================

	useDeepCompareEffect(() => {
		const updatedValues = value?.filter((v) => options.find((option) => option.value === v));
		const selectedOpts = options.filter((opt) => value?.find((val) => opt.value === val));
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
		onChange({ target: { value: options.map((opt) => opt.value) } });
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
			labelExtractor={(item) => (
				<Sanitize inline sanitizeOptions={{ allowedAttributes: false }}>
					{item.label}
				</Sanitize>
			)}
		></Filter.Checkbox>
	);
};
