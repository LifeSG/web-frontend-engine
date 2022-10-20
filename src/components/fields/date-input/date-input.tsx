import { DateTimeFormatter, LocalDate, ResolverStyle } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useValidationSchema } from "src/utils/hooks";
import * as Yup from "yup";
import { IGenericFieldProps } from "../../frontend-engine/types";
import { IDateInputSchema } from "./types";

const INVALID_DATE = "Invalid date";
export const DateInput = (props: IGenericFieldProps<IDateInputSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: { label, useCurrentDate, dateFormat = "uuuu-MM-dd", validation, ...otherSchema },
		id,
		onChange,
		value,
		error,
		...otherProps
	} = props;
	const [dateFormatter, setDateFormatter] = useState<DateTimeFormatter>();
	const [stateValue, setStateValue] = useState<string>(value || ""); // adheres to dateFormat
	const { setValue } = useFormContext();
	const { setFieldValidationConfig } = useValidationSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.string().test("is-date", "Invalid date", (value) => {
				if (!value || value === "") return true;
				const date = new Date(value);
				return !isNaN(date.valueOf());
			}),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setDateFormatter(
			DateTimeFormatter.ofPattern(dateFormat).withResolverStyle(ResolverStyle.STRICT).withLocale(Locale.ENGLISH)
		);
	}, [dateFormat]);

	/**
	 * update local state according to various scenarios
	 * - prepopulate with current date if useCurrentDate=true and no value provided (value can be set via defaultValues)
	 * - if value is provided, store it in the intended format
	 * - otherwise if value cannot be parsed, clear both local state and registered value
	 */
	useEffect(() => {
		if (!dateFormatter) return;
		if (useCurrentDate && !value) {
			setStateValue(formatValue(LocalDate.now().toString()));
		} else if (value === INVALID_DATE) {
			setStateValue(INVALID_DATE);
		} else {
			let formattedDate = "";
			try {
				formattedDate = formatValue(LocalDate.parse(value, dateFormatter).toString());
			} catch (error) {}
			if (formattedDate && formattedDate !== value) setStateValue(formattedDate);
			else if (!formattedDate) {
				setStateValue("");
				setValue(id, undefined);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [useCurrentDate, value, dateFormatter]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = ([day, month, year]: string[]) => {
		if (!day && !month && !year) {
			onChange({
				target: { value: undefined },
			});
		} else if (!day.length || !month.length || year.length !== 4) {
			onChange({
				target: { value: INVALID_DATE },
			});
		} else {
			onChange({
				target: { value: formatValue([year, month, day].join("-")) },
			});
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	// accepts in uuuu-MM-dd
	const formatValue = (value: string) => {
		let formattedDate: string;
		try {
			formattedDate = LocalDate.parse(value).format(dateFormatter);
		} catch (error) {}

		return formattedDate;
	};
	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================

	return (
		<Form.DateInput
			{...otherSchema}
			{...otherProps}
			label={label}
			errorMessage={error?.message}
			onChangeRaw={handleChange}
			value={stateValue}
		/>
	);
};
