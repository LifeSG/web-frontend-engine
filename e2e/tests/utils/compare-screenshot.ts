import { Locator, Page, expect } from "@playwright/test";
/**
 * Compares a screenshot of the story page or a specific locator within the page.
 * @param storyPage The story page instance.
 * @param name The name of the screenshot file.
 * @param options.fullscreen Set to true to capture the entire page, useful for floating elements
 * @param options.locator Specify a specific element to capture
 */
export const compareScreenshot = async (
	storyPage: Page,
	name: string,
	options?: { fullscreen?: boolean; locator?: Locator; mask?: Locator[] }
) => {
	if (options?.locator) {
		const box = await options.locator.boundingBox();
		if (!box) {
			throw new Error("Could not get bounding box for locator");
		}

		await expect.soft(storyPage).toHaveScreenshot(`${name}.png`, {
			// Adding a 10px boundary around the element to capture any shadows or outlines
			clip: {
				x: Math.max(0, box.x - 10),
				y: Math.max(0, box.y - 10),
				width: box.width + 20,
				height: box.height + 20,
			},
			threshold: 0.01, // Strict colour matching
			maxDiffPixelRatio: 0.01, // Allow a small percentage of pixels to differ
			maxDiffPixels: 50,
			mask: options.mask,
		});
		return;
	}

	const target = options?.fullscreen ? storyPage : storyPage.locator("body");

	await expect.soft(target).toHaveScreenshot(`${name}.png`, {
		fullPage: false,
		threshold: 0.01, // Strict colour matching
		maxDiffPixelRatio: 0.01, // Allow a small percentage of pixels to differ
		maxDiffPixels: 50,
		mask: options?.mask,
	});
};
