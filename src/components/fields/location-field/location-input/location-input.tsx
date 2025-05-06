import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { Form } from "@lifesg/react-design-system/form";
import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";
import { TestHelper } from "../../../../utils";

export interface ILocationInputProps extends FormInputGroupProps<string, string> {
	locationInputPlaceholder?: string | undefined;
	onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const LocationInput = (props: ILocationInputProps) => {
	const {
		className,
		id,
		label,
		locationInputPlaceholder = "",
		onFocus,
		value,
		errorMessage,
		disabled,
		readOnly,
	} = props;

	return (
		<Form.InputGroup
			id={TestHelper.generateId(id, "location-input")}
			data-testid={TestHelper.generateId(id, "location-input")}
			className={`${className}-location-input`}
			role="button"
			label={label}
			addon={{
				type: "custom",
				attributes: {
					children: <PinFillIcon />,
				},
				position: "right",
			}}
			disabled={disabled}
			readOnly={readOnly}
			onFocus={onFocus}
			placeholder={locationInputPlaceholder}
			value={value}
			errorMessage={errorMessage}
		/>
	);
};
