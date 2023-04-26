import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import _ from "lodash";
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
	it.each`
		result     | description
		${"hello"} | ${"is set"}
		${""}      | ${"is not set"}
	`("reset the form to on press to $description when default value is not set", async ({ result }) => {
		renderComponent(undefined, _.isEmpty(result) ? undefined : { [COMPONENT_ID]: "hello" });

		const textfield = getTextfield();

		expect(textfield).toHaveValue(result);
		fireEvent.change(textfield, { target: { value: "goodbye" } });
		expect(textfield).toHaveValue("goodbye");

		await waitFor(() => fireEvent.click(getResetButton()));
		expect(textfield).toHaveValue(result);
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getResetButton()).toBeDisabled();
	});
});
