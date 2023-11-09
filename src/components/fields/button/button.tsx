import { Button } from "@lifesg/react-design-system/button";
import * as Icons from "@lifesg/react-icons";
import styled from "styled-components";
import { IGenericFieldProps } from "..";
import { IButtonSchema } from "./types";
import { useFieldEvent } from "../../../utils/hooks";

const ButtonCutoms = styled(Button.Default)`
	span:first-child {
		display: flex;
		align-items: center;
		gap: 8px;
	}
`;

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
			return <Element />;
		}
		return null;
	};

	const renderEndIcon = () => {
		if (endIcon) {
			const Element = Icons[endIcon];
			return <Element />;
		}
		return null;
	};
	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<ButtonCutoms
			type="button"
			{...otherSchema}
			{...otherProps}
			data-testid={id}
			onClick={(e) => {
				dispatchFieldEvent("onclick", id, e);
			}}
		>
			{renderStartIcon()}
			{label}
			{renderEndIcon()}
		</ButtonCutoms>
	);
};
