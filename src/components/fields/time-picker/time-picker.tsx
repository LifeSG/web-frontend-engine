import { DateTimeFormatter, LocalTime, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DateHelper } from "../../../utils";
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
		const timeFormatPattern = is24HourFormat ? "H:mm" : "h:mma";
		const newTimeFormatter = DateTimeFormatter.ofPattern(timeFormatPattern)
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);

		useCurrentTime && handleCurrentTime(newTimeFormatter);
		is24HourFormat && handleTimeFormat(newTimeFormatter);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCurrentTime, is24HourFormat]);

	useEffect(() => {
		setFieldValidationConfig(id, Yup.string(), validation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		console.log(value);
		setStateValue(formatLocalState(value));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (value: string): void => {
		onChange({ target: { value } });
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleCurrentTime = (format: DateTimeFormatter): void => {
		const currentTime = DateHelper.formatTime(LocalTime.now().toString(), format);

		onChange({ target: { value: currentTime } });
	};

	const handleTimeFormat = (format: DateTimeFormatter): void => {
		if (stateValue) {
			onChange({ target: { value: DateHelper.formatTime(stateValue, format) } });
		}
	};

	const formatLocalState = (value: string): string => {
		if (!value) return "";

		if (is24HourFormat) return value;

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
