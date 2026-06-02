import React from "react";
import { css } from "@linaria/core";

const card = css`
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background: #f9f9f9;
`;

export interface ExampleCardProps {
	title?: string;
	description?: string;
	buttonText?: string;
	onButtonClick?: () => void;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
	title = "Example Card",
	description = "This is a simple example card component.",
	buttonText = "Click Me",
	onButtonClick,
}) => {
	return (
		<div className={card}>
			<h2>{title}</h2>
			<p>{description}</p>
			<button onClick={onButtonClick}>{buttonText}</button>
		</div>
	);
};
