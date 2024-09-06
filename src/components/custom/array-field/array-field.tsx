import { Text } from "@lifesg/react-design-system/text";
import * as Icons from "@lifesg/react-icons";
import { BinIcon, PlusCircleFillIcon } from "@lifesg/react-icons";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { useValidationConfig } from "../../../utils/hooks";
import { Warning } from "../../shared";
import { TFrontendEngineValues } from "../../types";
import { IGenericCustomFieldProps } from "../types";
import { ArrayFieldElement } from "./array-field-element";
import { AddButton, ErrorAlert, RemoveButton, Section, SectionDivider, SectionHeader } from "./array-field.styles";
import { IArrayFieldSchema } from "./types";

export const ArrayField = (props: IGenericCustomFieldProps<IArrayFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		id,
		onChange,
		schema: { addButton, fieldSchema, removeButton, sectionTitle, validation },
		value,
		warning,
	} = props;
	const [stateValue, setStateValue] = useState<TFrontendEngineValues[]>([{}]);
	const [isValid, setIsValid] = useState<boolean[]>([false]);
	const isValidRef = useRef(isValid);
	const { setFieldValidationConfig } = useValidationConfig();
	const [min, setMin] = useState<number | undefined>(undefined);
	const [max, setMax] = useState<number | undefined>(undefined);
	const [length, setLength] = useState<number | undefined>(undefined);
	const isInitialisedValue = useRef<boolean>(false);
	const { setValue } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const minRule = validation?.find((rule) => "min" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		const lengthRule = validation?.find((rule) => "length" in rule);
		const min = minRule?.["min"] ?? undefined;
		const max = maxRule?.["max"] ?? undefined;
		const length = lengthRule?.["length"] ?? undefined;
		setMin(min ?? length);
		setMax(max ?? length);
		setLength(length);

		setFieldValidationConfig(
			id,
			Yup.array().test("is-array-valid", "One or more of the sections is incomplete", () => {
				return isValidRef.current.every((valid) => valid);
			}),
			validation
		);
	}, [validation]);

	useEffect(() => {
		if (value && isInitialisedValue.current) {
			isInitialisedValue.current = false;

			const nextValue = initValue(length || 1);
			setStateValue(nextValue);
			setValue(id, nextValue, { shouldDirty: false, shouldTouch: false });
		} else if (value) {
			isInitialisedValue.current = false;

			setStateValue(value);
		} else {
			isInitialisedValue.current = true;

			const nextValue = initValue(length || 1);
			setStateValue(nextValue);
			setValue(id, nextValue, { shouldDirty: false, shouldTouch: false });
		}
	}, [value, length]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleSectionChange =
		(index: number) =>
		(data: TFrontendEngineValues, valid: boolean): void => {
			/* setting values */
			const newSectionValue = [...stateValue];
			newSectionValue[index] = data;
			onChange({ target: { value: newSectionValue } });

			/* setting validity */
			setIsValid((previousIsValid) => {
				const isSectionValid = [...previousIsValid];
				isSectionValid[index] = valid;

				isValidRef.current = isSectionValid;
				return isSectionValid;
			});
		};

	const handleAddSection = () => {
		const newFormValues = [...stateValue, {}];
		setStateValue(newFormValues);
		setIsValid([...isValid, false]);
	};

	const handleRemoveSection = (index: number) => {
		const updatedValues = stateValue.filter((_, i) => i !== index);
		setStateValue(updatedValues);
		setIsValid(isValid.filter((_, i) => i !== index));
	};

	// =============================================================================
	// HELPERS
	// =============================================================================
	const initValue = (len: number) => {
		return Array(len)
			.fill(null)
			.map(() => ({}));
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const showRemoveButton = min >= 0 ? stateValue.length > min : true;
	const showAddButton = max >= 1 ? stateValue.length < max : true;

	const renderIcon = (icon: keyof typeof Icons) => {
		const Element = Icons[icon];

		return <Element />;
	};

	return (
		<>
			{stateValue.map((sectionValues, index) => {
				const isLastItem = index === stateValue.length - 1;
				return (
					<Section key={index}>
						<SectionHeader>
							{sectionTitle && <Text.Body weight="bold">{sectionTitle}</Text.Body>}
							{showRemoveButton && (
								<RemoveButton
									type="button"
									styleType="link"
									icon={removeButton?.icon ? renderIcon(removeButton.icon) : <BinIcon />}
									danger
									onClick={() => handleRemoveSection(index)}
								>
									{removeButton?.label ?? "Remove"}
								</RemoveButton>
							)}
						</SectionHeader>
						<ArrayFieldElement
							formValues={sectionValues}
							schema={fieldSchema}
							onChange={handleSectionChange(index)}
						/>
						{!isLastItem || showAddButton ? <SectionDivider /> : null}
					</Section>
				);
			})}
			{showAddButton && (
				<AddButton
					type="button"
					styleType="link"
					icon={addButton?.icon ? renderIcon(addButton.icon) : <PlusCircleFillIcon />}
					onClick={handleAddSection}
				>
					{addButton?.label ?? "Add"}
				</AddButton>
			)}
			{error && <ErrorAlert type="error">{error.message}</ErrorAlert>}
			<Warning id={id} message={warning} />
		</>
	);
};
