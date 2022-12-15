import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { Chip, ERROR_MESSAGES } from "../../shared";
import { IWrapperSchema, Wrapper } from "../wrapper";
import { ChipContainer } from "./chips.styles";
import { IChipsSchema } from "./types";

export const Chips = (props: IGenericFieldProps<IChipsSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, options, textarea, multi = true, ...otherSchema },
		id,
		value,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string[]>(value || []);
	const [showTextArea, setShowTextArea] = useState<boolean>(false);
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationSchema();

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

	useEffect(() => {
		setStateValue(value || []);
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isChipSelected = (text: string): boolean => {
		return stateValue.includes(text);
	};

	const getTextAreaId = () => {
		return `chips-${textarea.label}`;
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
		setShowTextArea((prevState) => {
			if (prevState) {
				removeFieldValidationConfig(getTextAreaId());
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

	const renderTextAreaChip = (): JSX.Element => {
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

	const renderTextArea = (): JSX.Element => {
		const textareaLabel = textarea?.label;
		if (!textarea && !textareaLabel) {
			return;
		}
		const wrapperSchema: IWrapperSchema = {
			fieldType: "div",
			children: {
				[getTextAreaId()]: {
					fieldType: "textarea",
					...textarea,
				},
			},
		};
		return showTextArea && <Wrapper id={id} schema={wrapperSchema} />;
	};

	return (
		<Form.CustomField label={label} errorMessage={otherProps?.error?.message} {...otherProps}>
			<ChipContainer data-testid={TestHelper.generateId(id, "chips")}>
				{renderChips()}
				{renderTextAreaChip()}
			</ChipContainer>
			{renderTextArea()}
		</Form.CustomField>
	);
};
