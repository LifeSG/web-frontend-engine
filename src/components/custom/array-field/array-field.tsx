import { Alert } from "@lifesg/react-design-system/alert";
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import * as Icons from "@lifesg/react-icons";
import { PlusCircleFillIcon } from "@lifesg/react-icons/plus-circle-fill";
import isEmpty from "lodash/isEmpty";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { TErrorPayload } from "../../frontend-engine";
import { ERROR_MESSAGES, Prompt } from "../../shared";
import { IFrontendEngineRef, TFrontendEngineValues } from "../../types";
import { IGenericCustomFieldProps } from "../types";
import { ArrayFieldElement } from "./array-field-element";
import {
	AddButton,
	CustomErrorDisplay,
	Inset,
	RemoveButton,
	SectionDivider,
	SectionHeader,
	WarningAlert,
} from "./array-field.styles";
import { IArrayFieldSchema } from "./types";

export const ArrayField = (props: IGenericCustomFieldProps<IArrayFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		id,
		onChange,
		schema: {
			addButton,
			fieldSchema,
			removeButton,
			removeConfirmationModal,
			sectionInset,
			sectionTitle,
			showDivider = true,
			validation,
		},
		value,
		warning,
	} = props;
	const [stateValue, _setStateValue] = useState<TFrontendEngineValues[]>([{}]);
	const [stateKeys, setStateKeys] = useState<string[]>(() => [generateRandomId()]);
	const [showRemovePrompt, setShowRemovePrompt] = useState<boolean>(false);
	const [indexToRemove, setIndexToRemove] = useState<number>(-1);
	const { setFieldValidationConfig } = useValidationConfig();
	const [min, setMin] = useState<number | undefined>(undefined);
	const [max, setMax] = useState<number | undefined>(undefined);
	const [length, setLength] = useState<number | undefined>(undefined);
	const isInitialisedValue = useRef<boolean>(false);
	const { resetField, setValue } = useFormContext();
	const formRefs = useRef<IFrontendEngineRef[]>([]);
	const stateValueRef = useRef(stateValue);
	const [fieldErrors, setFieldErrors] = useState<TErrorPayload[] | undefined>(undefined);
	const [mainErrorMessage, setMainErrorMessage] = useState<string | undefined>(undefined);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const validRule = validation?.find((rule) => "valid" in rule);
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
			Yup.array()
				.test("is-array-valid", validRule?.errorMessage || ERROR_MESSAGES.ARRAY_FIELD.INVALID, () => {
					return stateValueRef.current.every((_, i) => formRefs.current[i].isValid());
				})
				.test(
					"is-empty-array",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.ARRAY_FIELD.REQUIRED,
					(value) => {
						if (!value || !isRequiredRule?.required) return true;

						return value.length > 0 && value.some((item) => !isEmpty(item));
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (value) {
			if (value === stateValue) {
				// triggered from form change, no need to handle again as it may override the form unintentionally
				return;
			}
			const nextValue = padArray(value, length, () => ({}));
			const nextKeys = padArray(stateKeys, nextValue.length, generateRandomId);

			setStateValue(nextValue);
			setStateKeys(nextKeys);

			if (isInitialisedValue.current) {
				isInitialisedValue.current = false;
				setValue(id, nextValue, { shouldDirty: false, shouldTouch: false });
			}
		} else {
			isInitialisedValue.current = true;

			const nextValue = initValue(length || 1);
			const nextKeys = nextValue.map(() => generateRandomId());

			setStateValue(nextValue);
			setStateKeys(nextKeys);
			resetField(id, { defaultValue: nextValue, keepDirty: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, length, setValue, id]);

	useEffect(() => {
		try {
			const errorData = JSON.parse(error?.message);
			// set custom error for each field of array
			errorData.fields && setFieldErrors(errorData.fields);
			errorData.errorMessage && setMainErrorMessage(errorData.errorMessage);
		} catch (e) {
			setMainErrorMessage(error?.message);
		}
	}, [error]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleSectionChange =
		(index: number) =>
		(data: TFrontendEngineValues): void => {
			const newSectionValue = [...stateValue];
			newSectionValue[index] = data;
			setStateValue(newSectionValue);
			onChange({ target: { value: newSectionValue } });
		};

	const handleAddSection = () => {
		const newFormValues = [...stateValue, {}];
		const newStateKeys = [...stateKeys, generateRandomId()];
		setStateValue(newFormValues);
		setStateKeys(newStateKeys);
		onChange({ target: { value: newFormValues } });
	};

	const handleRemoveSection = (index: number) => {
		setShowRemovePrompt(true);
		setIndexToRemove(index);
	};

	const handleConfirmRemove = () => {
		const updatedValues = stateValue.filter((_, i) => i !== indexToRemove);
		const updatedKeys = stateKeys.filter((_, i) => i !== indexToRemove);
		setStateValue(updatedValues);
		setStateKeys(updatedKeys);
		setShowRemovePrompt(false);
		onChange({ target: { value: updatedValues } });
	};

	const handleCancelRemove = () => {
		setShowRemovePrompt(false);
	};

	// =============================================================================
	// HELPERS
	// =============================================================================
	const initValue = (len: number) => {
		return Array(len)
			.fill(null)
			.map(() => ({}));
	};

	const padArray = <T,>(arr: T[], len: number, generator: () => T) => {
		const newArr = [...arr];
		while (newArr.length < len) {
			newArr.push(generator());
		}
		return newArr;
	};

	const setStateValue = (nextValue: TFrontendEngineValues[]) => {
		_setStateValue(nextValue);
		stateValueRef.current = nextValue;
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
					<Fragment key={stateKeys[index]}>
						<Inset $inset={sectionInset}>
							<SectionHeader>
								{sectionTitle && <V2_Text.Body weight="bold">{sectionTitle}</V2_Text.Body>}
								{showRemoveButton && (
									<RemoveButton
										type="button"
										styleType="light"
										danger
										icon={removeButton?.icon ? renderIcon(removeButton.icon) : undefined}
										onClick={() => handleRemoveSection(index)}
									>
										{removeButton?.label ?? "Remove"}
									</RemoveButton>
								)}
							</SectionHeader>
							<ArrayFieldElement
								ref={(formRef) => (formRefs.current[index] = formRef)}
								formValues={sectionValues}
								schema={fieldSchema}
								onChange={handleSectionChange(index)}
								error={fieldErrors?.[index]}
							/>
						</Inset>
						{showDivider && !isLastItem ? <SectionDivider /> : null}
					</Fragment>
				);
			})}
			{showAddButton && (
				<Inset $inset={sectionInset}>
					<AddButton
						type="button"
						styleType="light"
						icon={addButton?.icon ? renderIcon(addButton.icon) : <PlusCircleFillIcon />}
						onClick={handleAddSection}
					>
						{addButton?.label ?? "Add"}
					</AddButton>
				</Inset>
			)}
			{mainErrorMessage && (
				<Inset $inset={sectionInset}>
					<Alert type="error">{mainErrorMessage}</Alert>
				</Inset>
			)}
			{warning && (
				<Inset $inset={sectionInset}>
					<WarningAlert id={id} message={warning} />
				</Inset>
			)}
			<Prompt
				id={`${id}-remove-prompt`}
				size="large"
				image={<CustomErrorDisplay type="warning" title={<></>} description={<></>} />}
				title={removeConfirmationModal?.title ?? "Remove entry?"}
				description="The information you’ve entered will be deleted."
				show={showRemovePrompt}
				buttons={[
					{
						id: "back",
						title: "Back",
						buttonStyle: "secondary",
						onClick: handleCancelRemove,
					},
					{
						id: "remove",
						title: "Remove",
						onClick: handleConfirmRemove,
					},
				]}
			/>
		</>
	);
};
