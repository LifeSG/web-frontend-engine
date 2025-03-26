import { ButtonWithIcon } from "@lifesg/react-design-system/button-with-icon";
import { Divider } from "@lifesg/react-design-system/divider";
import { ErrorDisplay } from "@lifesg/react-design-system/error-display";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
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

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;

	${V2_MediaQuery.MaxWidth.mobileL} {
		flex-direction: column;
	}
`;

export const RemoveButton = styled(ButtonWithIcon.Small)`
	padding-left: 2rem;
	padding-right: 2rem;

	${V2_MediaQuery.MaxWidth.mobileL} {
		width: 100%;
	}
`;

export const AddButton = styled(ButtonWithIcon.Default)`
	padding-left: 2rem;
	padding-right: 2rem;

	&:not(:last-child) {
		margin-bottom: 2rem;
	}

	${V2_MediaQuery.MaxWidth.mobileL} {
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
