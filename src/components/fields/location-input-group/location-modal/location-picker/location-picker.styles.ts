import { Card } from "@lifesg/react-design-system/card";
import { Color } from "@lifesg/react-design-system/color";
import { MediaQuery } from "@lifesg/react-design-system/media";
import styled from "styled-components";

export const LocationPickerWrapper = styled.div`
	position: relative;
`;

export const BannerWrapper = styled.div`
	position: absolute;
	z-index: 1000;
	width: 100%;
	padding: 2rem 1.5rem;

	${MediaQuery.MaxWidth.tablet} {
		padding: 1rem 1.25rem;
	}
`;

export const Banner = styled(Card)`
	padding: 0.5rem 1rem;
`;

export const LeafletWrapper = styled.div`
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
				box-shadow: 0 0.125rem 0.25rem ${Color.Neutral[1]}66;
			}

			&.leaflet-bar a {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 50%;
				color: ${Color.Primary};
				font-weight: bold;

				&.leaflet-control-zoom-in {
					border-bottom-color: ${Color.Neutral[5]};
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
			}
		}
	}
`;

export const ButtonLocation = styled.button`
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
	background: ${Color.Neutral[8]};
	cursor: pointer;
	box-shadow: 0 0.125rem 0.25rem ${Color.Neutral[1]}66;
`;

export const ButtonLocationImage = styled.img`
	width: 1.5rem;
	height: 1.5rem;
`;
