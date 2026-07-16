import { css } from "@linaria/core";
import { BAR_HEIGHT, BAR_WIDTH, HEIGHT, TOTAL_BARS, WIDTH } from "./config";

export const spinner = css`
	display: inline-block;
	position: relative;
	width: ${WIDTH / 16}rem;
	height: ${HEIGHT / 16}rem;
`;

export const spinnerBar = css`
	transform-origin: ${WIDTH / 16 / 2}rem ${HEIGHT / 16 / 2}rem;

	&::after {
		content: " ";
		display: block;
		position: absolute;
		top: 0.125rem;
		left: ${(WIDTH - BAR_WIDTH) / 16 / 2}rem;
		width: ${BAR_WIDTH / 16}rem;
		height: ${BAR_HEIGHT / 16}rem;
		border-radius: ${BAR_WIDTH / 2 / 16}rem;
		animation: spinnerAnimation ${TOTAL_BARS / 10}s linear infinite;
	}

	@keyframes location-field-spinner-animation {
		0% {
			background-color: #8e8e93;
		}
		100% {
			background-color: #eee;
		}
	}

	${Array(TOTAL_BARS)
		.fill("")
		.map((foo, i) => {
			return `
				&:nth-child(${i + 1}) {
					transform: rotate(${(i * 360) / TOTAL_BARS}deg);
				}

				&:nth-child(${i + 1})::after {
					animation-delay: -${(TOTAL_BARS - i) / 10}s;
				}
			`;
		})
		.join("")}
`;
