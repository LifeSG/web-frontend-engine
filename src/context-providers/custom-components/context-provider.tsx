import { Dispatch, ReactElement, SetStateAction, createContext, useState } from "react";
import { TCustomComponentProps } from "../../components";

export type TCustomComponent<S> = (props: TCustomComponentProps<S>) => React.JSX.Element;
export type TCustomComponents = Record<string, TCustomComponent<any>>;

interface ICustomComponentsContext {
	customComponents: TCustomComponents;
	setCustomComponents: Dispatch<SetStateAction<TCustomComponents>>;
}

interface IProps {
	children: ReactElement;
}

export const CustomComponentsContext = createContext<ICustomComponentsContext>({
	customComponents: null,
	setCustomComponents: null,
});

export const CustomComponentsProvider = ({ children }: IProps) => {
	const [customComponents, setCustomComponents] = useState<TCustomComponents>({});

	return (
		<CustomComponentsContext.Provider value={{ customComponents, setCustomComponents }}>
			{children}
		</CustomComponentsContext.Provider>
	);
};
