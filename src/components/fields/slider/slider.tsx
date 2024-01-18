import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ISliderSchema } from "./types";
import { InputSliderProps } from "@lifesg/react-design-system/input-slider";
import { ERROR_MESSAGES } from "../../shared";

export const Slider = (props: IGenericFieldProps<ISliderSchema>) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		// picking specific props to avoid passing non-standard HTML attributes props to the underlying component
		schema: { label: _label, customOptions, validation, disabled, readOnly, className, ariaLabel },
		value,
	} = props;

	const [derivedProps, setDerivedProps] = useState<Pick<InputSliderProps, "min" | "max" | "step">>();
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const minRule = validation?.find((rule) => "min" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		const incrementRule = validation?.find((rule) => "increment" in rule);
		setFieldValidationConfig(
			id,
			Yup.number().test(
				"is-incremental",
				incrementRule?.["errorMessage"] || ERROR_MESSAGES.SLIDER.MUST_BE_INCREMENTAL,
				(value) => {
					if (typeof value !== "number" || !incrementRule) return true;
					const step = incrementRule["increment"];
					const min = minRule?.["min"] ?? 0;
					const diff = min - value;
					return Number.isInteger(diff / step);
				}
			),
			validation
		);

		if (minRule || maxRule || incrementRule) {
			setDerivedProps({
				min: minRule?.["min"],
				max: maxRule?.["max"],
				step: incrementRule?.["increment"],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChangeEnd = (value: number): void => {
		onChange({ target: { value } });
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Form.Slider
			{...customOptions}
			{...derivedProps}
			id={id}
			data-testid={TestHelper.generateId(id, "slider")}
			label={formattedLabel}
			errorMessage={error?.message}
			onChangeEnd={handleChangeEnd}
			value={value}
			disabled={disabled}
			readOnly={readOnly}
			className={className}
			ariaLabel={ariaLabel}
		/>
	);
};
