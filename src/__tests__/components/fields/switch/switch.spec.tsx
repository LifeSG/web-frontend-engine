import { fireEvent, waitFor } from "@testing-library/react";
import { ISwitchSchema } from "../../../../components/fields";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getField,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "switch";

const renderComponent = createRenderComponent<ISwitchSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: "Switch",
		uiType: UI_TYPE,
	},
	submitFn: SUBMIT_FN,
});

const getSwitchButton = (type: "Yes" | "No"): HTMLElement => {
	return getField("radio", type);
};

describe(UI_TYPE, () => {
	afterEach(() => {
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
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValue }));
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();
			const yes = getSwitchButton("Yes");

			fireEvent.click(yes);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(yes).not.toBeChecked();
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
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
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: ["Apple"],
		modifyField: () => fireEvent.click(getSwitchButton("Yes")),
	});

	labelTestSuite(renderComponent);
	warningTestSuite<ISwitchSchema>({ label: "Switch", uiType: UI_TYPE });
});
