import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { FieldWrapper } from "../../elements/wrapper/field-wrapper";
import { Chip, ERROR_MESSAGES } from "../../shared";
import { ITextareaSchema, Textarea } from "../textarea";
import { ChipContainer } from "./chips.styles";
import { IChipsSchema } from "./types";

export const Chips = (props: IGenericFieldProps<IChipsSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, options, validation, disabled, textarea, ...otherSchema },
		id,
		value,
		onChange,
		error,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const [showTextarea, setShowTextarea] = useState(false);
	const [multi, setMulti] = useState(true);
	const { setValue, unregister } = useFormContext();
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (!showTextarea) {
			// at the start, the textarea's default value has to be manually cleared from the form state
			unregister(getTextareaId());
		}
	}, []);

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

	useDeepCompareEffect(() => {
		const optionValuesWithTextarea = [...options.map((option) => option.value), textarea?.label];
		const updatedValues = value?.filter((v) => optionValuesWithTextarea.includes(v));
		setValue(id, updatedValues);
	}, [options]);

	useEffect(() => {
		if (value?.includes(textarea?.label)) {
			toggleTextarea(true);
		} else {
			toggleTextarea();
		}
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

	const toggleTextarea = (show = false) => {
		setShowTextarea(show);
		if (!show) {
			removeFieldValidationConfig(getTextareaId());
		}
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
				disabled={disabled ?? option.disabled}
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
			return <></>;
		}

		const textareaId = getTextareaId();
		const schema: ITextareaSchema = {
			uiType: "textarea",
			label,
			className: otherSchema.className ? `${otherSchema.className}-textarea` : undefined,
			...textarea,
		};
		return showTextarea ? <FieldWrapper id={textareaId} schema={schema} Field={Textarea} /> : <></>;
	};

	return (
		<Form.CustomField label={label} errorMessage={error?.message} {...otherProps}>
			<ChipContainer data-testid={TestHelper.generateId(id, "chips")} $showTextarea={showTextarea}>
				{renderChips()}
				{renderTextareaChip()}
			</ChipContainer>
			{renderTextarea()}
		</Form.CustomField>
	);
};
