import { ButtonWithIcon } from "@lifesg/react-design-system/button-with-icon";
import { Divider } from "@lifesg/react-design-system/divider";
import { ErrorDisplay } from "@lifesg/react-design-system/error-display";
import styled from "styled-components";
import { Warning } from "../../shared";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";

// =============================================================================
// STYLE INTERFACE
// =============================================================================
interface InsetStyleProps {
	$inset?: string | number;
}

interface RemoveButtonStyleProps {
	$alignment?: "left" | "right";
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
		margin-bottom: ${Spacing["spacing-32"]};
	}
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: ${Spacing["spacing-16"]};

	${MediaQuery.MaxWidth.sm} {
		flex-direction: column;
	}
`;

export const RemoveButton = styled(ButtonWithIcon.Small)<RemoveButtonStyleProps>`
	${({ $alignment }) => $alignment === "right" && "margin-left: auto;"}
	${({ $alignment }) => $alignment === "left" && "margin-right: auto;"}
	padding-left: ${Spacing["spacing-32"]};
	padding-right: ${Spacing["spacing-32"]};

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const AddButton = styled(ButtonWithIcon.Default)`
	padding-left: ${Spacing["spacing-32"]};
	padding-right: ${Spacing["spacing-32"]};

	&:not(:last-child) {
		margin-bottom: ${Spacing["spacing-32"]};
	}

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const SectionDivider = styled(Divider)`
	margin: ${Spacing["spacing-32"]} 0;
`;

export const WarningAlert = styled(Warning)`
	margin: 0;
`;

export const CustomErrorDisplay = styled(ErrorDisplay)`
	margin-bottom: ${Spacing["spacing-32"]};
`;
