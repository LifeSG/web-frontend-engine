import { createContext, useContext } from "react";

export type TWhenDependencyMap = Record<string, string[]>;

export interface IConditionalValidationRequest {
	fieldId: string;
}

export interface IConditionalValidationContext {
	conditionalValidationRequests: IConditionalValidationRequest[];
}

export interface IWhenDependencyMapContext extends IConditionalValidationContext {
	whenDependencyMap: TWhenDependencyMap;
}

export const WhenDependencyMapContext = createContext<IWhenDependencyMapContext>({
	whenDependencyMap: {},
	conditionalValidationRequests: [],
});

export const consumeConditionalValidationRequests = (
	context: IConditionalValidationContext
): IConditionalValidationContext => {
	const requests = context.conditionalValidationRequests.splice(0);
	return { ...context, conditionalValidationRequests: requests };
};

export const useWhenDependencyMap = (): IWhenDependencyMapContext => {
	return useContext(WhenDependencyMapContext);
};
