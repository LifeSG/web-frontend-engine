import { Form } from "@lifesg/react-design-system/form";
import { FormHistogramSliderProps } from "@lifesg/react-design-system/form";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IHistogramSliderSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	createRenderComponent,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "histogram-slider";

const renderComponent = createRenderComponent<IHistogramSliderSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: "Histogram slider",
		uiType: UI_TYPE,
		bins: [
			{ minValue: 10, count: 1 },
			{ minValue: 20, count: 0 },
			{ minValue: 30, count: 3 },
			{ minValue: 90, count: 3 },
		],
		interval: 10,
	},
	submitFn: SUBMIT_FN,
});

const changeSliderValue = (
	sliderSpy: jest.SpyInstance<JSX.Element, [FormHistogramSliderProps]>,
	value: [number, number]
) => {
	act(() => sliderSpy.mock.lastCall[0].onChangeEnd(value));
};

describe(UI_TYPE, () => {
	let sliderSpy: jest.SpyInstance<JSX.Element, [FormHistogramSliderProps]>;

	beforeEach(() => {
		jest.restoreAllMocks();
		sliderSpy = jest.spyOn(Form, "HistogramSlider");
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.queryAllByRole("slider")).toHaveLength(2);
	});

	it("should initialise selection to all bins if no value is provided", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: { from: 10, to: 100 } }));
	});

	it("should be able to support default values", async () => {
		const defaultValue = { from: 10, to: 50 };
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it.each`
		validation            | invalid
		${"from is required"} | ${{ from: undefined, to: 20 }}
		${"to is required"}   | ${{ from: 20, to: undefined }}
	`("should validate that $validation", async ({ invalid }) => {
		renderComponent(
			{ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] },
			{ defaultValues: { [COMPONENT_ID]: invalid } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	describe.each`
		validation                | rule             | invalid
		${"from is a bin value"}  | ${"bin"}         | ${{ from: 1, to: 50 }}
		${"to is a bin value"}    | ${"bin"}         | ${{ from: 10, to: 45 }}
		${"from is less than to"} | ${"incremental"} | ${{ from: 50, to: 10 }}
		${"from is within range"} | ${"withinRange"} | ${{ from: 0, to: 50 }}
		${"to is within range"}   | ${"withinRange"} | ${{ from: 10, to: 110 }}
	`("validate $validation", ({ rule, invalid }) => {
		it("should perform validation", async () => {
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: invalid } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.queryByText(ERROR_MESSAGES.SLIDER.MUST_BE_INCREMENTAL)).toBeInTheDocument();
		});

		it("allow customising the error messsage", async () => {
			renderComponent(
				{ validation: [{ [rule]: true, errorMessage: ERROR_MESSAGE }] },
				{ defaultValues: { [COMPONENT_ID]: invalid } }
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		const sliders = screen.queryAllByRole("slider");
		for (const slider of sliders) {
			expect(slider).toHaveAttribute("aria-disabled", "true");
		}
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			changeSliderValue(sliderSpy, [20, 60]);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: { from: 10, to: 100 } }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = { from: 10, to: 50 };
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			changeSliderValue(sliderSpy, [20, 60]);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: { from: 10, to: 50 },
		modifyField: () => changeSliderValue(sliderSpy, [20, 60]),
	});

	labelTestSuite(renderComponent);
	warningTestSuite<IHistogramSliderSchema>({
		label: "Histogram slider",
		uiType: UI_TYPE,
		bins: [
			{ minValue: 10, count: 1 },
			{ minValue: 20, count: 0 },
			{ minValue: 30, count: 3 },
			{ minValue: 90, count: 3 },
		],
		interval: 10,
	});
});
