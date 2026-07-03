import { fireEvent, screen, waitFor } from "@testing-library/react";
import { IUnitNumberFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { createRenderComponent, getResetButton, getSubmitButton } from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Unit Number";
const UI_TYPE = "unit-number-field";

const renderComponent = createRenderComponent<IUnitNumberFieldSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: COMPONENT_LABEL,
		uiType: UI_TYPE,
	},
	submitFn: SUBMIT_FN,
});

const getFloorInputField = (): HTMLElement => {
	return screen.getByTestId("floor-input");
};

const getUnitInputField = (): HTMLElement => {
	return screen.getByTestId("unit-input");
};

const setFieldValue = (floor: string, unit: string) => {
	fireEvent.change(getFloorInputField(), { target: { value: floor } });
	fireEvent.change(getUnitInputField(), { target: { value: unit } });
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getFloorInputField()).toBeInTheDocument();
		expect(getUnitInputField()).toBeInTheDocument();
	});

	it("should be able to support default value", async () => {
		const defaultFloor = "01";
		const defaultUnit = "19";
		const defaultValue = `${defaultFloor}-${defaultUnit}`;
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getFloorInputField()).toHaveAttribute("value", defaultFloor);
		expect(getUnitInputField()).toHaveAttribute("value", defaultUnit);
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getFloorInputField()).toHaveAttribute("aria-disabled", "true");
		expect(getUnitInputField()).toHaveAttribute("aria-disabled", "true");
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "00-8888";
		renderComponent({ placeholder });

		expect(getFloorInputField()).toHaveAttribute("placeholder", placeholder.split("-")[0]);
		expect(getUnitInputField()).toHaveAttribute("placeholder", placeholder.split("-")[1]);
	});

	describe("it should be able to verify unit numbers", () => {
		it("01-20 should be a valid unit number", async () => {
			const floorNumber = "01";
			const unitNumber = "20";
			const unitNumberValue = `${floorNumber}-${unitNumber}`;
			renderComponent({ validation: [{ required: true }] });

			setFieldValue(floorNumber, unitNumber);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: unitNumberValue }));
		});

		it("03- should be an invalid unit number", async () => {
			const floorNumber = "03";
			const unitNumber = "";
			renderComponent({ validation: [{ required: true }] });

			setFieldValue(floorNumber, unitNumber);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGES.UNIT_NUMBER.INVALID)).toBeInTheDocument();
		});

		it("03- should be display with custom error message", async () => {
			const floorNumber = "03";
			const unitNumber = "";
			const customError = "Please enter a valid unit number.";
			renderComponent({ validation: [{ unitNumberFormat: true, errorMessage: customError }] });

			setFieldValue(floorNumber, unitNumber);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(customError)).toBeInTheDocument();
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			const floorNumber = "01";
			const unitNumber = "20";
			renderComponent();

			setFieldValue(floorNumber, unitNumber);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getFloorInputField()).toHaveValue("");
			expect(getUnitInputField()).toHaveValue("");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultFloor = "01";
			const defaultUnit = "20";
			const defaultValue = `${defaultFloor}-${defaultUnit}`;
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			setFieldValue("12", "34");
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getFloorInputField()).toHaveValue(defaultFloor);
			expect(getUnitInputField()).toHaveValue(defaultUnit);
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: "01-02",
		modifyField: () => setFieldValue("12", "34"),
	});

	labelTestSuite(renderComponent);
	warningTestSuite<IUnitNumberFieldSchema>({ label: COMPONENT_LABEL, uiType: UI_TYPE });
});
