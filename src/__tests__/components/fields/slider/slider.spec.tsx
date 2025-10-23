import { Form } from "@lifesg/react-design-system/form";
import { FormSliderProps } from "@lifesg/react-design-system/form/types";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { ISliderSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "slider";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Slider",
					uiType: UI_TYPE,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<ISliderSchema>, overrideSchema?: TOverrideSchema) => {
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

const getSlider = (): HTMLElement => {
	return getField("slider");
};

const changeSliderValue = (sliderSpy: jest.SpyInstance<React.JSX.Element, [FormSliderProps]>, value: number) => {
	act(() => sliderSpy.mock.lastCall[0].onChangeEnd(value));
};

describe(UI_TYPE, () => {
	let sliderSpy: jest.SpyInstance<React.JSX.Element, [FormSliderProps]>;

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

		it("should set form state as dirty if user modifies the field", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			changeSliderValue(sliderSpy, 15);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: 50 } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			changeSliderValue(sliderSpy, 15);
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: 50 } }}
					onClick={handleClick}
				/>
			);
			changeSliderValue(sliderSpy, 15);
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
	warningTestSuite<ISliderSchema>({ label: "Slider", uiType: UI_TYPE });
});
