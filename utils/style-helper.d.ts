export declare namespace StyleHelper {
    /** sanitises a schema-authored CSS string before it is interpolated into the modal box's styled-components rule.
     * Rather than stripping known-bad tokens (bypassable with CSS escapes or non-url() resource functions like
     * image-set()), only declarations whose property is on a layout allowlist and whose value contains no
     * resource-referencing construct are kept. Any brace drops the whole string, so rules and at-rules such as `@media`
     * can't close the modal box rule and style other elements on the page.
     * Never throws: invalid input results in an empty string */
    const sanitizeStyleString: (value: unknown) => string;
}
