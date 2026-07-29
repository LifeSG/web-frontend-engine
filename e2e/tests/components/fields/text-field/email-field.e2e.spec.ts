import { createStoryTest, test } from "../../../utils/fixtures";

const createEmailFieldTest = (story: string) =>
	createStoryTest({
		component: "fields/text-field",
		story,
		createLocators: () => ({}),
	});

const defaultTest = createEmailFieldTest("email-default");
const warningTest = createEmailFieldTest("email-warning");

test.describe("email-field", () => {
	defaultTest.describe(() => {
		defaultTest("Default", async ({ story }) => {
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
});
