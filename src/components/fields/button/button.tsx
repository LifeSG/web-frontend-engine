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
		schema: { label, uiType, startIcon, endIcon, ...otherSchema },
		id,
		...otherProps
	} = props;
	const { dispatchFieldEvent } = useFieldEvent();
	const renderStartIcon = () => {
		if (startIcon) {
			const Element = Icons[startIcon];
			return <Element className="start-icon" />;
		}
		return null;
	};

	const renderEndIcon = () => {
		if (endIcon) {
			const Element = Icons[endIcon];
			return <Element className="end-icon" />;
		}
		return null;
	};
	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<CustomButton
			type="button"
			{...otherSchema}
			{...otherProps}
			data-testid={id}
			onClick={(e) => {
				dispatchFieldEvent("click", id, e);
			}}
		>
			{renderStartIcon()}
			{label}
			{renderEndIcon()}
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
