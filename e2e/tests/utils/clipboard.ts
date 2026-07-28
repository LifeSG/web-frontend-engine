import type { Page } from "@playwright/test";

/**
 * Copies the given text to the system clipboard by creating a hidden DOM element,
 * selecting its contents, and triggering a native Ctrl/Cmd+C keypress.
 * This avoids the need to grant clipboard-write permissions.
 */
export const copyTextToClipboard = async (page: Page, text: string) => {
	await page.evaluate((textToCopy) => {
		const div = document.createElement("div");
		div.innerText = textToCopy;
		div.style.cssText =
			"clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px;";
		document.body.appendChild(div);

		const range = document.createRange();
		range.selectNodeContents(div);

		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	}, text);

	await page.keyboard.press("ControlOrMeta+C");
};
