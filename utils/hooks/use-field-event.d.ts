import { TAddFieldEventListener } from "../../context-providers";
/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */
export declare const useFieldEvent: () => {
    addFieldEventListener: TAddFieldEventListener;
    dispatchFieldEvent: <T = any>(arg1: string, arg2: string, arg3?: string | T, arg4?: T) => boolean;
    removeFieldEventListener: TAddFieldEventListener;
};
