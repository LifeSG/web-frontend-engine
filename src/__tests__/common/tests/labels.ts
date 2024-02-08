import { fireEvent, screen } from "@testing-library/react";

export const labelTestSuite = (renderComponent: (overrideField: unknown) => void) =>
	describe("labels", () => {
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

			expect(document.querySelector("form").innerHTML.includes("script")).toBe(false);
		});
	});
