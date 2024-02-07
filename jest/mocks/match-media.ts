window.matchMedia = jest.fn().mockImplementation(() => {
	return {
		matches: false,
		addListener: function () {
			// stub
		},
		removeListener: function () {
			// stub
		},
	};
});

export {};
