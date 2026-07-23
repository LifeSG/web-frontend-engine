import { Button } from "@lifesg/react-design-system/button";
import { Divider } from "@lifesg/react-design-system/divider";
import { ErrorDisplay } from "@lifesg/react-design-system/error-display";
import styled from "styled-components";
import { Warning } from "../../shared";
import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";

export const tokens = {
	horizontalInset: "--fee-internal-arrayField-horizontalInset",
};

// =============================================================================
// STYLING
// =============================================================================
export const Wrapper = styled.div`
	${tokens.horizontalInset}: initial;
`;

export const Inset = styled.div`
	padding-left: var(${tokens.horizontalInset});
	padding-right: var(${tokens.horizontalInset});

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

export const RemoveButton = styled(Button)`
	padding-left: ${Spacing["spacing-32"]};
	padding-right: ${Spacing["spacing-32"]};

	&.removeButtonAlignRight {
		margin-left: auto;
	}

	&.removeButtonAlignLeft {
		margin-right: auto;
	}

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const AddButton = styled(Button)`
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
