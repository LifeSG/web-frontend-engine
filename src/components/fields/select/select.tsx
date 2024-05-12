import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { Warning } from "../../shared";
import { ISelectOption, ISelectSchema } from "./types";

export const Select = (props: IGenericFieldProps<ISelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		schema: { label: _label, options, validation, ...otherSchema },
		value,
		warning,
		...otherProps
	} = props;

	const { setValue } = useFormContext();
	const [stateValue, setStateValue] = useState<string>(value || "");
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useDeepCompareEffect(() => {
		if (!options.find((option) => option.value === value)) {
			setValue(id, "");
		}
	}, [options]);

	useEffect(() => {
		setStateValue(value || "");
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getSelectOption = (): ISelectOption => options.find(({ value }) => value === stateValue);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (_, option: string): void => {
		onChange({ target: { value: option } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<>
			<Form.Select
				{...otherSchema}
				{...otherProps}
				id={id}
				data-testid={TestHelper.generateId(id, "select")}
				label={formattedLabel}
				errorMessage={error?.message}
				options={options}
				onSelectOption={handleChange}
				selectedOption={getSelectOption()}
				displayValueExtractor={(item: ISelectOption) => item.label}
				valueExtractor={(item: ISelectOption) => item.value}
				listExtractor={(item: ISelectOption) => item.label}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
