import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IUnitNumberFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { ERROR_MESSAGES } from "../../../../components/shared";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Unit Number";
const UI_TYPE = "unit-number-field";

const renderComponent = (overrideField?: TOverrideField<IUnitNumberFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: COMPONENT_LABEL,
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

const getFloorInputField = (): HTMLElement => {
	return getField("textbox", "floor-input");
};

const getUnitInputField = (): HTMLElement => {
	return getField("textbox", "unit-input");
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
			const UnitNumber = "20";
			const UnitNumberValue = `${floorNumber}-${UnitNumber}`;
			renderComponent({ validation: [{ required: true }] });

			fireEvent.change(getFloorInputField(), { target: { value: floorNumber } });
			fireEvent.change(getUnitInputField(), { target: { value: UnitNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: UnitNumberValue }));
		});

		it("03- should be an invalid unit number", async () => {
			const floorNumber = "03";
			const UnitNumber = "";
			renderComponent({ validation: [{ required: true }] });

			fireEvent.change(getFloorInputField(), { target: { value: floorNumber } });
			fireEvent.change(getUnitInputField(), { target: { value: UnitNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGES.UNIT_NUMBER.INVALID)).toBeInTheDocument();
		});
	});
});
