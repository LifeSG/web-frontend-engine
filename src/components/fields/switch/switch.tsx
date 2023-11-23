import { Form } from "@lifesg/react-design-system/form";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { FlexWrapper } from "./switch.styles";
import { ISwitchSchema } from "./types";

export const Switch = (props: IGenericFieldProps<ISwitchSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		schema: { className, customOptions, disabled, label, validation, ...otherSchema },
		value,
	} = props;

	const [stateValue, setStateValue] = useState<boolean>(value || undefined);
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.boolean().strict(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleClick = (value: boolean) => {
		onChange({ target: { value } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const isSwitchChecked = (value: boolean) => {
		return stateValue === value;
	};

	const formatId = (type: string) => {
		return `${id}-${type}`;
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<Form.CustomField id={id} label={formattedLabel} errorMessage={error?.message}>
			<FlexWrapper
				className={className}
				role="radiogroup"
				aria-label={typeof label === "string" ? label : label.mainLabel}
			>
				<Toggle
					{...otherSchema}
					type="yes"
					id={formatId("yes")}
					data-testid={TestHelper.generateId(id, "switch-yes")}
					disabled={disabled}
					styleType={customOptions?.border === false ? "no-border" : "default"}
					checked={isSwitchChecked(true)}
					onChange={() => handleClick(true)}
					indicator={true}
					name={id}
					error={!!error?.message}
				>
					Yes
				</Toggle>
				<Toggle
					{...otherSchema}
					type="no"
					id={formatId("no")}
					data-testid={TestHelper.generateId(id, "switch-no")}
					disabled={disabled}
					styleType={customOptions?.border === false ? "no-border" : "default"}
					checked={isSwitchChecked(false)}
					onChange={() => handleClick(false)}
					indicator={true}
					name={id}
					error={!!error?.message}
				>
					No
				</Toggle>
			</FlexWrapper>
		</Form.CustomField>
	);
};
