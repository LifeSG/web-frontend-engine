import { randomUUID } from "node:crypto";
const { ResizeObserver } = window;

window.crypto.randomUUID = randomUUID;
window.GeolocationPositionError = {
	PERMISSION_DENIED: 1,
	POSITION_UNAVAILABLE: 2,
	TIMEOUT: 3,
};

global.beforeEach(() => {
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
