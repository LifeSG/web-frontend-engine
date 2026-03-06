/// <reference types="react" />
import { IFrontendEngineData } from "../../components";
export declare const useFormSchema: () => {
    setFormSchema: import("react").Dispatch<import("react").SetStateAction<IFrontendEngineData<undefined, undefined>>>;
    formSchema: IFrontendEngineData<undefined, undefined>;
    overrideSchema: <T>(children: T, overrides: IFrontendEngineData["overrides"]) => T;
};
