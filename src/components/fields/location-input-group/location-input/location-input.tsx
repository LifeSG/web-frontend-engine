import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { Form } from "@lifesg/react-design-system";
import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";

export interface ILocationInputProps extends FormInputGroupProps<string, string> {
	locationInputPlaceholder?: string | undefined;
	onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const LocationInput = (props: ILocationInputProps) => {
	const { id, label, locationInputPlaceholder = "", onFocus, value } = props;

	return (
		<Form.InputGroup
			id={id}
			label={label}
			addon={{
				type: "custom",
				attributes: {
					children: <PinFillIcon />,
				},
				position: "right",
			}}
			onFocus={(e) => onFocus(e)}
			placeholder={locationInputPlaceholder}
			value={value}
		/>
	);
};
