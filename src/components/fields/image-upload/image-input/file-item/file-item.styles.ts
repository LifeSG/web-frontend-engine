import { Border, Colour, Font, MediaQuery, Radius, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const tokens = {
	thumbnail: {
		backgroundImage: "--fee-internal-fileItem-thumbnail-backgroundImage",
	},
};

export const wrapper = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${Spacing["spacing-8"]};
	border: ${Border["width-010"]} ${Border.solid} ${Colour.border};
	border-radius: ${Radius.sm};
	background-color: ${Colour["bg-primary-subtlest"]};
	min-height: 3.5rem;
	margin-bottom: ${Spacing["spacing-16"]};
	padding: ${Spacing["spacing-16"]} ${Spacing["spacing-32"]};
	${MediaQuery.MaxWidth.lg} {
		padding: ${Spacing["spacing-16"]};
	}
`;

export const wrapperIsError = css`
	border: ${Border["width-010"]} ${Border.solid} ${Colour["border-error"]};
	background-color: ${Colour["bg-error"]};
`;

export const wrapperIsCustomMuted = css`
	flex-wrap: nowrap;
`;

export const cellInfo = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	flex: 1;
`;

export const cellFileSize = css`
	width: 4.24rem;

	${MediaQuery.MaxWidth.lg} {
		display: none;
	}
`;

export const cellProgressBar = css`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;

	${MediaQuery.MaxWidth.sm} {
		width: 100%;
	}
`;

export const cellDeleteButton = css`
	display: flex;
	justify-content: flex-end;
	width: 19.15%;
`;

export const thumbnail = css`
	margin-right: ${Spacing["spacing-32"]};
	width: 6rem;
	height: 6rem;
	${tokens.thumbnail.backgroundImage}: initial;
	background: var(${tokens.thumbnail.backgroundImage}) no-repeat center / cover;
	overflow: hidden;
	border-radius: ${Radius.sm};
	${Font["body-sm-bold"]}

	${MediaQuery.MaxWidth.lg} {
		margin-right: ${Spacing["spacing-16"]};
	}
`;

export const textBody = css`
	flex: 1;
`;

export const fileNameWrapper = css`
	word-break: break-all;
`;

export const mobileTextBodyDetail = css`
	display: none;
	${MediaQuery.MaxWidth.lg} {
		display: block;
	}
`;

export const desktopTextBodyDetail = css`
	display: block;
	${MediaQuery.MaxWidth.lg} {
		display: none;
	}
`;

export const progressBar = css`
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

export const errorText = css`
	color: ${Colour["text-error"]};
	width: 100%;
`;

export const deleteButton = css`
	padding: 0;
	min-width: unset;
	width: 3rem;
	height: 3rem;
	// additional 0.5 negative marginRight because the image itself has padding already
	background-color: transparent;
	outline-style: none;
	color: ${Colour["text-subtler"]};

	svg {
		height: 1.875rem;
		width: 1.875rem;
	}
`;

export const errorCustomMutedThumbnailContainer = css`
	display: flex;
	width: 100%;
`;
