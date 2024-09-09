import { Alert } from "@lifesg/react-design-system/alert";
import { ButtonWithIcon } from "@lifesg/react-design-system/button-with-icon";
import { Divider } from "@lifesg/react-design-system/divider";
import { ErrorDisplay } from "@lifesg/react-design-system/error-display";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";

export const Section = styled.div`
	display: flex;
	flex-direction: column;

	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const SectionHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 1rem;
`;

export const SectionHeaderTitle = styled(Text.Body)`
	margin-right: auto;
`;

export const RemoveButton = styled(ButtonWithIcon.Default)`
	padding: 0;
	height: unset;
`;

export const AddButton = styled(ButtonWithIcon.Default)`
	padding: 0;
	height: unset;

	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const SectionDivider = styled(Divider)`
	margin-top: 2rem;
`;

export const ErrorAlert = styled(Alert)`
	&:not(:last-child) {
		margin-bottom: 2rem;
	}
`;

export const CustomErrorDisplay = styled(ErrorDisplay)`
	margin-bottom: 2rem;
`;
