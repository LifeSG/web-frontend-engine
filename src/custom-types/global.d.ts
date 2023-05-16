declare module "*.ttf";

// accomodate for masthead and statusbar in lifesg app
export interface LifeSgView {
	mastheadHeight: number;
	statusBarHeight: number;
}

declare global {
	interface Window {
		lifeSgView: LifeSgView;
		ReactNativeWebView: {
			postMessage: (message: string) => void;
		};

		// for Google Tag Manager
		dataLayer: Record<string, any>[];
		MSStream: any;
	}
}
