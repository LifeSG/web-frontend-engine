import { createStoryTest, expect, forComponent, test } from "../../../utils/fixtures";
import { mockGeolocation, mockOneMapAPI, mockOneMapAPIError } from "./fixtures/mock-onemap";
import { Page } from "@playwright/test";

const waitForMapComponent = async (page: Page, timeout = 10000) => {
	await page.waitForFunction(
		() => {
			// Check for Leaflet tiles
			const leafletTiles = Array.from(document.querySelectorAll<HTMLImageElement>(".leaflet-tile"));
			if (leafletTiles.length > 0) {
				const loadingTiles = document.querySelectorAll(".leaflet-tile-loading");
				const allTilesLoaded = leafletTiles.every((tile) => tile.complete && tile.naturalHeight > 0);
				return loadingTiles.length === 0 && allTilesLoaded;
			}

			// Check for static map
			const staticMapImg = document.querySelector<HTMLImageElement>('[data-testid="field__static-map"] img');
			if (staticMapImg) {
				return staticMapImg.complete && staticMapImg.naturalHeight > 0;
			}

			return false;
		},
		{ polling: 100, timeout }
	);
};

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
const withStory = forComponent("fields/location-field");

test.describe("Location Field", () => {
	defaultTest.describe(() => {
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
			await waitForMapComponent(story.page);

			await story.snapshot("open", { fullscreen: true });
		});

		defaultTest("Modal (mobile)", async ({ story }) => {
			await story.setViewport({ size: "mobile" });

			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await waitForMapComponent(story.page);

			await story.snapshot("open", { fullscreen: true });
		});

		defaultTest("Modal (mobile landscape)", async ({ story }) => {
			await story.setViewport({ size: "mobile", orientation: "landscape" });

			await mockGeolocation(story.page);
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await waitForMapComponent(story.page);

			await story.snapshot("open", { fullscreen: true });
		});
	});

	mapTest.describe(() => {
		mapTest("Map", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();
			await waitForMapComponent(story.page);

			await story.snapshot("mount");
		});
	});

	disabledTest.describe(() => {
		disabledTest("Disabled", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();
			await waitForMapComponent(story.page);

			await story.snapshot("mount");
		});
	});

	readonlyTest.describe(() => {
		readonlyTest("Readonly", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();
			await waitForMapComponent(story.page);

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
			await waitForMapComponent(story.page);

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
			await waitForMapComponent(story.page);
			await story.locators.legendTrigger.click();
			await expect(story.locators.legend).toBeVisible();

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

	customStylesTest.describe(() => {
		customStylesTest("Custom modal styles", async ({ story }) => {
			await mockOneMapAPI(story.page);
			await story.goto();

			await story.locators.locationInput.click();
			await expect(story.locators.modalBox).toBeVisible();
			await story.page.waitForTimeout(2000);

			await story.snapshot("open", { fullscreen: true });
		});
	});
});
