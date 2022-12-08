import { LocalTime } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ITimePickerSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideField, TOverrideSchema } from "../../../common";

// NOTE: Timepicker internally uses ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "time";
const componentTestId = TestHelper.generateId(componentId, fieldType);
const hourButtonId = `${componentId}-base-hour-increment-button`;
const minuteButtonId = `${componentId}-base-minute-increment-button`;
const confirmButtonId = `${componentId}-base-confirm-button`;

const renderComponent = (overrideField?: TOverrideField<ITimePickerSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			[componentId]: {
				label: "TimePicker",
				fieldType,
				...overrideField,
			},
			submit: {
				label: "Submit",
				fieldType: "submit",
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

describe(fieldType, () => {
	it("should be able to render the field", () => {
		renderComponent();
		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "11:11am";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: undefined }));
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(screen.getByTestId(componentTestId).querySelector("input")).toHaveAttribute("placeholder", placeholder);
	});

	it("should be able to select hour and minutes", async () => {
		renderComponent();

		const picker = screen.getByTestId(componentTestId).querySelector("input");
		await waitFor(() => fireEvent.click(picker));

		await waitFor(() => fireEvent.click(screen.getByTestId(hourButtonId))); // Increment hours
		await waitFor(() => fireEvent.click(screen.getByTestId(minuteButtonId))); // Increment minutes
		await waitFor(() => fireEvent.click(screen.getByTestId(confirmButtonId)));

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: "01:00am" }));
	});

	it("should be able to display current time if useCurrentTime=true", () => {
		const time = "12:00";
		jest.spyOn(LocalTime, "now").mockReturnValue(LocalTime.parse(time));
		renderComponent({ useCurrentTime: true });

		expect(screen.getByTestId(componentTestId).querySelector("input")).toHaveAttribute("value", `${time}pm`);
	});

	it("should be able to support 24 hour time format", async () => {
		renderComponent({ is24HourFormat: true });

		const picker = screen.getByTestId(componentTestId).querySelector("input");
		await waitFor(() => fireEvent.click(picker));

		await waitFor(() => fireEvent.click(screen.getByTestId(hourButtonId))); // Increment hours
		await waitFor(() => fireEvent.click(screen.getByTestId(minuteButtonId))); // Increment minutes
		await waitFor(() => fireEvent.click(screen.getByTestId(confirmButtonId)));

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: "01:00" }));
	});
});
