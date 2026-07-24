import { createStoryTest } from "../../../utils/fixtures";
import { expect } from "@playwright/test";

const createDateFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/date-field",
		story,
		useMockedTimestamp: true,
		createLocators: (page) => ({
			dateField: page.getByTestId("field__date"),
			calendarContainer: page.getByTestId("calendar-container"),
		}),
	});

const defaultTest = createDateFieldTest("default");
const withoutButtonsTest = createDateFieldTest("without-buttons");
const warningTest = createDateFieldTest("warning");
const disabledDatesTest = createDateFieldTest("disabled-dates");

defaultTest.describe(() => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	defaultTest("Date field modal", async ({ story }) => {
		await story.goto();

		await story.locators.dateField.click();
		await expect(story.locators.calendarContainer).toBeVisible();
		await story.snapshot("open", { fullscreen: true });
	});
});

withoutButtonsTest.describe(() => {
	withoutButtonsTest("Without buttons", async ({ story }) => {
		await story.goto();

		await story.locators.dateField.click();
		await expect(story.locators.calendarContainer).toBeVisible();
		await story.snapshot("open", { fullscreen: true });
	});
});

warningTest.describe(() => {
	warningTest("Warning", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

disabledDatesTest.describe(() => {
	disabledDatesTest("Disabled dates", async ({ story }) => {
		await story.goto();

		await story.locators.dateField.click();
		await expect(story.locators.calendarContainer).toBeVisible();
		await story.snapshot("open", { fullscreen: true });
	});
});
