import { LocalTime } from "@js-joda/core";
import { fireEvent, waitFor } from "@testing-library/react";
import { ITimeFieldSchema } from "../../../../components/fields";
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
const COMPONENT_LABEL = "Time";
const UI_TYPE = "time-field";

const renderComponent = createRenderComponent<ITimeFieldSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: COMPONENT_LABEL,
		uiType: UI_TYPE,
	},
	submitFn: SUBMIT_FN,
});

const getTimePicker = (): HTMLElement => {
	return getField("combobox");
};

const getMinuteButton = (): HTMLElement => {
	return getField("button", "increase minute");
};

const getHourButton = (): HTMLElement => {
	return getField("button", "increase hour");
};

const getConfirmButton = (): HTMLElement => {
	return getField("button", "Done");
};

const pickValidTime = async () => {
	await waitFor(() => fireEvent.click(getTimePicker()));
	await waitFor(() => fireEvent.click(getMinuteButton()));
	await waitFor(() => fireEvent.click(getHourButton()));
	await waitFor(() => fireEvent.click(getConfirmButton()));
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getTimePicker()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "11:11AM";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getTimePicker()).toHaveAttribute("aria-disabled", "true");
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(getTimePicker()).toHaveAttribute("placeholder", placeholder);
	});

	it("should be able to select hour and minutes", async () => {
		renderComponent();
		await pickValidTime();
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "01:00AM" }));
	});

	it("should be able to display current time if useCurrentTime=true", async () => {
		const time = "12:00";
		jest.spyOn(LocalTime, "now").mockReturnValue(LocalTime.parse(time));
		renderComponent({ useCurrentTime: true });

		await waitFor(() => expect(getTimePicker()).toHaveValue(`${time}pm`));
	});

	it("should be able to support 24 hour time format", async () => {
		renderComponent({ is24HourFormat: true });
		await pickValidTime();
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "01:00" }));
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();
			await pickValidTime();
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => expect(getTimePicker()).toHaveValue(""));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "11:11am";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });
			await pickValidTime();
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => expect(getTimePicker()).toHaveValue(defaultValue));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});

		it("should revert to current time on reset", async () => {
			const currentTime = "12:00";
			jest.spyOn(LocalTime, "now").mockReturnValue(LocalTime.parse(currentTime));
			renderComponent({ useCurrentTime: true });
			await pickValidTime();
			fireEvent.click(getResetButton());
			await waitFor(() => expect(getTimePicker()).toHaveValue(`${currentTime}pm`));

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: `${currentTime}PM` }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: "hello",
		modifyField: () => pickValidTime(),
	});

	labelTestSuite(renderComponent);
	warningTestSuite<ITimeFieldSchema>({ label: COMPONENT_LABEL, uiType: UI_TYPE });
});
