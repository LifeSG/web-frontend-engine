import { Color } from "@lifesg/react-design-system/color";
import { IconButton } from "@lifesg/react-design-system/icon-button";
import { MediaQuery } from "@lifesg/react-design-system/media";
import { Text } from "@lifesg/react-design-system/text";
import styled from "styled-components";

export const Wrapper = styled.div<{ isError?: boolean }>`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
	border: ${(props) =>
		props.isError ? `1px solid ${Color.Validation.Red.Border(props)}` : `1px solid ${Color.Neutral[5](props)}`};
	border-radius: 4px;
	background-color: ${(props) => (props.isError ? "rgb(253, 247, 247)" : `${Color.Accent.Light[6](props)}`)};
	min-height: 3.5rem;
	margin-bottom: 1rem;
	padding: 1rem 2rem;
	${MediaQuery.MaxWidth.tablet} {
		padding: 1rem;
	}
`;

export const CellInfo = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	flex: 1;
`;

export const CellFileSize = styled.div`
	width: 4.24rem;

	${MediaQuery.MaxWidth.tablet} {
		display: none;
	}
`;

export const CellProgressBar = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;

	${MediaQuery.MaxWidth.mobileL} {
		width: 100%;
	}
`;

export const CellDeleteButton = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;
`;

export const Thumbnail = styled.div<{ src: string }>`
	margin-right: 2rem;
	width: 6rem;
	height: 6rem;
	background: url(${(props) => props.src}) no-repeat center / cover;
	overflow: hidden;
	border-radius: 0.25rem;

	${MediaQuery.MaxWidth.tablet} {
		margin-right: 1rem;
	}
`;

export const TextBody = styled(Text.Body)`
	flex: 1;
`;

export const MobileFileSize = styled.div`
	display: none;
	${MediaQuery.MaxWidth.tablet} {
		display: block;
	}
`;

export const ProgressBar = styled.progress`
	max-width: 96px;
	flex: 1;
	height: 0.63rem;

	${MediaQuery.MaxWidth.tablet} {
		max-width: none;
	}

	&[value] {
		width: 100%;

		-webkit-appearance: none;
		appearance: none;
	}

	&[value]::-webkit-progress-bar {
		height: 100%;
		border-radius: 1.25rem;
		background-color: #eee;
	}

	&[value]::-webkit-progress-value {
		height: 100%;
		border-radius: 1.25rem;
		background-color: ${Color.Accent.Light[1]};
	}
`;

export const ErrorText = styled(Text.H6)`
	color: ${Color.Validation.Red.Text};
	width: 100%;
`;

export const DeleteButton = styled(IconButton)`
	padding: 0;
	// additional 0.5 negative marginRight because the image itself has padding already
	background-color: transparent;
	outline-style: none;

	span {
		font-size: 2rem;
		color: ${Color.Neutral[3]};
	}
`;
