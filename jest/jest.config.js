module.exports = async () => ({
	rootDir: "..",
	moduleFileExtensions: ["tsx", "ts", "js"],
	testEnvironment: "jsdom",
	testMatch: ["<rootDir>/src/**/__tests__/**/*.spec.[jt]s?(x)"],
	maxConcurrency: 10,
	collectCoverageFrom: [
		"<rootDir>/src/**/*.{js,jsx,ts,tsx}",
		// Generic exclusions
		"!**/__tests__/**/*",
		"!**/stories/**/*",
		"!**/{I,i}ndex.*",
	],
	coverageDirectory: "<rootDir>/coverage",
	coverageReporters: ["text"],
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
			"<rootDir>/jest/mocks/file-mock.ts",
		"src/(.*)": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: [
		"jest-canvas-mock",
		"@testing-library/jest-dom",
		"<rootDir>/src/__tests__/setup/global-setup.js",
	],
	verbose: true,
	bail: false,
	transformIgnorePatterns: ["/node_modules/(?!@lifesg/react-design-system|leaflet)"],
	transform: {
		"\\.[jt]sx?$": ["babel-jest", { excludeJestPreset: true }],
		"^.+\\.css$": "jest-transform-css",
	},
	reporters: ["default", ["jest-junit", { outputName: "junit.xml" }]],
});
