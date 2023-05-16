import { ReactElement } from "react";

export interface PromptProps {
	id?: string;
	show: boolean;
	size?: "large";
	title?: string;
	description?: string | ReactElement;
	image?: string | ReactElement;
	buttons?: PromptButton[];
}

export type PromptButton = {
	id?: string;
	title: string;
	onClick: () => void;
	buttonStyle?: "secondary" | "light";
};
