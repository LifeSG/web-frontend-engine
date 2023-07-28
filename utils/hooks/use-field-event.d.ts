/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */
export declare const useFieldEvent: () => {
    addFieldEventListener: <T = any>(type: string, id: string, listener: (ev: CustomEvent<T>) => void, options?: boolean | AddEventListenerOptions) => void;
    dispatchFieldEvent: <T_1 = any>(type: string, id: string, detail?: T_1) => boolean;
    removeFieldEventListener: <T_2 = any>(type: string, id: string, listener: (ev: CustomEvent<T_2>) => void, options?: boolean | EventListenerOptions) => void;
};
