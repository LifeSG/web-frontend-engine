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
export declare const WhenDependencyMapContext: import("react").Context<IWhenDependencyMapContext>;
export declare const consumeConditionalValidationRequests: (context: IConditionalValidationContext) => IConditionalValidationContext;
export declare const useWhenDependencyMap: () => IWhenDependencyMapContext;
