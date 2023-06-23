/**
 * Hook that interacts with the event context provider
 * use this hook to add/dispatch/remove event listeners
 */
export declare const useFieldEvent: () => {
    addFieldEventListener: (type: string, id: string, listener: (ev: Event) => unknown, options?: boolean | AddEventListenerOptions) => void;
    dispatchFieldEvent: (type: string, id: string, detail?: any) => boolean;
    removeFieldEventListener: (type: string, id: string, listener: (ev: Event) => unknown, options?: boolean | EventListenerOptions) => void;
};
