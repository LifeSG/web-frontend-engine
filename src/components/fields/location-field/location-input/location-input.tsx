import { Form } from "@lifesg/react-design-system";
import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";
import { TestHelper } from "../../../../utils";
import { DummyLocationField } from "./dummy-location-field";

export interface ILocationInputProps extends FormInputGroupProps<string, string> {
	locationInputPlaceholder?: string | undefined;
	onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const LocationInput = (props: ILocationInputProps) => {
	const {
		id,
		label,
		className,
		locationInputPlaceholder = "",
		onFocus,
		value,
		errorMessage,
		disabled,
		readOnly,
	} = props;

	return (
		<Form.CustomField
			id={TestHelper.generateId(id, "location-input")}
			data-testid={TestHelper.generateId(id, "location-input")}
			label={label}
			errorMessage={errorMessage}
		>
			<DummyLocationField
				disabled={disabled}
				readOnly={readOnly}
				placeholder={locationInputPlaceholder}
				onFocus={onFocus}
				value={value}
				error={!!errorMessage}
				className={className}
			/>
		</Form.CustomField>
	);
};
