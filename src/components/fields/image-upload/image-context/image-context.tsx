import { Dispatch, SetStateAction, createContext, useState } from "react";
import { IImage } from "../types";

interface IImageContext {
	images: IImage[];
	setImages: Dispatch<SetStateAction<IImage[]>>;
	errorCount: number;
	setErrorCount: Dispatch<SetStateAction<number>>;
	currentFileIds: string[];
	setCurrentFileIds: Dispatch<SetStateAction<string[]>>;
}

interface Props {
	children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}

export const ImageContext = createContext<IImageContext>({
	images: [],
	setImages: () => null,
	errorCount: 0,
	setErrorCount: () => null,
	currentFileIds: [],
	setCurrentFileIds: () => null,
});

export const ImageProvider = ({ children }: Props) => {
	const [images, setImages] = useState<IImage[]>([]);
	const [errorCount, setErrorCount] = useState(0);
	const [currentFileIds, setCurrentFileIds] = useState<string[]>([]);

	return (
		<ImageContext.Provider
			value={{
				images,
				setImages,
				errorCount,
				setErrorCount,
				currentFileIds,
				setCurrentFileIds,
			}}
		>
			{children}
		</ImageContext.Provider>
	);
};
