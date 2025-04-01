import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { IconButton } from "@lifesg/react-design-system/icon-button";
import { V2_MediaQuery } from "@lifesg/react-design-system/v2_media";
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import styled from "styled-components";

export const Wrapper = styled.div<{ isError?: boolean; isCustomMuted?: boolean }>`
	display: flex;
	flex-wrap: ${(props) => (props.isCustomMuted ? "nowrap" : "wrap")};
	align-items: center;
	gap: 0.5rem;
	border: ${(props) =>
		props.isError
			? `1px solid ${V2_Color.Validation.Red.Border(props)}`
			: `1px solid ${V2_Color.Neutral[5](props)}`};
	border-radius: 4px;
	background-color: ${(props) => (props.isError ? "rgb(253, 247, 247)" : `${V2_Color.Accent.Light[6](props)}`)};
	min-height: 3.5rem;
	margin-bottom: 1rem;
	padding: 1rem 2rem;
	${V2_MediaQuery.MaxWidth.tablet} {
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

	${V2_MediaQuery.MaxWidth.tablet} {
		display: none;
	}
`;

export const CellProgressBar = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;

	${V2_MediaQuery.MaxWidth.mobileL} {
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

	${V2_MediaQuery.MaxWidth.tablet} {
		margin-right: 1rem;
	}
`;

export const TextBody = styled(V2_Text.Body)`
	flex: 1;
`;

export const FileNameWrapper = styled.div`
	word-break: break-all;
`;

export const MobileTextBodyDetail = styled.div`
	display: none;
	${V2_MediaQuery.MaxWidth.tablet} {
		display: block;
	}
`;

export const DesktopTextBodyDetail = styled.div`
	display: block;
	${V2_MediaQuery.MaxWidth.tablet} {
		display: none;
	}
`;

export const ProgressBar = styled.progress`
	max-width: 96px;
	flex: 1;
	height: 0.63rem;

	${V2_MediaQuery.MaxWidth.tablet} {
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
		background-color: ${V2_Color.Accent.Light[1]};
	}
`;

export const ErrorText = styled(V2_Text.H6)`
	color: ${V2_Color.Validation.Red.Text};
	width: 100%;
`;

export const DeleteButton = styled(IconButton)`
	padding: 0;
	// additional 0.5 negative marginRight because the image itself has padding already
	background-color: transparent;
	outline-style: none;
	color: ${V2_Color.Neutral[3]};

	svg {
		height: 1.875rem;
		width: 1.875rem;
	}
`;

export const ErrorCustomMutedThumbnailContainer = styled.div`
	display: flex;
`;
