import { L1OptionProps, L2OptionProps, L3OptionProps } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { IBaseOption, IL1Option, IL2Option, INestedMultiSelectSchema } from "./types";

export const NestedMultiSelect = (props: IGenericFieldProps<INestedMultiSelectSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, options, ...otherSchema },
		id,
		value,
		onChange,
		error,
		...otherProps
	} = props;

	type TNestedOptionKeyProps =
		| L1OptionProps<string, string, string>
		| L2OptionProps<string, string>
		| L3OptionProps<string>;
	type TNestedOptionProps = IL1Option | IL2Option | IBaseOption;

	const optionsWithKeys = useRef<L1OptionProps<string, string, string>[]>();
	const { setValue } = useFormContext();
	const { setFieldValidationConfig } = useValidationConfig();
	const [selectedKeyPaths, setSelectedKeyPaths] = useState<string[][]>();

	// =============================================================================
	// EFFECTS
	// =============================================================================

	const getSelectedKeyPaths = useCallback((): string[][] => {
		const getPath = (options: TNestedOptionKeyProps[], selectedValue: string, path: string[] = []) => {
			for (const option of options) {
				if (option.subItems) {
					const subOptionPath = getPath(option.subItems, selectedValue, [...path, option.key]);
					if (subOptionPath.length > 0) {
						return subOptionPath;
					}
				} else if (option.value === selectedValue) {
					return [...path, option.key];
				}
			}
			return [];
		};

		const paths = [];
		value?.forEach((val: string) => {
			const path = getPath(optionsWithKeys.current, val);
			if (path.length) {
				paths.push(path);
			}
		});
		return paths;
	}, [value]);

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
		const findValueInOptions = (options: TNestedOptionProps[], value: string): TNestedOptionProps => {
			for (const option of options) {
				const typedOption = option as IL1Option | IL2Option;
				if (typedOption.subItems) {
					const subItem = findValueInOptions(typedOption.subItems, value);
					if (subItem) {
						return subItem;
					}
				} else if (option.value === value) {
					return option;
				}
			}
			return null;
		};

		const updatedValues = value?.filter((v) => findValueInOptions(options, v) !== null);
		setValue(id, updatedValues);
	}, [options]);

	useEffect(() => {
		const mapOptions = (options: TNestedOptionProps[], layer = 1) => {
			return options.map((option: TNestedOptionProps, index: number) => {
				const key = generateOptionKey(option, layer, index);
				const typedOption = option as IL1Option | IL2Option;
				const subItems = typedOption.subItems ? mapOptions(typedOption.subItems, layer + 1) : null;
				return { ...option, ...(subItems && { subItems }), key };
			});
		};
		optionsWithKeys.current = mapOptions(options);
		const selectedPaths = getSelectedKeyPaths();
		setSelectedKeyPaths(selectedPaths);
	}, [getSelectedKeyPaths, options]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const generateOptionKey = (option: IBaseOption, layer: number, position: number): string => {
		return `${layer}-${position}-${option.value}`;
	};

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (keyPaths: string[][], values: string[]): void => {
		const parsedValues = values.map((option) => option);
		onChange({ target: { value: parsedValues } });
		const newKeyPath = keyPaths ? keyPaths : [];
		setSelectedKeyPaths(newKeyPath);
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
			label={label}
			options={optionsWithKeys.current}
			onSelectOptions={handleChange}
			selectedKeyPaths={selectedKeyPaths}
			errorMessage={error?.message}
		/>
	);
};
