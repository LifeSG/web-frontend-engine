import { Form } from "@lifesg/react-design-system/form";
import { Toggle } from "@lifesg/react-design-system/toggle";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { FlexWrapper } from "./switch.styles";
import { ISwitchSchema } from "./types";

export const Switch = (props: IGenericFieldProps<ISwitchSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, disabled, validation, customOptions, ...otherSchema },
		id,
		value,
		error,
		onChange,
	} = props;

	const [stateValue, setStateValue] = useState<boolean>(value || undefined);
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.boolean(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleClick = (value: boolean) => {
		//console.log("click", stateValue, value);
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

	return (
		<Form.CustomField id={id} label={label} errorMessage={error?.message}>
			<FlexWrapper>
				<Toggle
					{...otherSchema}
					key={formatId("yes")}
					type="yes"
					id={formatId("yes")}
					data-testid={TestHelper.generateId(id, "switch-yes")}
					disabled={disabled}
					styleType={customOptions?.border === false ? "no-border" : "default"}
					checked={isSwitchChecked(true)}
					onChange={() => handleClick(true)}
					indicator={true}
					name="Yes"
				>
					Yes
				</Toggle>
				<Toggle
					{...otherSchema}
					key={formatId("no")}
					type="no"
					id={formatId("no")}
					data-testid={TestHelper.generateId(id, "switch-no")}
					disabled={disabled}
					styleType={customOptions?.border === false ? "no-border" : "default"}
					checked={isSwitchChecked(false)}
					onChange={() => handleClick(false)}
					indicator={true}
					name="No"
				>
					No
				</Toggle>
			</FlexWrapper>
		</Form.CustomField>
	);
};
