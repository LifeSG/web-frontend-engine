import { Dispatch, SetStateAction, createContext, useMemo, useState } from "react";
import { IFile } from "./types";

interface IFileUploadContext {
	files: IFile[];
	setFiles: Dispatch<SetStateAction<IFile[]>>;
}

interface Props {
	children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}

export const FileUploadContext = createContext<IFileUploadContext>({
	files: [],
	setFiles: () => null,
});

export const FileUploadProvider = ({ children }: Props) => {
	const [files, setFiles] = useState<IFile[]>([]);
	const values = useMemo(() => ({ files, setFiles }), [files]);

	return <FileUploadContext.Provider value={values}>{children}</FileUploadContext.Provider>;
};
