import { LocalDate } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IDateFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
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

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "date-field";

const renderComponent = (overrideField?: TOverrideField<IDateFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Date",
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

const getDayInput = (): HTMLElement => {
	return getField("textbox", "day-input");
};

const getMonthInput = (): HTMLElement => {
	return getField("textbox", "month-input");
};

const getYearInput = (): HTMLElement => {
	return getField("textbox", "year-input");
};

describe(UI_TYPE, () => {
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
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getDayInput()).toHaveAttribute("value", defaultDay);
		expect(getMonthInput()).toHaveAttribute("value", defaultMonth);
		expect(getYearInput()).toHaveAttribute("value", defaultYear);
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should show current date if useCurrentDate=true", async () => {
		const date = "2022-01-01";
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse(date));
		renderComponent({ useCurrentDate: true });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(
			expect.objectContaining({
				field: date,
			})
		);
	});

	describe("dateFormat", () => {
		describe.each`
			dateFormat       | value
			${"d MMMM uuuu"} | ${"25 January 2022"}
			${"MM-d-uu"}     | ${"01-25-22"}
			${"d/M/uuuu"}    | ${"25/1/2022"}
			${"uuuu MMM dd"} | ${"2022 Jan 25"}
		`("$dateFormat", ({ dateFormat, value }) => {
			it("should support date format", async () => {
				renderComponent({ dateFormat });
				fireEvent.change(getDayInput(), { target: { value: "25" } });
				fireEvent.change(getMonthInput(), { target: { value: "01" } });
				fireEvent.change(getYearInput(), { target: { value: "2022" } });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
			});

			it("should format current date accordingly if useCurrentDate=true", async () => {
				const date = "2022-01-25";
				jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse(date));
				renderComponent({ dateFormat, useCurrentDate: true });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
			});

			it("should accept defaultValue in the format as defined by dateFormat", async () => {
				renderComponent({ dateFormat }, { defaultValues: { [COMPONENT_ID]: value } });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
			});

			it("should reject defaultValue if it did not follow dateFormat", async () => {
				renderComponent({ dateFormat }, { defaultValues: { [COMPONENT_ID]: "2022-01-25" } });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(screen.getByText(ERROR_MESSAGES.DATE.INVALID)).toBeInTheDocument();
			});
		});
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
