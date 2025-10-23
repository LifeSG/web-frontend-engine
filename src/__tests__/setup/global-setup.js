import { randomUUID } from "node:crypto";
import { TextDecoder, TextEncoder } from "util";
import { MessageChannel } from "worker_threads";
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
});

global.afterEach(() => {
	window.ResizeObserver = ResizeObserver;
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.MessageChannel = MessageChannel;
