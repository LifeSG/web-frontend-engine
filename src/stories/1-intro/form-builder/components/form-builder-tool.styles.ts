import styled, { css } from "styled-components";
import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { Textarea } from "@lifesg/react-design-system/input-textarea";
import { FrontendEngine } from "../../../common";
import { Colour } from "@lifesg/react-design-system";

// =============================================================================
// STYLE INTERFACE
// =============================================================================
interface IContentWrapperProps {
	$hidden?: boolean | undefined;
	$flexbox?: boolean | undefined;
}

export interface IModeButtonProps {
	$active: boolean | undefined;
}

// =============================================================================
// STYLING
// =============================================================================
export const Wrapper = styled.div`
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const ContentWrapper = styled.div<IContentWrapperProps>`
	display: ${({ $hidden, $flexbox }) => {
		if ($hidden) return "none";
		if ($flexbox) return "flex";
		return "block";
	}};

	${({ $flexbox }) =>
		$flexbox &&
		css`
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 2rem;
			padding: 2rem;
		`};

	width: 100%;
	flex: 1;
	overflow-y: auto;
`;

export const Toolbar = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	height: 5rem;
	justify-content: flex-end;
	z-index: 1;
	gap: 2rem;
	padding: 1rem;
	background-color: ${Colour["bg-primary-subtlest"]};
	box-sizing: border-box;
`;

export const ModeButton = styled.button<IModeButtonProps>`
	background: ${({ $active }) => ($active ? Colour["bg-primary-subtlest-selected"] : "transparent")};
	color: ${Colour["icon-primary"]};
	display: grid;
	cursor: pointer;
	border: none;
	border-radius: 0.25rem;
	padding: 1rem;
	align-self: center;

	:hover {
		background: ${Colour["bg-selected-hover"]};
	}

	:focus {
		outline-color: ${Colour["border-focus"]};
	}

	svg {
		width: 1.625rem;
		height: 1.625rem;
	}
`;

export const FrontendEnginePreview = styled(FrontendEngine)`
	width: 100%;
	margin-bottom: 2rem;
`;

export const SchemaEditorWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;

	> div {
		flex: 1;
	}
`;

export const SchemaEditor = styled(Textarea)`
	flex: 1;
	width: 100%;
	overflow: auto;
	padding: 1rem;
	border: 1px solid ${Colour.border};
	border-radius: 4px;
`;

export const SaveButton = styled(Button.Default)`
	width: 10rem;
	margin-left: auto;
`;

export const ActionWrapper = styled.div`
	display: flex;
	width: 100%;
	gap: 2rem;
`;

export const AlertWrapper = styled(Alert)`
	flex-grow: 1;
`;

export const RefreshButton = styled(Button.Small)`
	display: inline;
	padding: 0;
`;
