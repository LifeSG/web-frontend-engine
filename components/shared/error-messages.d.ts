export declare const ERROR_MESSAGES: {
    COMMON: {
        REQUIRED_OPTION: string;
    };
    CONTACT: {
        INVALID_SINGAPORE_NUMBER: string;
        INVALID_INTERNATIONAL_NUMBER: string;
    };
    EMAIL: {
        INVALID: string;
    };
    DATE: {
        MUST_BE_FUTURE: string;
        MUST_BE_PAST: string;
        CANNOT_BE_FUTURE: string;
        CANNOT_BE_PAST: string;
        MIN_DATE: (date: string) => string;
        MAX_DATE: (date: string) => string;
        INVALID: string;
    };
    GENERIC: {
        INVALID: string;
        UNSUPPORTED: string;
    };
};
