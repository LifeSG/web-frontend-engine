import { InputRangeProp } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { InputRangeSelect } from "@lifesg/react-design-system/input-select";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { IRangeSelectOption, IRangeSelectSchema } from "./types";
import { ERROR_MESSAGES } from "../../shared/error-messages";

export const RangeSelect = (props: IGenericFieldProps<IRangeSelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, options, ...otherSchema },
		id,
		name,
		value = { from: undefined, to: undefined },
		error,
		onChange,
	} = props;

	const { setValue } = useFormContext();
	const [toStateValue, setToStateValue] = useState<string>(value.from || "");
	const [fromStateValue, setFromStateValue] = useState<string>(value.to || "");
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);

		setFieldValidationConfig(
			id,
			Yup.object()
				.shape({
					from: Yup.string(),
					to: Yup.string(),
				})
				.test(
					"is-empty-string",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.REQUIRED_OPTIONS,
					(value) => {
						if (!value || !isRequiredRule?.required) return true;

						return value.from.length > 0 && value.to.length > 0;
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useDeepCompareEffect(() => {
		const newValue: any = {};
		if (!options.from.find((option) => option.value === value.from)) {
			newValue.from = "";
		}
		if (!options.to.find((option) => option.value === value.to)) {
			newValue.to = "";
		}
		setValue(id, { ...value, ...newValue });
	}, [options]);

	useEffect(() => {
		setFromStateValue(value.from);
		setToStateValue(value.to);
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getSelectedOptions = (): InputRangeProp<IRangeSelectOption> => {
		return {
			from: options.from.find(({ value }) => value === fromStateValue),
			to: options.to.find(({ value }) => value === toStateValue),
		};
	};

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (option): void => {
		if (option.from) onChange({ target: { value: { from: option.from.value, to: toStateValue } } });
		if (option.to) onChange({ target: { value: { to: option.to.value, from: fromStateValue } } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			<InputRangeSelect
				{...otherSchema}
				id={id}
				data-testid={TestHelper.generateId(id, "range-select")}
				name={name}
				options={options}
				onSelectOption={handleChange}
				selectedOptions={getSelectedOptions()}
				valueToStringFunction={(value: any) => `${value.from} - ${value.to}`}
				valueExtractor={(item: IRangeSelectOption) => ({ from: item.value, to: item.value })}
				displayValueExtractor={(item: IRangeSelectOption) => item.label}
				listExtractor={(item: IRangeSelectOption) => item.value}
			/>
		</Form.CustomField>
	);
};
