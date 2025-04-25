import { Spacing } from "@lifesg/react-design-system/theme";
import styled from "styled-components";

export const ChipContainer = styled.div<{ $showTextarea?: boolean | undefined }>`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-32"]};
	margin: ${({ $showTextarea }) =>
		$showTextarea ? `${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]}` : `${Spacing["spacing-8"]} 0`};
`;
