import { DateTimeFormatter, LocalTime, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DateHelper, TestHelper } from "../../../utils";
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
		const timeFormatPattern = is24HourFormat ? "H:mm" : "h:mma";
		const timeFormatter = DateTimeFormatter.ofPattern(timeFormatPattern)
			.withResolverStyle(ResolverStyle.STRICT)
			.withLocale(Locale.ENGLISH);

		if (useCurrentTime && !value) {
			handleCurrentTime(timeFormatter);
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

	const handleCurrentTime = (format: DateTimeFormatter): void => {
		const currentTime = DateHelper.formatDateTime(LocalTime.now().toString(), format);

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
			aria-label={id}
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
