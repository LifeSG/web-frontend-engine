import { LocalTime } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { ITimeFieldSchema } from "../../../../components/fields";
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

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Time";
const UI_TYPE = "time-field";
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

const renderComponent = (overrideField?: TOverrideField<ITimeFieldSchema>, overrideSchema?: TOverrideSchema) => {
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

const pickValidTime = async () => {
	await waitFor(() => fireEvent.click(getTimePicker()));
	await waitFor(() => fireEvent.click(getMinuteButton()));
	await waitFor(() => fireEvent.click(getHourButton()));
	await waitFor(() => fireEvent.click(getConfirmButton()));
};

describe(UI_TYPE, () => {
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
		const defaultValue = "11:11AM";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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
		await pickValidTime();
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: "01:00AM" }));
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

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: "01:00" }));
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();
			await pickValidTime();
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => expect(getTimePicker()).toHaveValue(""));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "11:11am";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });
			await pickValidTime();
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			await waitFor(() => expect(getTimePicker()).toHaveValue(defaultValue));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});

		it("should revert to current time on reset", async () => {
			const currentTime = "12:00";
			jest.spyOn(LocalTime, "now").mockReturnValue(LocalTime.parse(currentTime));
			renderComponent({ useCurrentTime: true });
			await pickValidTime();
			fireEvent.click(getResetButton());
			await waitFor(() => expect(getTimePicker()).toHaveValue(`${currentTime}pm`));

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: `${currentTime}PM` }));
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
			await pickValidTime();
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "hello" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			await pickValidTime();
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "hello" } }}
					onClick={handleClick}
				/>
			);
			await pickValidTime();
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
});
