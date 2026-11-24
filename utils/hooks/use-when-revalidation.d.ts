import { IConditionalValidationRequest } from "../../context-providers/when-dependency-map";
export declare const getSourceFieldsForDependent: (fieldId: string, whenDependencyMap: Record<string, string[]> | undefined) => string[];
export declare const useWhenRevalidation: (fieldId: string, whenDependencyMap: Record<string, string[]> | undefined, conditionalValidationRequests: IConditionalValidationRequest[]) => void;
