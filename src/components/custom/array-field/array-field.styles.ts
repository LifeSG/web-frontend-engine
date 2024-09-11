import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { ButtonWithIcon } from "@lifesg/react-design-system/button-with-icon";
import { Divider } from "@lifesg/react-design-system/divider";
import { ErrorDisplay } from "@lifesg/react-design-system/error-display";
import { MediaQuery } from "@lifesg/react-design-system/media";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";
import { Warning } from "../../shared";

// =============================================================================
// STYLE INTERFACE
// =============================================================================
interface InsetStyleProps {
	$inset?: string | number;
}

// =============================================================================
// STYLING
// =============================================================================
export const Inset = styled.div<InsetStyleProps>`
	${({ $inset }) =>
		$inset &&
		`
	padding-left: ${$inset};
	padding-right: ${$inset};
	`}

	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const Section = styled.div`
	display: flex;
	flex-direction: column;
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;

	${MediaQuery.MaxWidth.mobileL} {
		flex-direction: column;
	}
`;

export const SectionHeaderTitle = styled(Text.Body)`
	margin-right: auto;
`;

export const RemoveButton = styled(Button.Small)`
	padding-left: 2rem;
	padding-right: 2rem;

	${MediaQuery.MaxWidth.mobileL} {
		width: 100%;
	}
`;

export const RemoveButtonWithIcon = styled(ButtonWithIcon.Small)`
	padding-left: 2rem;
	padding-right: 2rem;

	${MediaQuery.MaxWidth.mobileL} {
		width: 100%;
	}
`;

export const AddButton = styled(ButtonWithIcon.Default)`
	padding-left: 2rem;
	padding-right: 2rem;

	&:not(:last-child) {
		margin-bottom: 2rem;
	}

	${MediaQuery.MaxWidth.mobileL} {
		width: 100%;
	}
`;

export const SectionDivider = styled(Divider)`
	margin: 2rem 0;
`;

export const WarningAlert = styled(Warning)`
	margin: 0;
`;

export const CustomErrorDisplay = styled(ErrorDisplay)`
	margin-bottom: 2rem;
`;
