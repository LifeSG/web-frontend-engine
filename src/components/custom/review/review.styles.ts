import { Color } from "@lifesg/react-design-system/color";
import { Layout } from "@lifesg/react-design-system/layout";
import { TextStyleHelper } from "@lifesg/react-design-system/text";
import styled from "styled-components";

export const AccordionLayout = styled(Layout.Container)`
	padding: 2rem;
	row-gap: 2rem;
`;

export const AccordionLabel = styled.div`
	${TextStyleHelper.getTextStyle("H5", "semibold")}
	color: ${Color.Neutral[3]};
	margin-bottom: 0.5rem;
`;
