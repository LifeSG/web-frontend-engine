import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IUnitNumberFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
import {
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Unit Number";
const UI_TYPE = "unit-number-field";
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: COMPONENT_LABEL,
					uiType: UI_TYPE,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<IUnitNumberFieldSchema>, overrideSchema?: TOverrideSchema) => {
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

const getFloorInputField = (): HTMLElement => {
	return getField("textbox", "floor-input");
};

const getUnitInputField = (): HTMLElement => {
	return getField("textbox", "unit-input");
};

const setFieldValue = (floor: string, unit: string) => {
	fireEvent.change(getFloorInputField(), { target: { value: floor } });
	fireEvent.change(getUnitInputField(), { target: { value: unit } });
};

describe(UI_TYPE, () => {
	beforeEach(() => {
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
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getFloorInputField()).toBeDisabled();
		expect(getUnitInputField()).toBeDisabled();
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

			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: unitNumberValue }));
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
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
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
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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
			setFieldValue("12", "34");
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "01-02" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			setFieldValue("12", "34");
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "01-02" } }}
					onClick={handleClick}
				/>
			);
			setFieldValue("12", "34");
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
});
