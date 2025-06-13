import { FabricObject } from "fabric";
import { ForwardedRef } from "react";

export interface IImageEditorProps {
	maxSizeInKb?: number;
	baseImageDataURL?: string;
	drawing?: FabricObject[];
	color?: string;
	erase?: boolean;
	forwardedRef?: ForwardedRef<IImageEditorRef>;
}
export interface IImageEditorRef {
	clearDrawing: VoidFunction;
	export: () => {
		drawing: FabricObject[];
		dataURL: string;
	};
}
