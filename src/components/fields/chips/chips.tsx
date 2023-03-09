import { Form } from "@lifesg/react-design-system/form";
import kebabCase from "lodash/kebabCase";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Chip, ERROR_MESSAGES } from "../../shared";
import { ITextareaSchema, Textarea } from "../textarea";
import { ChipContainer } from "./chips.styles";
import { IChipsSchema } from "./types";

export const Chips = (props: IGenericFieldProps<IChipsSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, options, textarea, ...otherSchema },
		id,
		value,
		onChange,
		error,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const [showTextarea, setShowTextarea] = useState(false);
	const [multi, setMulti] = useState(true);
	const { control } = useFormContext();
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);

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

		if (maxRule?.max === 1 || lengthRule?.length === 1) {
			setMulti(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value || []);
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isChipSelected = (text: string): boolean => {
		return stateValue.includes(text);
	};

	const getTextareaId = () => {
		return `${id}-textarea`;
	};

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (text: string): void => {
		let updatedStateValues = [...stateValue]; // Prevent mutation to original state value
		const isExistingValue = updatedStateValues.includes(text);

		// Removal of value from state
		if (isExistingValue) {
			updatedStateValues = updatedStateValues.filter((value) => value !== text);
			onChange({ target: { value: updatedStateValues } });
			return;
		}

		// Adding values to state
		if (multi) {
			updatedStateValues.push(text);
		} else {
			updatedStateValues = [text];
		}
		onChange({ target: { value: updatedStateValues } });
	};

	const handleTextareaChipClick = (name: string) => {
		handleChange(name);
		setShowTextarea((prevState) => {
			if (prevState) {
				removeFieldValidationConfig(getTextareaId());
			}
			return !prevState;
		});
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderChips = (): JSX.Element[] => {
		return options.map((option, index) => (
			<Chip
				{...otherSchema}
				key={index}
				onClick={() => handleChange(option.value)}
				isActive={isChipSelected(option.value)}
			>
				{option.label}
			</Chip>
		));
	};

	const renderTextareaChip = (): JSX.Element => {
		const textareaLabel = textarea?.label;
		if (!textarea && !textareaLabel) {
			return;
		}
		return (
			<Chip
				{...otherSchema}
				onClick={() => handleTextareaChipClick(textareaLabel)}
				isActive={isChipSelected(textareaLabel)}
			>
				{textareaLabel}
			</Chip>
		);
	};

	const renderTextarea = (): JSX.Element => {
		const textareaLabel = textarea?.label;
		if (!textarea && !textareaLabel) {
			return;
		}

		const textareaId = getTextareaId();
		const schema: ITextareaSchema = {
			fieldType: "textarea",
			label,
			...textarea,
		};
		return (
			showTextarea && (
				<Controller
					control={control}
					name={textareaId}
					shouldUnregister={true}
					render={({ field, fieldState }) => {
						const fieldProps = { ...field, id: textareaId, ref: undefined };
						return <Textarea schema={schema} {...fieldProps} {...fieldState} />;
					}}
				/>
			)
		);
	};

	return (
		<Form.CustomField label={label} errorMessage={error?.message} {...otherProps}>
			<ChipContainer data-testid={TestHelper.generateId(id, "chips")}>
				{renderChips()}
				{renderTextareaChip()}
			</ChipContainer>
			{renderTextarea()}
		</Form.CustomField>
	);
};
