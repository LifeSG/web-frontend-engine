import { ForwardedRef } from "react";

export interface IImageEditorProps {
	maxSizeInB?: number;
	baseImageDataURL?: string;
	drawing?: fabric.Object[];
	color?: string;
	erase?: boolean;
	clear?: boolean;
	forwardedRef?: ForwardedRef<IImageEditorRef>;
}
export interface IImageEditorRef {
	export: () => {
		drawing: fabric.Object[];
		dataURL: string;
	};
}
