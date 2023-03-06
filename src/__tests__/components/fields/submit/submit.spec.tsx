import { fireEvent, render, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ISubmitButtonSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import { FRONTEND_ENGINE_ID, SUBMIT_BUTTON_ID, SUBMIT_BUTTON_LABEL, getField, getSubmitButton } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const componentLabel = "Textfield";

const renderComponent = (overrideSubmit?: Partial<ISubmitButtonSchema> | undefined) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: componentLabel,
				fieldType: "text",
				validation: [{ required: true }],
			},
			[SUBMIT_BUTTON_ID]: {
				label: SUBMIT_BUTTON_LABEL,
				fieldType: "submit",
				...overrideSubmit,
			},
		},
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

const getTextfield = (): HTMLElement => {
	return getField("textbox", componentLabel);
};

describe("submit", () => {
	it("should submit the form on press", async () => {
		renderComponent();
		fireEvent.change(getTextfield(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(submitFn).toBeCalled();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getSubmitButton()).toBeDisabled();
	});

	it("should be disabled if disabled=invalid-form and form is invalid", async () => {
		renderComponent({ disabled: "invalid-form" });
		expect(getSubmitButton()).toBeDisabled();

		fireEvent.change(getTextfield(), { target: { value: "hello" } });
		expect(getSubmitButton()).not.toBeDisabled();
	});
});
