export declare namespace StyleHelper {
    /** sanitises a schema-authored CSS string before it is assigned to an element's style.cssText. Rather than stripping
     * known-bad tokens (bypassable with CSS escapes or non-url() resource functions like image-set()), only declarations
     * whose property is on a layout allowlist and whose value contains no resource-referencing construct are kept.
     * Rules and at-rules such as `@media` are not supported by style.cssText and are dropped.
     * Never throws: invalid input results in an empty string */
    const sanitizeStyleString: (value: unknown) => string;
}
