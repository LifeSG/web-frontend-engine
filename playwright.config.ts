import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
	testDir: "./e2e/tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html"]],
	snapshotPathTemplate: "{testDir}/{testFileDir}/__screenshots__/{projectName}/{testName}--{arg}{ext}",
	use: {
		baseURL,
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: [
		{
			command: "npm run test-e2e:docker",
			wait: {
				stdout: /Listening on ws:\/\/0\.0\.0\.0:(?<PLAYWRIGHT_SERVER_PORT>\d+)/,
			},
			gracefulShutdown: { signal: "SIGTERM", timeout: 30000 },
			reuseExistingServer: !process.env.CI,
			stderr: "pipe",
			stdout: "pipe",
		},
		{
			command: "./scripts/e2e-next-app.sh",
			url: "http://localhost:3000",
			reuseExistingServer: !process.env.CI,
			stderr: "pipe",
			stdout: "pipe",
		},
	],
});
