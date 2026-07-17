import { randomUUID } from "node:crypto";
const { ResizeObserver } = window;

window.crypto.randomUUID = randomUUID;
window.GeolocationPositionError = {
	PERMISSION_DENIED: 1,
	POSITION_UNAVAILABLE: 2,
	TIMEOUT: 3,
};

const matchMediaFactory = (query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	dispatchEvent: jest.fn(),
});

Object.defineProperty(window, "matchMedia", {
	writable: true,
	configurable: true,
	value: jest.fn().mockImplementation(matchMediaFactory),
});

global.beforeEach(() => {
	// Restore implementation on the existing jest mock (preserves cached references used by react-responsive).
	// If window.matchMedia is not a jest mock (e.g. jsdom-testing-mocks replaced it via mockViewportForTestGroup),
	// leave it untouched so viewport mocking works correctly.
	if (window.matchMedia && typeof window.matchMedia.mockImplementation === "function") {
		window.matchMedia.mockImplementation(matchMediaFactory);
	} else if (!window.matchMedia) {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			configurable: true,
			value: jest.fn().mockImplementation(matchMediaFactory),
		});
	}
	delete window.ResizeObserver;
	window.ResizeObserver = jest.fn().mockImplementation(() => ({
		observe: jest.fn(),
		unobserve: jest.fn(),
		disconnect: jest.fn(),
	}));
	window.scrollTo = jest.fn();
});

global.afterEach(() => {
	window.ResizeObserver = ResizeObserver;
	window.scrollTo.mockClear();
});
