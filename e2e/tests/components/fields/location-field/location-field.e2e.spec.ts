import { createStoryTest, expect, forComponent, test } from "../../../utils/fixtures";
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
		}),
	});

const defaultTest = createLocationFieldTest("default");
const mapTest = createLocationFieldTest("map");
const disabledTest = createLocationFieldTest("disabled");
const readonlyTest = createLocationFieldTest("readonly");
const mapBannerTest = createLocationFieldTest("map-banner");
const legendTest = createLocationFieldTest("legend");
const apiErrorTest = createLocationFieldTest("api-error");
const withStory = forComponent("fields/location-field");

test.describe("Location Field", () => {
	defaultTest.describe(() => {
		defaultTest("Default", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});

		defaultTest("Modal", async ({ story }) => {
			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);

			await story.snapshot("open", { fullscreen: true });
		});

		defaultTest("Modal (mobile)", async ({ story }) => {
			await story.setViewport({ size: "mobile" });

			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);

			await story.snapshot("open", { fullscreen: true });
		});

		defaultTest("Modal (mobile landscape)", async ({ story }) => {
			await story.setViewport({ size: "mobile", orientation: "landscape" });

			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);

			await story.snapshot("open", { fullscreen: true });
		});
	});

	mapTest.describe(() => {
		mapTest("Map", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();
			await story.page.waitForTimeout(2000);

			await story.snapshot("mount");
		});
	});

	disabledTest.describe(() => {
		disabledTest("Disabled", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();
			await story.page.waitForTimeout(2000);

			await story.snapshot("mount");
		});
	});

	readonlyTest.describe(() => {
		readonlyTest("Readonly", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();
			await story.page.waitForTimeout(2000);

			await story.snapshot("mount");
		});
	});

	mapBannerTest.describe(() => {
		mapBannerTest("Map banner", async ({ story }) => {
			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);

			await story.snapshot("open", { fullscreen: true });
		});
	});

	legendTest.describe(() => {
		legendTest("Legend", async ({ story }) => {
			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);
			await story.locators.legendTrigger.click();

			await story.snapshot("open", { fullscreen: true });
		});
	});

	apiErrorTest.describe(() => {
		apiErrorTest("API error", async ({ story }) => {
			await mockGeolocation(story.page);
			await mockOneMapAPIError(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);

			await story.snapshot("error", { fullscreen: true });
		});
	});

	test.describe(() => {
		test.use({
			storyOptions: {
				...withStory("warning"),
			},
		});

		test("Warning", async ({ story }) => {
			await story.goto();
			await story.snapshot("mount");
		});
	});
});
