import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { Form } from "@lifesg/react-design-system";
import { FormInputGroupProps } from "@lifesg/react-design-system/form/types";
import { forwardRef } from "react";

interface ILocationInputProps extends FormInputGroupProps<string, string> {
	locationInputPlaceholder;
	onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const LocationInput = forwardRef<HTMLInputElement, ILocationInputProps>((props: ILocationInputProps, ref) => {
	const { id, label, locationInputPlaceholder, onFocus, value } = props;

	return (
		<Form.InputGroup
			id={id}
			ref={ref}
			label={label}
			addon={{
				type: "custom",
				attributes: {
					children: <PinFillIcon />,
				},
				position: "right",
			}}
			onFocus={(e) => onFocus(e)}
			placeholder={locationInputPlaceholder || ""}
			value={value}
		/>
	);
});
