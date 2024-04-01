import { Dispatch, SetStateAction, createContext, useState } from "react";
import { IImage } from "../types";

interface IImageContext {
	images: IImage[];
	setImages: Dispatch<SetStateAction<IImage[]>>;
	errorCount: number;
	setErrorCount: Dispatch<SetStateAction<number>>;
}

interface Props {
	children: (string | boolean | JSX.Element)[] | (string | boolean | JSX.Element);
}

export const ImageContext = createContext<IImageContext>({
	images: [],
	setImages: () => null,
	errorCount: 0,
	setErrorCount: () => null,
});

export const ImageProvider = ({ children }: Props) => {
	const [images, setImages] = useState<IImage[]>([]);
	const [errorCount, setErrorCount] = useState(0);

	return (
		<ImageContext.Provider
			value={{
				images,
				setImages,
				errorCount,
				setErrorCount,
			}}
		>
			{children}
		</ImageContext.Provider>
	);
};
