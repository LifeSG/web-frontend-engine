import { createStoryTest, expect, test } from "../../../utils/fixtures";
import { mockGeolocation, mockOneMapAPI, mockOneMapAPIError } from "./fixtures/mock-onemap";

const createLocationFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/location-field",
		story,
		createLocators: (page) => ({
			locationInput: page.getByTestId("field__location-input-base"),
			modalBox: page.getByTestId("field__modal-box"),
			modalMapImage: page.getByTestId("field__static-map").locator("img"),
			legendTrigger: page.getByTestId("field__legend-trigger"),
			legend: page.getByTestId("field__legend"),
		}),
	});

const defaultTest = createLocationFieldTest("default");
const mapTest = createLocationFieldTest("map");
const disabledTest = createLocationFieldTest("disabled");
const readonlyTest = createLocationFieldTest("readonly");
const mapBannerTest = createLocationFieldTest("map-banner");
const legendTest = createLocationFieldTest("legend");
const apiErrorTest = createLocationFieldTest("api-error");
const customStylesTest = createLocationFieldTest("with-custom-styles");
const warningTest = createLocationFieldTest("warning");

test.describe("Location Field", () => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.page.waitForLoadState("networkidle");

		await story.snapshot("mount");
	});

	defaultTest("Modal", async ({ story }) => {
		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);

		await story.waitForImageLoad();
		await story.page.waitForLoadState("networkidle");

		await story.snapshot("open", { fullscreen: true });
	});

	defaultTest("Modal (mobile)", async ({ story }) => {
		await story.setViewport({ size: "mobile" });

		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);

		await story.waitForImageLoad();
		await story.page.waitForLoadState("networkidle");

		await story.snapshot("open", { fullscreen: true });
	});

	defaultTest("Modal (mobile landscape)", async ({ story }) => {
		await story.setViewport({ size: "mobile", orientation: "landscape" });

		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);

		await story.waitForImageLoad();
		await story.page.waitForLoadState("networkidle");

		await story.snapshot("open", { fullscreen: true });
	});

	mapTest("Map", async ({ story }) => {
		await mockOneMapAPI(story.page);
		await story.goto();
		await story.waitForImageLoad();

		await story.snapshot("mount");
	});

	disabledTest("Disabled", async ({ story }) => {
		await mockOneMapAPI(story.page);
		await story.goto();
		await story.waitForImageLoad();

		await story.snapshot("mount");
	});

	readonlyTest("Readonly", async ({ story }) => {
		await mockOneMapAPI(story.page);
		await story.goto();
		await story.waitForImageLoad();

		await story.snapshot("mount");
	});

	mapBannerTest("Map banner", async ({ story }) => {
		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);

		await story.page.waitForLoadState("networkidle");
		await story.waitForImageLoad();

		await story.snapshot("open", { fullscreen: true });
	});

	legendTest("Legend", async ({ story }) => {
		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();

		await story.page.waitForLoadState("networkidle");
		await story.waitForImageLoad();
		await story.waitForAnimationEnd(story.locators.modalBox);
		await story.page.waitForTimeout(1000); // Added timeout to allow popover to stabilize before clicking

		await story.locators.legendTrigger.click();
		await expect(story.locators.legend).toBeVisible();

		await story.snapshot("open", { fullscreen: true });
	});

	apiErrorTest("API error", async ({ story }) => {
		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await mockOneMapAPIError(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);
		await story.page.waitForTimeout(2000);

		await story.snapshot("error", { fullscreen: true });
	});

	defaultTest("Get current location", async ({ story }) => {
		await mockGeolocation(story.page, { delay: 3000 });
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);

		await story.waitForImageLoad();
		await story.page.waitForLoadState("networkidle");

		await story.snapshot("open", { fullscreen: true });
	});

	warningTest("Warning", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	customStylesTest("Custom modal styles", async ({ story }) => {
		await mockGeolocation(story.page);
		await mockOneMapAPI(story.page);
		await story.goto();

		await story.locators.locationInput.click();
		await expect(story.locators.modalBox).toBeVisible();
		await story.waitForAnimationEnd(story.locators.modalBox);

		await story.waitForImageLoad();
		await story.page.waitForLoadState("networkidle");

		await story.snapshot("open", { fullscreen: true });
	});
});
