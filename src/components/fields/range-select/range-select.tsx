import { Form } from "@lifesg/react-design-system/form";
import { InputRangeProp } from "@lifesg/react-design-system/input-range-select";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Warning } from "../../shared";
import { ERROR_MESSAGES } from "../../shared/error-messages";
import { IRangeSelectOption, IRangeSelectSchema } from "./types";

export const RangeSelect = (props: IGenericFieldProps<IRangeSelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		schema: { label: _label, options, validation, ...otherSchema },
		value = { from: undefined, to: undefined },
		warning,
		...otherProps
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
						return value.from?.length > 0 && value.to?.length > 0;
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useDeepCompareEffect(() => {
		const newValue: Record<string, string> = {};
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
	const handleChange = (option: InputRangeProp<IRangeSelectOption>): void => {
		if (option.from === undefined && option.to === undefined)
			onChange({ target: { value: { from: undefined, to: undefined } } });
		if (option.from) onChange({ target: { value: { from: option.from.value, to: undefined } } });
		if (option.to) onChange({ target: { value: { to: option.to.value, from: fromStateValue } } });
	};

	const handleBlur = () => {
		if (!value.from || !value.to) {
			onChange({ target: { value: { from: undefined, to: undefined } } });
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<>
			<Form.RangeSelect
				{...otherSchema}
				{...otherProps}
				id={id}
				onHideOptions={handleBlur}
				data-testid={TestHelper.generateId(id)}
				label={formattedLabel}
				options={options}
				onSelectOption={handleChange}
				selectedOptions={getSelectedOptions()}
				valueToStringFunction={(value) => `${value.from} - ${value.to}`}
				valueExtractor={(item: IRangeSelectOption) => ({ from: item.value, to: item.value })}
				displayValueExtractor={(item: IRangeSelectOption) => item.label}
				listExtractor={(item: IRangeSelectOption) => item.label}
				errorMessage={error?.message}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
