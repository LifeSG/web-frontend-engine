import { Form, FormSliderProps } from "@lifesg/react-design-system/form";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { ISliderSchema } from "../../../../components/fields";
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
const UI_TYPE = "slider";

const renderComponent = createRenderComponent<ISliderSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: "Slider",
		uiType: UI_TYPE,
	},
	submitFn: SUBMIT_FN,
});

const getSlider = (): HTMLElement => {
	return getField("slider");
};

const changeSliderValue = (sliderSpy: jest.SpyInstance<JSX.Element, [FormSliderProps]>, value: number) => {
	act(() => sliderSpy.mock.lastCall[0].onChangeEnd(value));
};

describe(UI_TYPE, () => {
	let sliderSpy: jest.SpyInstance<JSX.Element, [FormSliderProps]>;

	beforeEach(() => {
		jest.restoreAllMocks();
		sliderSpy = jest.spyOn(Form, "Slider");
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getSlider()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = 50;
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	describe.each`
		condition               | rule                                                             | invalid | valid
		${"min"}                | ${[{ min: 5, errorMessage: ERROR_MESSAGE }]}                     | ${4}    | ${5}
		${"max"}                | ${[{ max: 5, errorMessage: ERROR_MESSAGE }]}                     | ${6}    | ${5}
		${"increment"}          | ${[{ increment: 2, errorMessage: ERROR_MESSAGE }]}               | ${1}    | ${10}
		${"increment from min"} | ${[{ min: 5 }, { increment: 0.5, errorMessage: ERROR_MESSAGE }]} | ${5.1}  | ${7.5}
	`("$condition validation", ({ rule, invalid, valid }) => {
		it("should show error message for invalid value", async () => {
			renderComponent({ validation: rule });

			changeSliderValue(sliderSpy, invalid);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).toBeInTheDocument();
		});

		it("should not show error message for valid value", async () => {
			renderComponent({ validation: rule }, { defaultValues: { [COMPONENT_ID]: valid } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getSlider()).toHaveAttribute("aria-disabled", "true");
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			changeSliderValue(sliderSpy, 15);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = 50;
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			changeSliderValue(sliderSpy, 15);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: 50,
		modifyField: () => changeSliderValue(sliderSpy, 15),
	});

	labelTestSuite(renderComponent);
	warningTestSuite<ISliderSchema>({ label: "Slider", uiType: UI_TYPE });
});
