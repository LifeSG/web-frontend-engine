const isLifeSgApp = (): boolean => {
	return typeof window !== "undefined" && window.sessionStorage.getItem("lifeSg") === "true";
};

export enum DeviceActions {
	GET_CURRENT_POSITION = "getCurrentPosition",
	GET_CURRENT_POSITION_DISABLE_PROMPT = "getCurrentPositionDisablePrompt",
	TRIGGER_CAMERA_PERMISSION = "triggerCameraPermission",
	GET_DEVICE_INFO = "getDeviceInfo",
}

const postWebviewMessage = (message: DeviceActions, additionalProps?: object) => {
	if (!additionalProps) {
		window.ReactNativeWebView?.postMessage(message);
		return;
	}
	window.ReactNativeWebView?.postMessage(message + JSON.stringify(additionalProps));
};

// =============================================================================
// EXPORTABLE
// =============================================================================
export const WebviewHelper = {
	isLifeSgApp,
	postWebviewMessage,
};
