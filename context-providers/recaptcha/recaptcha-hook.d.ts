export declare const useRecaptcha: () => {
    loaded: boolean;
    getToken: (action?: string) => Promise<string>;
};
