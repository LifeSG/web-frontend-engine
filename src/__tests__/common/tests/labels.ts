import { fireEvent, screen } from "@testing-library/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const labelTestSuite = (renderComponent: (overrideField?: any) => void) =>
	describe("labels", () => {
		const getComputedStyle = window.getComputedStyle.bind(window);

		beforeAll(() => {
			// FIXME:  Opening the design-system popover makes Floating UI call getComputedStyle.
			// In jsdom, that can hit a known nwsapi invalid-selector bug: https://github.com/dperini/nwsapi/issues/157
			// As a workaround, overriding getComputedStyle to catch and ignore that specific error.
			window.getComputedStyle = (...args) => {
				try {
					return getComputedStyle(...args);
				} catch (error) {
					if (error instanceof SyntaxError || /not a valid selector/.test(`${error}`)) {
						return document.documentElement.style;
					}
					throw error;
				}
			};
		});

		afterAll(() => {
			window.getComputedStyle = getComputedStyle;
		});

		it("should be able to render sub label and hint", () => {
			renderComponent({
				label: {
					mainLabel: "Main label",
					subLabel: "Sub label",
					hint: { content: "Hint" },
				},
			});
			fireEvent.click(screen.getByTestId("field-popover"));

			expect(screen.getByText("Main label")).toBeInTheDocument();
			expect(screen.getByText("Sub label")).toBeInTheDocument();
			expect(screen.getByText("Hint")).toBeVisible();
		});

		it("should be able to render HTML string in label, sub label and hint", () => {
			renderComponent({
				label: {
					mainLabel: "<strong>Main label</strong>",
					subLabel: "<strong>Sub label</strong>",
					hint: { content: "<strong>Hint</strong>" },
				},
			});
			fireEvent.click(screen.getByTestId("field-popover"));

			expect(screen.getByText("Main label").nodeName).toBe("STRONG");
			expect(screen.getByText("Sub label").nodeName).toBe("STRONG");
			expect(screen.getByText("Hint").nodeName).toBe("STRONG");
		});

		it("should be able to sanitise HTML string in label, sub label and hint", () => {
			renderComponent({
				label: {
					mainLabel: "Main label<script>console.log('hello world')</script>",
					subLabel: "Sub label<script>console.log('hello world')</script>",
					hint: { content: "Hint<script>console.log('hello world')</script>" },
				},
			});
			fireEvent.click(screen.getByTestId("field-popover"));

			expect(document.querySelector("form script")).toBeNull();
		});
	});
