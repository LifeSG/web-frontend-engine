import { createContext, useContext } from "react";

export type TWhenDependencyMap = Record<string, string[]>;

export const WhenDependencyMapContext = createContext<TWhenDependencyMap>({});

export const useWhenDependencyMap = (): TWhenDependencyMap => {
	return useContext(WhenDependencyMapContext);
};
