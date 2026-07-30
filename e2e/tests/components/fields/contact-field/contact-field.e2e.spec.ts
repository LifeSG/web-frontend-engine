import { createStoryTest } from "../../../utils/fixtures";

const createContactFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/contact-field",
		story,
		createLocators: (page) => ({
			contactField: page.getByRole("textbox", { name: /Contact Number/ }),
			submitButton: page.getByRole("button", { name: "Submit" }),
		}),
	});

const defaultTest = createContactFieldTest("default");
const internationalNumberTest = createContactFieldTest("international-number");
const singaporeNumberTest = createContactFieldTest("singapore-number");
const warningTest = createContactFieldTest("warning");

defaultTest("Default", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});

internationalNumberTest("International number", async ({ story }) => {
	await story.goto();

	await story.locators.contactField.fill("12-345-678");
	await story.locators.submitButton.click();

	await story.snapshot("error");
});

singaporeNumberTest("Singapore number", async ({ story }) => {
	await story.goto();

	await story.locators.contactField.fill("12345678");
	await story.locators.submitButton.click();

	await story.snapshot("error");
});

warningTest("Warning", async ({ story }) => {
	await story.goto();
	await story.snapshot("mount");
});
