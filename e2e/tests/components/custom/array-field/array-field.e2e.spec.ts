import { createStoryTest, expect } from "../../../utils/fixtures";

const createArrayFieldTest = (story: string) =>
	createStoryTest({
		component: "custom/array-field",
		story,
		createLocators: (page) => ({
			addButton: page.getByRole("button", { name: "Add" }),
			removeButton: page.getByRole("button", { name: "Remove" }),
			textField: page.getByRole("textbox", { name: "Input" }),
			submitButton: page.getByRole("button", { name: "Submit" }),
		}),
	});

const defaultTest = createArrayFieldTest("default");
const multipleEntriesTest = createArrayFieldTest("multiple-entries");
const removeConfirmationModalTest = createArrayFieldTest("remove-confirmation-modal");
const minConstraintTest = createArrayFieldTest("min-constraint");
const maxConstraintTest = createArrayFieldTest("max-constraint");
const uniqueValidationTest = createArrayFieldTest("unique-validation");
const removeButtonPositionTest = createArrayFieldTest("remove-button-position");
const customButtonsTest = createArrayFieldTest("custom-buttons");
const hideDividerTest = createArrayFieldTest("hide-divider");
const warningTest = createArrayFieldTest("warning");

defaultTest.describe(() => {
	defaultTest("Default", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	defaultTest("Default (mobile)", async ({ story }) => {
		await story.page.setViewportSize({ width: 375, height: 667 });
		await story.goto();
		await story.snapshot("mount");
	});
});

multipleEntriesTest.describe(() => {
	multipleEntriesTest("Multiple entries", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

warningTest.describe(() => {
	warningTest("Warning", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

removeConfirmationModalTest.describe(() => {
	removeConfirmationModalTest("Remove confirmation modal", async ({ story }) => {
		await story.goto();

		await story.locators.removeButton.click();

		await expect(story.page.getByText("Remove entry?")).toBeVisible();
		await story.waitForImageLoad();
		await story.snapshot("modal-open", { fullscreen: true });
	});
});

minConstraintTest.describe(() => {
	minConstraintTest("Min constraint", async ({ story }) => {
		await story.goto();

		await expect(story.locators.removeButton).toHaveCount(0);
		await story.snapshot("mount");
	});
});

maxConstraintTest.describe(() => {
	maxConstraintTest("Max constraint", async ({ story }) => {
		await story.goto();

		await expect(story.locators.addButton).toHaveCount(0);
		await story.snapshot("mount");
	});
});

uniqueValidationTest.describe(() => {
	uniqueValidationTest("Unique field validation", async ({ story }) => {
		await story.goto();

		await uniqueValidationTest.step("Fill duplicate values", async () => {
			await story.locators.addButton.click();
			await story.locators.textField.first().fill("Apple");
			await story.locators.textField.last().fill("Apple");
		});

		await uniqueValidationTest.step("Trigger validation", async () => {
			await story.locators.submitButton.click({ delay: 1000 }); // Delay as validation is not immediately updated
		});

		await uniqueValidationTest.step("Verify validation error", async () => {
			await expect(story.page.getByText("One or more fields are not unique")).toBeVisible();

			await story.snapshot("validation-error");
		});
	});
});

removeButtonPositionTest.describe(() => {
	removeButtonPositionTest("Remove button position", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});

	removeButtonPositionTest("Remove button position (mobile)", async ({ story }) => {
		await story.page.setViewportSize({ width: 375, height: 667 });
		await story.goto();
		await story.snapshot("mount");
	});
});

customButtonsTest.describe(() => {
	customButtonsTest("Custom buttons", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});

hideDividerTest.describe(() => {
	hideDividerTest("showDivider=false", async ({ story }) => {
		await story.goto();
		await story.snapshot("mount");
	});
});
