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
	webServer: {
		command: "npm --prefix e2e/nextjs-app run dev",
		url: `${baseURL}/`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
