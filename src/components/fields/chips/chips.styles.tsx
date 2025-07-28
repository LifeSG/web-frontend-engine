import { Spacing } from "@lifesg/react-design-system/theme";
import styled, { css } from "styled-components";

export const ChipContainer = styled.div<{ $showTextarea?: boolean | undefined }>`
	display: flex;
	flex-wrap: wrap;
	gap: ${Spacing["spacing-8"]};
	${({ $showTextarea }) =>
		$showTextarea
			? css`
					margin: ${Spacing["spacing-8"]} 0 ${Spacing["spacing-16"]};
			  `
			: css`
					margin: ${Spacing["spacing-8"]} 0;
			  `}
`;
