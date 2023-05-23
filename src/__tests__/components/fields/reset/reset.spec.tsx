import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import _ from "lodash";
import { FrontendEngine } from "../../../../components";
import { IResetButtonSchema } from "../../../../components/fields";
import { IFrontendEngineData, TFrontendEngineValues } from "../../../../components/types";
import { FRONTEND_ENGINE_ID, getField, getSubmitButton, getSubmitButtonProps } from "../../../common";

const TEXT_ID = "field";
const TEXT_LABEL = "Textfield";

const CHECKBOX_ID = "checkbox";
const CHECKBOX_LABEL = "Checkbox";

const RESET_BUTTON_ID = "reset";
const RESET_BUTTON_LABEL = "Reset";

const SUBMIT_FN = jest.fn();

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
					[TEXT_ID]: {
						label: TEXT_LABEL,
						uiType: "text-field",
					},
					[CHECKBOX_ID]: {
						label: CHECKBOX_LABEL,
						uiType: "checkbox",
						options: [{ label: "A", value: "Apple" }],
					},
					[RESET_BUTTON_ID]: {
						label: RESET_BUTTON_LABEL,
						uiType: "reset",
						...overrideReset,
					},
					...getSubmitButtonProps(),
				},
			},
		},
		defaultValues: overrideDefaultValue,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getTextfield = (): HTMLElement => {
	return getField("textbox", TEXT_LABEL);
};

const getResetButton = (): HTMLElement => {
	return screen.getByRole("button", { name: RESET_BUTTON_LABEL });
};

describe("reset", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it.each`
		result     | description
		${"hello"} | ${"is set"}
		${""}      | ${"is not set"}
	`("reset the form on press to $description when default value is not set", async ({ result }) => {
		renderComponent(undefined, _.isEmpty(result) ? undefined : { [TEXT_ID]: "hello" });

		const textfield = getTextfield();

		expect(textfield).toHaveValue(result);
		fireEvent.change(textfield, { target: { value: "goodbye" } });
		expect(textfield).toHaveValue("goodbye");

		await waitFor(() => fireEvent.click(getResetButton()));
		expect(textfield).toHaveValue(result);
	});

	it("reset the form on press when default value is set, ignoreDefaultValue:true", async () => {
		renderComponent({ ignoreDefaultValues: true }, { [CHECKBOX_ID]: ["Apple"], [TEXT_ID]: "hello" });

		await waitFor(() => fireEvent.click(getResetButton()));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [CHECKBOX_ID]: [], [TEXT_ID]: "" }));
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getResetButton()).toBeDisabled();
	});
});
