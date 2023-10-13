import { LocalTime } from "@js-joda/core";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { DateTimeHelper, TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ITimeFieldSchema } from "./types";

export const TimeField = (props: IGenericFieldProps<ITimeFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		schema: { label, validation, placeholder, is24HourFormat, useCurrentTime, ...otherSchema },
		id,
		value,
		error,
		onChange,
		...otherProps
	} = props;

	const [stateValue, setStateValue] = useState<string>(value || "");
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		if (useCurrentTime && !value) {
			const timeFormatPattern = is24HourFormat ? "H:mm" : "h:mma";
			setTimeout(() => handleCurrentTime(timeFormatPattern));
		} else {
			setStateValue(value);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, useCurrentTime, is24HourFormat]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (value: string): void => {
		onChange({ target: { value } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleCurrentTime = (format: string): void => {
		const currentTime = DateTimeHelper.formatDateTime(LocalTime.now().toString().toUpperCase(), format, "time");

		setStateValue(currentTime);
		onChange({ target: { value: currentTime } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.Timepicker
			{...otherSchema}
			{...otherProps}
			id={id}
			data-testid={TestHelper.generateId(id, "time")}
			label={label}
			errorMessage={error?.message}
			value={stateValue}
			placeholder={placeholder}
			format={is24HourFormat ? "24hr" : "12hr"}
			onChange={handleChange}
		/>
	);
};
