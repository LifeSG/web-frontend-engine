import { UseFormReturn } from "react-hook-form";
import { IFrontendEngineProps } from "./types";
/**
 * Handles change in form values and validity. Updates consumer change handlers and error state.
 *
 * @param props
 * @param formMethods
 * @returns `checkIsFormValid`: helper to check current form validity
 */
export declare const useFormChange: (props: IFrontendEngineProps, formMethods: UseFormReturn) => {
    checkIsFormValid: () => boolean;
};
