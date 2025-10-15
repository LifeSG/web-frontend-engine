// Ambient module declaration to support importing the CSP build of 'heic-to'.
// The package provides an exports entry for './csp', but with current tsconfig (moduleResolution: 'node')
// TypeScript does not resolve the subpath's declaration file automatically.
// This bridges that gap without needing to switch to 'node16'/'nodenext'/'bundler'.
declare module "heic-to/csp" {
	export * from "heic-to/dist/csp/heic-to";
}
