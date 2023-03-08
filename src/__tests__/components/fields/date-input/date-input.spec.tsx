import { LocalDate } from "@js-joda/core";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IDateInputSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
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
const fieldType = "date";

const renderComponent = (overrideField?: TOverrideField<IDateInputSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Date",
				fieldType,
				...overrideField,
			},
			...getSubmitButtonProps(),
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

const getDayInput = (): HTMLElement => {
	return getField("textbox", "day-input");
};

const getMonthInput = (): HTMLElement => {
	return getField("textbox", "month-input");
};

const getYearInput = (): HTMLElement => {
	return getField("textbox", "year-input");
};

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getDayInput()).toBeInTheDocument();
		expect(getMonthInput()).toBeInTheDocument();
		expect(getYearInput()).toBeInTheDocument();
	});

	it("should be able to support default value", async () => {
		const defaultDay = "01";
		const defaultMonth = "01";
		const defaultYear = "2022";
		const defaultValue = `${defaultYear}-${defaultMonth}-${defaultDay}`;
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getDayInput()).toHaveAttribute("value", defaultDay);
		expect(getMonthInput()).toHaveAttribute("value", defaultMonth);
		expect(getYearInput()).toHaveAttribute("value", defaultYear);
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should show current date if useCurrentDate=true", async () => {
		const date = "2022-01-01";
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse(date));
		renderComponent({ useCurrentDate: true });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				field: date,
			})
		);
	});

	it("should support other date formats", async () => {
		renderComponent({ dateFormat: "d MMMM uuuu" });
		fireEvent.change(getDayInput(), { target: { value: "01" } });
		fireEvent.change(getMonthInput(), { target: { value: "01" } });
		fireEvent.change(getYearInput(), { target: { value: "2022" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				[componentId]: "1 January 2022",
			})
		);
	});

	it("should accept defaultValue in the format as defined by dateFormat", async () => {
		renderComponent({ dateFormat: "d MMMM uuuu" }, { defaultValues: { [componentId]: "1 January 2022" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				[componentId]: "1 January 2022",
			})
		);
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	describe.each`
		condition       | config                       | invalid                 | valid
		${"future"}     | ${{ future: true }}          | ${["01", "01", "2022"]} | ${["02", "01", "2022"]}
		${"past"}       | ${{ past: true }}            | ${["01", "01", "2022"]} | ${["12", "31", "2021"]}
		${"non-future"} | ${{ notFuture: true }}       | ${["02", "01", "2022"]} | ${["01", "01", "2022"]}
		${"non-past"}   | ${{ notPast: true }}         | ${["31", "12", "2021"]} | ${["01", "01", "2022"]}
		${"min-date"}   | ${{ minDate: "2022-01-02" }} | ${["01", "01", "2022"]} | ${["02", "01", "2022"]}
		${"max-date"}   | ${{ maxDate: "2022-01-02" }} | ${["03", "01", "2022"]} | ${["02", "01", "2022"]}
	`("$condition validation", ({ condition, config, invalid, valid }) => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it(`should be able to validate for ${condition} dates`, async () => {
			renderComponent({ validation: [{ errorMessage: ERROR_MESSAGE, ...config }] });

			fireEvent.change(getDayInput(), { target: { value: invalid[0] } });
			fireEvent.change(getMonthInput(), { target: { value: invalid[1] } });
			fireEvent.change(getYearInput(), { target: { value: invalid[2] } });

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();

			await waitFor(() => {
				fireEvent.change(getDayInput(), { target: { value: valid[0] } });
				fireEvent.change(getMonthInput(), { target: { value: valid[1] } });
				fireEvent.change(getYearInput(), { target: { value: valid[2] } });
			});
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it(`should be able to validate for ${condition} dates for a different date format`, async () => {
			renderComponent({ validation: [{ errorMessage: ERROR_MESSAGE, dateFormat: "d MMMM uuuu", ...config }] });

			fireEvent.change(getDayInput(), { target: { value: invalid[0] } });
			fireEvent.change(getMonthInput(), { target: { value: invalid[1] } });
			fireEvent.change(getYearInput(), { target: { value: invalid[2] } });

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();

			await waitFor(() => {
				fireEvent.change(getDayInput(), { target: { value: valid[0] } });
				fireEvent.change(getMonthInput(), { target: { value: valid[1] } });
				fireEvent.change(getYearInput(), { target: { value: valid[2] } });
			});
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});
});
