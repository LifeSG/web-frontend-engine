import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { ISwitchSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "switch";

const getSwitchButton = (type: "Yes" | "No"): HTMLElement => {
	return getField("radio", type);
};

const renderComponent = (overrideField?: TOverrideField<ISwitchSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Switch",
						uiType: UI_TYPE,
						...overrideField,
					},
					...getSubmitButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

describe("switch toggle button", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
		// screen.debug();
		expect(getSwitchButton("Yes")).toBeInTheDocument();
		expect(getSwitchButton("No")).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = true;
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(getSwitchButton("Yes")).toBeChecked();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured for component", async () => {
		renderComponent({ disabled: true });

		expect(getSwitchButton("Yes")).toBeDisabled();
		expect(getSwitchButton("No")).toBeDisabled();
	});

	it.each`
		scenario                                                           | switchButtonType | expectedValue
		${"should submit true when the user select the Yes switch button"} | ${"Yes"}         | ${true}
		${"should submit false when the user select the No switch button"} | ${"No"}          | ${false}
	`("$scenario", async ({ switchButtonType, expectedValue }) => {
		renderComponent();

		fireEvent.click(getSwitchButton(switchButtonType));
		expect(getSwitchButton(switchButtonType)).toBeChecked();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValue }));
	});
});
