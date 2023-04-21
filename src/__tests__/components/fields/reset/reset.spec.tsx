import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IResetButtonSchema } from "../../../../components/fields";
import { IFrontendEngineData, TFrontendEngineValues } from "../../../../components/types";
import { FRONTEND_ENGINE_ID, getField } from "../../../common";

const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Textfield";

const RESET_BUTTON_ID = "reset";
const RESET_BUTTON_LABEL = "Reset";

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

const getResetButton = (): HTMLElement => {
	return screen.getByRole("button", { name: RESET_BUTTON_LABEL });
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

	it.each`
		keepDefaultValues | result     | description
		${true}           | ${"hello"} | ${"default value"}
		${false}          | ${""}      | ${"empty"}
	`(
		"reset the form to $description on press if keepDefaultValues is set to $keepDefaultValues",
		async ({ keepDefaultValues, result }) => {
			renderComponent({ keepDefaultValues }, { [COMPONENT_ID]: "hello" });

			const textfield = getTextfield();

			expect(textfield).toHaveValue("hello");
			fireEvent.change(textfield, { target: { value: "goodbye" } });
			expect(textfield).toHaveValue("goodbye");

			await waitFor(() => fireEvent.click(getResetButton()));
			expect(textfield).toHaveValue(result);
		}
	);
});
