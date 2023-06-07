import { fireEvent, render, waitFor } from "@testing-library/react";
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
	getResetButton,
	getResetButtonProps,
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
					...getResetButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
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

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();
			const yes = getSwitchButton("Yes");

			fireEvent.click(yes);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(yes).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = true;
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			const yes = getSwitchButton("Yes");
			const no = getSwitchButton("No");

			fireEvent.click(no);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(yes).toBeChecked();
			expect(no).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});
});
