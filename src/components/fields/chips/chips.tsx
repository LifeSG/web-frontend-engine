import { Form } from "@lifesg/react-design-system/form";
import clone from "lodash/clone";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ChipWithState, ERROR_MESSAGES } from "../../shared";
import { IWrapperSchema, Wrapper } from "../wrapper";
import { IChipsSchema } from "./types";

interface ISelectedChips {
	[key: string]: boolean;
}

export const Chips = (props: IGenericFieldProps<IChipsSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: {
			label,
			validation,
			chipTexts,
			showTextAreaChip,
			textAreaChipName,
			isTextAreaRequired,
			isSingleSelection,
			resizable,
			maxLength,
			rows,
			...otherSchema
		},
		id,
		name,
		value,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<ISelectedChips>({});
	const [showTextArea, setShowTextArea] = useState<boolean>(false);
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);

		setFieldValidationConfig(
			id,
			Yup.object().test(
				"is-empty-object",
				isRequiredRule?.errorMessage || ERROR_MESSAGES.COMMON.REQUIRED_OPTION,
				(value) => {
					if (!value || !isRequiredRule?.required) return true;

					return isEmpty(value);
				}
			),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(formatValues(value) || {});
	}, [value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isChipSelected = (text: string): boolean => {
		return text in stateValue;
	};

	const isChipEnabled = (text: string): boolean => {
		return !isSingleSelection || isChipSelected(text);
	};

	const formatValues = (values: string[] | ISelectedChips): ISelectedChips => {
		if (!Array.isArray(values)) {
			return values;
		}
		return Object.fromEntries(values.map((value) => [value, true]));
	};

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (text: string): void => {
		let updatedStateValues = clone(stateValue); // Prevent mutation to original state value
		const isExistingValue = text in updatedStateValues;

		if (isExistingValue) {
			delete updatedStateValues[text];
			onChange({ target: { value: updatedStateValues } });
			return;
		}

		if (!isSingleSelection) {
			updatedStateValues = {
				...updatedStateValues,
				[text]: true,
			};
			onChange({ target: { value: updatedStateValues } });
			return;
		}

		// if (textAreaChipName in updatedStateValues) {
		// 	setShowTextArea(false);
		// }
		updatedStateValues = {
			[text]: true,
		};
		onChange({ target: { value: updatedStateValues } });
	};

	const handleToggleTextArea = () => {
		setShowTextArea(!showTextArea);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderChips = (): JSX.Element[] => {
		return chipTexts.map((text, index) => {
			return (
				<ChipWithState
					{...otherSchema}
					key={index}
					text={text}
					isEnabled={isChipEnabled(text)}
					isInitiallyActive={isChipSelected(text)}
					onChange={() => handleChange(text)}
				/>
			);
		});
	};

	const renderTextAreaChip = (): JSX.Element => {
		return (
			showTextAreaChip && (
				<ChipWithState
					{...otherSchema}
					id={id}
					toggleShowTextArea={handleToggleTextArea}
					text={textAreaChipName}
					isEnabled={isChipEnabled(textAreaChipName)}
					isInitiallyActive={isChipSelected(textAreaChipName)}
					onChange={() => handleChange(textAreaChipName)}
				/>
			)
		);
	};

	const renderTextArea = (): JSX.Element => {
		const textAreaId = `chips-${textAreaChipName}`;
		const wrapperSchema: IWrapperSchema = {
			fieldType: "div",
			children: {
				[textAreaId]: {
					fieldType: "textarea",
					label: textAreaChipName,
					maxLength,
					rows,
					resizable,
					...(isTextAreaRequired && {
						validation: [{ required: true }],
					}),
				},
			},
		};
		return showTextArea && <Wrapper id={id} schema={wrapperSchema} />;
	};

	return (
		<Form.CustomField label={label} errorMessage={otherProps?.error?.message} {...otherProps}>
			<>
				{renderChips()}
				{renderTextAreaChip()}
				{renderTextArea()}
			</>
		</Form.CustomField>
	);
};
