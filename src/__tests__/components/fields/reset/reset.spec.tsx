import { fireEvent, render, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IResetButtonSchema } from "../../../../components/fields";
import { IFrontendEngineData, TFrontendEngineValues } from "../../../../components/types";
import { FRONTEND_ENGINE_ID, RESET_BUTTON_ID, RESET_BUTTON_LABEL, getField, getResetButton } from "../../../common";

const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Textfield";

const renderComponent = (
	overrideReset?: Partial<IResetButtonSchema> | undefined,
	overrideDefaultValue?: TFrontendEngineValues
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: COMPONENT_LABEL,
						uiType: "text-field",
						validation: [{ required: true }],
					},
					[RESET_BUTTON_ID]: {
						label: RESET_BUTTON_LABEL,
						uiType: "reset",
						...overrideReset,
					},
				},
			},
		},
		defaultValues: overrideDefaultValue,
	};
	return render(<FrontendEngine data={json} />);
};

const getTextfield = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

describe("reset", () => {
	it("should reset the form on press", async () => {
		renderComponent();

		const textfield = getTextfield();
		fireEvent.change(textfield, { target: { value: "hello" } });
		expect(textfield).toHaveValue("hello");

		await waitFor(() => fireEvent.click(getResetButton()));
		expect(textfield).toHaveValue("");
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getResetButton()).toBeDisabled();
	});

	it("should reset the form to the default value on press", async () => {
		renderComponent(undefined, { [COMPONENT_ID]: "hello" });

		const textfield = getTextfield();

		expect(textfield).toHaveValue("hello");
		fireEvent.change(textfield, { target: { value: "goodbye" } });
		expect(textfield).toHaveValue("goodbye");

		await waitFor(() => fireEvent.click(getResetButton()));
		expect(textfield).toHaveValue("hello");
	});
});
