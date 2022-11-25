export interface IDragUploadRef {
	fileDialog: () => unknown;
}

export interface IDragUploadProps {
	id?: string | undefined;
	className?: string | undefined;
	/** applies to input field only and not for drag & drop */
	accept?: string[] | undefined;
	children: React.ReactNode;
	hint?: string | undefined;
	onInput: (files: File[]) => void;
}
