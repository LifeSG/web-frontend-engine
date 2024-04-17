import { Dispatch, SetStateAction, createContext, useState } from "react";
import { IImage } from "../types";

interface IImageContext {
	images: IImage[];
	setImages: Dispatch<SetStateAction<IImage[]>>;
	errorCount: number;
	setErrorCount: Dispatch<SetStateAction<number>>;
	exceededFiles: boolean;
	setExceedError: Dispatch<SetStateAction<boolean>>;
}

interface Props {
	children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}

export const ImageContext = createContext<IImageContext>({
	images: [],
	setImages: () => null,
	errorCount: 0,
	setErrorCount: () => null,
	exceededFiles: undefined,
	setExceedError: () => undefined,
});

export const ImageProvider = ({ children }: Props) => {
	const [images, setImages] = useState<IImage[]>([]);
	const [errorCount, setErrorCount] = useState(0);
	const [exceededFiles, setExceedError] = useState<boolean>();

	return (
		<ImageContext.Provider
			value={{
				images,
				setImages,
				errorCount,
				setErrorCount,
				exceededFiles,
				setExceedError,
			}}
		>
			{children}
		</ImageContext.Provider>
	);
};
