export declare namespace RegexHelper {
    const MAX_MATCHES_INPUT_LENGTH = 1000;
    const compile: (pattern: string) => RegExp | undefined;
    const safeTestRegex: (regex: RegExp | undefined, value: string) => boolean;
}
