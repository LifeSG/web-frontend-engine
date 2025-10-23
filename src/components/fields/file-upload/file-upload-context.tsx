import { Dispatch, SetStateAction, createContext, useMemo, useState } from "react";
import { IFile } from "./types";

interface IFileUploadContext {
	files: IFile[];
	setFiles: Dispatch<SetStateAction<IFile[]>>;
	currentFileIds: string[];
	setCurrentFileIds: Dispatch<SetStateAction<string[]>>;
}

interface Props {
	children: (string | boolean | React.JSX.Element)[] | (string | boolean | React.JSX.Element);
}

export const FileUploadContext = createContext<IFileUploadContext>({
	files: [],
	setFiles: () => null,
	currentFileIds: [],
	setCurrentFileIds: () => null,
});

export const FileUploadProvider = ({ children }: Props) => {
	const [files, setFiles] = useState<IFile[]>([]);
	const [currentFileIds, setCurrentFileIds] = useState<string[]>([]);
	const values = useMemo(() => ({ files, setFiles, currentFileIds, setCurrentFileIds }), [files, currentFileIds]);

	return <FileUploadContext.Provider value={values}>{children}</FileUploadContext.Provider>;
};
