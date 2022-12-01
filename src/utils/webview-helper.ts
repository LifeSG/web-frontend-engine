// NOTE: Copied from web-common/utils

export namespace WebviewHelper {
	export const isLifeSgApp = (): boolean => {
		return typeof window !== "undefined" && window.sessionStorage.getItem("lifeSg") === "true";
	};

	export const postWebviewMessage = (message: string) => {
		window.ReactNativeWebView?.postMessage(message);
	};
}
