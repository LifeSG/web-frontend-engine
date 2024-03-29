import { ForwardedRef } from "react";

export interface IImageEditorProps {
	maxSizeInKb?: number;
	baseImageDataURL?: string;
	drawing?: fabric.Object[];
	color?: string;
	erase?: boolean;
	forwardedRef?: ForwardedRef<IImageEditorRef>;
}
export interface IImageEditorRef {
	clearDrawing: VoidFunction;
	export: () => {
		drawing: fabric.Object[];
		dataURL: string;
	};
}
