export declare const useRecaptcha: () => {
    loaded: boolean;
    isRecaptchaReady: boolean;
    getToken: (action?: string) => Promise<string>;
};
