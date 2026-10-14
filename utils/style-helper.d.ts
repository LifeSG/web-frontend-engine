export declare namespace StyleHelper {
    /** strips the two concrete network-side-channel risks from a schema-authored CSS string before it's
     * assigned to an element's style.cssText: @import (loads a remote stylesheet) and url() (references
     * a remote resource). Not a full CSS parser/allowlist — legitimate uses of this styling hook
     * (padding/margin tweaks) need neither construct. */
    const sanitizeStyleString: (value: string) => string;
}
