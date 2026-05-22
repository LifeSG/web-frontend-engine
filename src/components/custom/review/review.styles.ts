import { MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import styled from "styled-components";

export const CustomUneditableSection = styled(UneditableSection)`
	padding: ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.sm} {
		padding: ${Spacing["spacing-20"]};
	}
`;

interface IBoxUneditableSectionProps {
	$rowGap?: string | undefined;
}

export const BoxUneditableSection = styled(UneditableSection)<IBoxUneditableSectionProps>`
	${({ $rowGap }) =>
		$rowGap &&
		`ul {
			row-gap: ${$rowGap};
		}`}
`;
