import { LocalTime } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ITimePickerSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	SUBMIT_BUTTON_ID,
	SUBMIT_BUTTON_NAME,
	TOverrideField,
	TOverrideSchema,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "time";

const renderComponent = (overrideField?: TOverrideField<ITimePickerSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "TimePicker",
				fieldType,
				...overrideField,
			},
			[SUBMIT_BUTTON_ID]: {
				label: "Submit",
				fieldType: "submit",
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();

		// NOTE: Timepicker internally uses ResizeObserver
		global.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByRole("generic", { name: componentId })).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "11:11am";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		const picker = screen.getByRole("generic", { name: componentId }).querySelector("input");
		expect(picker).toHaveAttribute("disabled");
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		const picker = screen.getByRole("generic", { name: componentId }).querySelector("input");
		expect(picker).toHaveAttribute("placeholder", placeholder);
	});

	it("should be able to select hour and minutes", async () => {
		renderComponent();

		const picker = screen.getByRole("generic", { name: componentId }).querySelector("input");
		await waitFor(() => fireEvent.click(picker));

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "increase minute" })));
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "increase hour" })));
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "confirm selection" })));

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: "01:00am" }));
	});

	it("should be able to display current time if useCurrentTime=true", () => {
		const time = "12:00";
		jest.spyOn(LocalTime, "now").mockReturnValue(LocalTime.parse(time));
		renderComponent({ useCurrentTime: true });

		const picker = screen.getByRole("generic", { name: componentId }).querySelector("input");
		expect(picker).toHaveAttribute("value", `${time}pm`);
	});

	it("should be able to support 24 hour time format", async () => {
		renderComponent({ is24HourFormat: true });

		const picker = screen.getByRole("generic", { name: componentId }).querySelector("input");
		await waitFor(() => fireEvent.click(picker));

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "increase minute" })));
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "increase hour" })));
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "confirm selection" })));

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: "01:00" }));
	});
});
