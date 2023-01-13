import { ReactElement } from "react";

export interface IPromptProps {
	id?: string;
	show: boolean;
	size?: "large";
	title?: string;
	description?: string | ReactElement;
	image?: string | ReactElement;
	buttons?: TPromptButton[];
}

export type TPromptButton = {
	id?: string;
	title: string;
	onClick: () => void;
	buttonStyle?: "secondary" | "light";
};
