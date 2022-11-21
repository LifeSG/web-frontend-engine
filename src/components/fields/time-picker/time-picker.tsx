import { LocalTime } from "@js-joda/core";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DateTimeHelper } from "../../../utils";
import { useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ITimePickerSchema } from "./types";

export const TimePicker = (props: IGenericFieldProps<ITimePickerSchema>) => {
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
	const { setFieldValidationConfig } = useValidationSchema();

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
			handleCurrentTime(timeFormatPattern);
		} else {
			setStateValue(formatLocalState(value));
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
		const currentTime = DateTimeHelper.formatDateTime(LocalTime.now().toString(), format, "time");

		setStateValue(formatLocalState(currentTime));
		onChange({ target: { value: currentTime } });
	};

	const formatLocalState = (value: string): string => {
		if (!value) return "";

		if (!is24HourFormat) return value;

		return value.substring(0, value.length - 2);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.Timepicker
			{...otherSchema}
			{...otherProps}
			id={id}
			label={label}
			errorMessage={error?.message}
			value={stateValue}
			placeholder={placeholder}
			format={is24HourFormat ? "24hr" : "12hr"}
			onChange={handleChange}
		/>
	);
};
