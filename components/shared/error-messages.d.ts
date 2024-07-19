import { ReactNode } from "react";
export declare const ERROR_MESSAGES: {
    COMMON: {
        FIELD_REQUIRED: string;
        REQUIRED_OPTION: string;
        REQUIRED_OPTIONS: string;
    };
    CONTACT: {
        INVALID_SINGAPORE_NUMBER: string;
        INVALID_INTERNATIONAL_NUMBER: string;
    };
    DATE: {
        MUST_BE_FUTURE: string;
        MUST_BE_PAST: string;
        CANNOT_BE_FUTURE: string;
        CANNOT_BE_PAST: string;
        MIN_DATE: (date: string) => string;
        MAX_DATE: (date: string) => string;
        DISABLED_DATES: string;
        INVALID: string;
    };
    DATE_RANGE: {
        MUST_BE_FUTURE: string;
        MUST_BE_PAST: string;
        CANNOT_BE_FUTURE: string;
        CANNOT_BE_PAST: string;
        MIN_DATE: (date: string) => string;
        MAX_DATE: (date: string) => string;
        DISABLED_DATES: string;
        INVALID: string;
        REQUIRED: string;
        MUST_HAVE_NUMBER_OF_DAYS: (numberOfDays: number) => string;
    };
    EMAIL: {
        INVALID: string;
    };
    GENERIC: {
        INVALID: string;
        UNSUPPORTED: string;
    };
    UPLOAD: (unit?: string, unitPlural?: string) => {
        REQUIRED: string;
        MAX_FILES: (max: number) => string;
        MAX_FILES_WITH_REMAINING: (remaining: number) => string;
        MAX_FILE_SIZE: (maxSize: number) => string;
        GENERIC: string;
        FILE_TYPE: (acceptedFileTypes: string[]) => string;
        MODAL: {
            FILE_TYPE: {
                TITLE: string;
                DESCRIPTION: (filename: ReactNode, acceptedFileTypes: string[]) => import("react/jsx-runtime").JSX.Element;
            };
            GENERIC_ERROR: {
                TITLE: string;
                DESCRIPTION: (filename: ReactNode) => import("react/jsx-runtime").JSX.Element;
            };
            MAX_FILE_SIZE: {
                TITLE: string;
                DESCRIPTION: (filename: ReactNode, maxSize: number) => import("react/jsx-runtime").JSX.Element;
            };
        };
    };
    SLIDER: {
        MUST_BE_INCREMENTAL: string;
    };
    UNIT_NUMBER: {
        INVALID: string;
    };
    LOCATION: {
        MUST_HAVE_POSTAL_CODE: string;
        INVALID_LOCATION: string;
    };
};
