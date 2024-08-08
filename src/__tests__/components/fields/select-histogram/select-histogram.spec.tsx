import { Form } from "@lifesg/react-design-system/form";
import { FormSelectHistogramSliderProps } from "@lifesg/react-design-system/form/types";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { ISelectHistogramSchema } from "../../../../components/fields/select-histogram/types";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "select-histogram";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Select Histogram",
					uiType: UI_TYPE,
					bins: [
						{ minValue: 10, count: 1 },
						{ minValue: 20, count: 0 },
						{ minValue: 30, count: 3 },
						{ minValue: 90, count: 3 },
					],
					interval: 10,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<ISelectHistogramSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), overrideSchema);
	merge(json, {
		sections: {
			section: {
				children: {
					[COMPONENT_ID]: overrideField,
				},
			},
		},
	});

	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getSelector = (): HTMLElement => {
	return screen.getByTestId("select-histogram-selector");
};

const changeSliderValue = (
	sliderSpy: jest.SpyInstance<JSX.Element, [FormSelectHistogramSliderProps]>,
	value: [number, number]
) => {
	act(() => sliderSpy.mock.lastCall[0].histogramSlider.onChangeEnd(value));
};

describe(UI_TYPE, () => {
	let sliderSpy: jest.SpyInstance<JSX.Element, [FormSelectHistogramSliderProps]>;

	beforeEach(() => {
		jest.restoreAllMocks();
		sliderSpy = jest.spyOn(Form, "SelectHistogram");
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getSelector()).toBeVisible();
		expect(screen.getByText("10")).toBeVisible(); // show min value in the selector
		expect(screen.getByText("-")).toBeVisible(); // show separator in the selector
		expect(screen.getByText("100")).toBeVisible(); // show max value in the selector
	});

	it("should initialize selection to all bins if no value is provided", async () => {
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

	it.each`
		validation                | invalid
		${"from is a bin value"}  | ${{ from: 1, to: 50 }}
		${"to is a bin value"}    | ${{ from: 10, to: 45 }}
		${"from is less than to"} | ${{ from: 50, to: 10 }}
		${"from is within range"} | ${{ from: 0, to: 50 }}
		${"to is within range"}   | ${{ from: 10, to: 110 }}
	`("should validate that $validation", async ({ invalid }) => {
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: invalid } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.queryByText(ERROR_MESSAGES.SLIDER.MUST_BE_INCREMENTAL)).toBeInTheDocument();
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

	describe("dirty state", () => {
		let formIsDirty: boolean;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};

		beforeEach(() => {
			formIsDirty = undefined;
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			changeSliderValue(sliderSpy, [20, 60]);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: { from: 10, to: 50 } } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			changeSliderValue(sliderSpy, [20, 60]);
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: { from: 10, to: 50 } } }}
					onClick={handleClick}
				/>
			);
			changeSliderValue(sliderSpy, [20, 60]);
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
	warningTestSuite<ISelectHistogramSchema>({
		label: "Select Histogram",
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
