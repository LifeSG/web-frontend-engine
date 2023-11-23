import { L1OptionProps } from "@lifesg/react-design-system";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useRef, useState } from "react";
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

	const optionsWithKeys = useRef<L1OptionProps<string, string, string>[]>();
	const { setValue } = useFormContext();
	const { setFieldValidationConfig } = useValidationConfig();
	const [selectedKeyPaths, setSelectedKeyPaths] = useState<string[][]>();

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
		setValue(id, updatedValues);
	}, [options]);

	useEffect(() => {
		const mapOptions = (options: IL1Option[] | IL2Option[] | IBaseOption[], layer: number) => {
			return options.map((option: IL1Option | IL2Option | IBaseOption, index: number) => {
				const key = generateOptionKey(option, layer, index);
				const typedOption = option as IL1Option | IL2Option;
				const subItems = typedOption.subItems ? mapOptions(typedOption.subItems, layer + 1) : null;
				return { ...option, ...(subItems && { subItems }), key };
			});
		};

		optionsWithKeys.current = mapOptions(options, 1);
	}, [options]);

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
