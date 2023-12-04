import { Button } from "@lifesg/react-design-system/button";
import * as Icons from "@lifesg/react-icons";
import styled from "styled-components";
import { IGenericFieldProps } from "..";
import { IButtonSchema } from "./types";
import { useFieldEvent } from "../../../utils/hooks";

export const ButtonField = (props: IGenericFieldProps<IButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: {
			label,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			uiType,
			startIcon,
			endIcon,
			...otherSchema
		},
		id,
		...otherProps
	} = props;
	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = (icon?: IButtonSchema["startIcon"] | IButtonSchema["endIcon"] | undefined) => {
		if (!icon) return null;
		const Element = Icons[icon];

		return <Element />;
	};

	return (
		<CustomButton
			type="button"
			{...otherSchema}
			{...otherProps}
			onClick={(e) => dispatchFieldEvent("click", id, e)}
		>
			{renderIcon(startIcon)}
			{label}
			{renderIcon(endIcon)}
		</CustomButton>
	);
};

const CustomButton = styled(Button.Default)`
	> span {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
`;
