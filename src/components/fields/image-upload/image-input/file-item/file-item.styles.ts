import { IconButton } from "@lifesg/react-design-system/icon-button";
import { Typography } from "@lifesg/react-design-system/typography";
import styled, { css } from "styled-components";
import { Border, Colour, Font, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";

export const Wrapper = styled.div<{ isError?: boolean; isCustomMuted?: boolean }>`
	display: flex;
	flex-wrap: ${(props) => (props.isCustomMuted ? "nowrap" : "wrap")};
	align-items: center;
	gap: ${Spacing["spacing-8"]};
	border: ${(props) =>
		props.isError
			? css`
					${Border["width-010"]} ${Border.solid} ${Colour["border-error"]}
			  `
			: css`
					${Border["width-010"]} ${Border.solid} ${Colour.border}
			  `};
	border-radius: ${Radius.sm};
	border-radius: ${Radius.sm};
	background-color: ${(props) =>
		props.isError ? `${Colour["bg-error"](props)}` : `${Colour["bg-primary-subtlest"](props)}`};
	min-height: 3.5rem;
	margin-bottom: ${Spacing["spacing-16"]};
	padding: ${Spacing["spacing-16"]} ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.lg} {
		padding: ${Spacing["spacing-16"]};
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

	${MediaQuery.MaxWidth.lg} {
		display: none;
	}
`;

export const CellProgressBar = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const CellDeleteButton = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;
`;

export const Thumbnail = styled.div<{ src: string }>`
	margin-right: ${Spacing["spacing-32"]};
	width: 6rem;
	height: 6rem;
	background: url(${(props) => props.src}) no-repeat center / cover;
	overflow: hidden;
	border-radius: ${Radius.sm};
	${Font["body-sm-bold"]}

	${MediaQuery.MaxWidth.lg} {
		margin-right: ${Spacing["spacing-16"]};
	}
`;

export const TextBody = styled(Typography.BodyBL)`
	flex: 1;
`;

export const FileNameWrapper = styled.div`
	word-break: break-all;
`;

export const MobileTextBodyDetail = styled.div`
	display: none;
	${MediaQuery.MaxWidth.lg} {
		display: block;
	}
`;

export const DesktopTextBodyDetail = styled.div`
	display: block;
	${MediaQuery.MaxWidth.lg} {
		display: none;
	}
`;

export const ProgressBar = styled.progress`
	max-width: 96px;
	flex: 1;
	height: 0.63rem;

	${MediaQuery.MaxWidth.lg} {
		max-width: none;
	}

	&[value] {
		width: 100%;

		-webkit-appearance: none;
		appearance: none;
	}

	&[value]::-webkit-progress-bar {
		height: 100%;
		border-radius: ${Radius.full};
		background-color: #eee;
	}

	&[value]::-webkit-progress-value {
		height: 100%;
		border-radius: ${Radius.full};
		background-color: ${Colour["bg-primary-subtle"]};
	}
`;

export const ErrorText = styled(Typography.BodySM)`
	color: ${Colour["text-error"]};
	width: 100%;
`;

export const DeleteButton = styled(IconButton)`
	padding: 0;
	// additional 0.5 negative marginRight because the image itself has padding already
	background-color: transparent;
	outline-style: none;
	color: ${Colour["text-subtler"]};

	svg {
		height: 1.875rem;
		width: 1.875rem;
	}
`;

export const ErrorCustomMutedThumbnailContainer = styled.div`
	display: flex;
`;
