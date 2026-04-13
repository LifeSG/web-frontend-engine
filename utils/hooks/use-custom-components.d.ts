/// <reference types="react" />
export declare const useCustomComponents: () => {
    customComponents: import("../../context-providers").TCustomComponents;
    getCustomComponent: (referenceKey: string) => import("../../context-providers").TCustomComponent<any>;
    setCustomComponents: import("react").Dispatch<import("react").SetStateAction<import("../../context-providers").TCustomComponents>>;
};
