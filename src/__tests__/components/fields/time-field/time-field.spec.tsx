import { LocalTime } from "@js-joda/core";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ITimeFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const uiType = "time-field";

const renderComponent = (overrideField?: TOverrideField<ITimeFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Time",
				uiType,
				...overrideField,
			},
			...getSubmitButtonProps(),
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

const getTimePicker = (): HTMLElement => {
	return getField("textbox");
};

const getMinuteButton = (): HTMLElement => {
	return getField("button", "increase minute");
};

const getHourButton = (): HTMLElement => {
	return getField("button", "increase hour");
};

const getConfirmButton = (): HTMLElement => {
	return getField("button", "confirm selection");
};

describe(uiType, () => {
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

		expect(getTimePicker()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "11:11am";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getTimePicker()).toBeDisabled();
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(getTimePicker()).toHaveAttribute("placeholder", placeholder);
	});

	it("should be able to select hour and minutes", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getTimePicker()));

		await waitFor(() => fireEvent.click(getMinuteButton()));
		await waitFor(() => fireEvent.click(getHourButton()));
		await waitFor(() => fireEvent.click(getConfirmButton()));

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: "01:00am" }));
	});

	it("should be able to display current time if useCurrentTime=true", () => {
		const time = "12:00";
		jest.spyOn(LocalTime, "now").mockReturnValue(LocalTime.parse(time));
		renderComponent({ useCurrentTime: true });

		expect(getTimePicker()).toHaveAttribute("value", `${time}pm`);
	});

	it("should be able to support 24 hour time format", async () => {
		renderComponent({ is24HourFormat: true });

		await waitFor(() => fireEvent.click(getTimePicker()));

		await waitFor(() => fireEvent.click(getMinuteButton()));
		await waitFor(() => fireEvent.click(getHourButton()));
		await waitFor(() => fireEvent.click(getConfirmButton()));

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: "01:00" }));
	});
});
