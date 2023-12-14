import { Form } from "@lifesg/react-design-system/form";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { INestedMultiSelectSchema, TL1OptionProps, TNestedValues } from "./types";

export const NestedMultiSelect = (props: IGenericFieldProps<INestedMultiSelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label: _label, validation, options, ...otherSchema },
		id,
		value,
		formattedLabel,
		onChange,
		error,
		...otherProps
	} = props;

	const { setValue } = useFormContext();
	const { setFieldValidationConfig } = useValidationConfig();
	const [stateValue, setStateValue] = useState<TNestedValues>(value);

	// =============================================================================
	// EFFECTS / CALLBACKS
	// =============================================================================

	const getKeyPaths = useCallback((): string[][] => {
		const keyPaths: string[][] = [];

		const traverseNestedValue = (currentValue: TNestedValues, currentPath: string[]) => {
			for (const key in currentValue) {
				const newPath = [...currentPath, key];
				const value = currentValue[key];

				if (typeof value === "string") {
					keyPaths.push(newPath);
				} else {
					traverseNestedValue(value, newPath);
				}
			}
		};

		traverseNestedValue(stateValue, []);

		return keyPaths;
	}, [stateValue]);

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
		const findValueInOptions = (options: TL1OptionProps[], nested: TNestedValues): TNestedValues | string => {
			const result: TNestedValues = {};

			for (const option of options) {
				const { key, subItems } = option;
				const nestedValue = nested[key];

				if (nestedValue) {
					result[key] =
						typeof nestedValue === "string"
							? nestedValue
							: (findValueInOptions(subItems || [], nestedValue) as string);
				}
			}

			return result;
		};

		const updatedValues = value ? findValueInOptions(options, value) : value;
		setValue(id, updatedValues);
	}, [options]);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================

	const parseOutputValue = (keyPaths: string[][], values: string[]): TNestedValues => {
		const result: TNestedValues = {};
		keyPaths.forEach((paths, pathsIndex) => {
			paths.reduce((currentValue, key, index) => {
				if (index === paths.length - 1) {
					currentValue[key] = values[pathsIndex];
				} else if (!currentValue[key]) {
					currentValue[key] = {};
				}
				return currentValue[key] as TNestedValues;
			}, result);
		});
		return result;
	};

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (keyPaths: string[][], values: string[]): void => {
		const parsedValues = parseOutputValue(keyPaths, values);
		onChange({ target: { value: parsedValues } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.NestedMultiSelect
			{...otherSchema}
			{...otherProps}
			id={id}
			data-testid={TestHelper.generateId(id)}
			label={formattedLabel}
			options={options}
			onSelectOptions={handleChange}
			selectedKeyPaths={getKeyPaths()}
			errorMessage={error?.message}
		/>
	);
};
