import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IFrontendEngineRef, TFrontendEngineFieldSchema } from "../../../components";
import { FrontendEngineWithCustomButton, getField, getSubmitButton, getSubmitButtonProps } from "../helper";

export const warningTestSuite = <T,>(fieldSchema: T) =>
	describe("warning", () => {
		const fieldId = "field";
		const message = "Warning message";

		beforeEach(() => {
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current?.setWarnings({ [fieldId]: message });
			};

			render(
				<FrontendEngineWithCustomButton
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[fieldId]: fieldSchema as TFrontendEngineFieldSchema,
									...getSubmitButtonProps(),
								},
							},
						},
					}}
					onClick={handleClick}
				/>
			);
		});

		it("should not render warning by default", () => {
			expect(screen.queryByTestId(`${fieldId}__warning`)).not.toBeInTheDocument();
			expect(screen.queryByText(message)).not.toBeInTheDocument();
		});

		it("should be able to render warning via setWarnings()", () => {
			fireEvent.click(getField("button", "Custom Button"));

			expect(screen.getByText(message)).toBeInTheDocument();
		});

		it("should clear warnings on submit", async () => {
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.queryByText(message)).not.toBeInTheDocument();
		});
	});
