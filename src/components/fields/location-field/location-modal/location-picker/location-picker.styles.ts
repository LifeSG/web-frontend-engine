import { Colour, Font, MediaQuery, Spacing } from "@lifesg/react-design-system/theme";
import { css } from "@linaria/core";

export const locationPickerWrapper = css`
	position: relative;
`;

export const leafletWrapper = css`
	width: 100%;
	height: 100%;

	.leaflet-control-container .leaflet-control {
		&-zoom {
			position: absolute;
			right: 1.5rem;
			bottom: 6rem;
			width: 2.5rem;
			height: 5rem;
			margin: 0;
			border: 0;

			&-in,
			&-out {
				height: 50%;
			}

			&.leaflet-bar {
				border-radius: 1.25rem;
				overflow: hidden;
				box-shadow: 0 0.125rem 0.25rem ${Colour["bg-inverse"]}66;
			}

			&.leaflet-bar a {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 50%;
				color: ${Colour.hyperlink};
				font-weight: ${Font.Spec["weight-bold"]};

				&.leaflet-control-zoom-in {
					border-bottom-color: ${Colour.border};
				}
			}
		}

		&-attribution {
			font-size: 0 !important;

			*:not(.onemap):not(.onemap *) {
				display: none !important;
			}

			.onemap {
				font-size: 0.6875rem;

				img {
					height: 20px;
					width: 20px;
				}
			}
		}
	}
`;

export const buttonLocation = css`
	position: absolute;
	right: 1.5rem;
	bottom: 2.5rem;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2.5rem;
	height: 2.5rem;
	border: 0;
	border-radius: 50%;
	padding: 0;
	background: ${Colour.bg};
	cursor: pointer;
	box-shadow: 0 0 4px rgb(from ${Colour.Primitive["neutral-20"]} r g b / 40%);
`;

export const buttonLegend = css`
	position: absolute;
	bottom: 2.5rem;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2.5rem;
	height: 2.5rem;
	border: 0;
	border-radius: 50%;
	padding: 0;
	background: ${Colour.bg};
	cursor: pointer;
	box-shadow: 0 0 4px rgb(from ${Colour.Primitive["neutral-20"]} r g b / 40%);
	left: ${Spacing["spacing-24"]};
`;

export const buttonLocationImage = css`
	width: 1.5rem;
	height: 1.5rem;

	> svg {
		width: inherit;
		height: inherit;
		color: ${Colour["icon-primary"]};
	}
`;

export const bannerWrapper = css`
	position: absolute;
	z-index: 1000;
	width: 100%;
	padding: ${Spacing["spacing-32"]} ${Spacing["spacing-24"]};

	${MediaQuery.MaxWidth.lg} {
		padding: ${Spacing["spacing-16"]} ${Spacing["spacing-20"]};
	}
`;

export const banner = css`
	padding: ${Spacing["spacing-8"]} ${Spacing["spacing-16"]};
`;
