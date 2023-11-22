import { Color } from "@lifesg/react-design-system/color";
import { Text, TextStyleHelper } from "@lifesg/react-design-system/text";
import { EyeIcon } from "@lifesg/react-icons/eye";
import { EyeSlashIcon } from "@lifesg/react-icons/eye-slash";
import styled, { css } from "styled-components";

export const AccordionLabel = styled.div`
	${TextStyleHelper.getTextStyle("H5", "semibold")}
	color: ${Color.Neutral[3]};
	margin-bottom: 0.5rem;
`;

export const AccordionValue = styled(Text.Body)`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const EyeBase = css`
	color: ${Color.Primary};
	cursor: pointer;
`;

export const Eye = styled(EyeIcon)`
	${EyeBase}
`;

export const EyeSlash = styled(EyeSlashIcon)`
	${EyeBase}
`;
