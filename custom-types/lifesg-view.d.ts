// accomodate for masthead and statusbar in lifesg app
export interface LifeSgView {
	mastheadHeight: number;
	statusBarHeight: number;
}

declare global {
	interface Window {
		lifeSgView: LifeSgView;
	}
}

export {};
