import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import styled from "styled-components";

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
