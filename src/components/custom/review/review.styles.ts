import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import styled from "styled-components";

interface IBoxUneditableSectionProps {
	$itemGap?: string | undefined;
}

export const BoxUneditableSection = styled(UneditableSection)<IBoxUneditableSectionProps>`
	${({ $itemGap }) =>
		$itemGap &&
		`ul {
			row-gap: ${$itemGap};
		}`}
`;
