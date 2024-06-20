import { LocalDate } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { TDateRangeFieldSchema, TDateRangeInputType } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { IFrontendEngineData } from "../../../../components/types";
import { TDistributiveOmit } from "../../../../utils/ts-helper";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";
const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const label = "Date";
const uiType = "date-range-field";
const variant = "range";
const renderComponent = (
	overrideField?: Partial<TDistributiveOmit<TDateRangeFieldSchema, "uiType">>,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						uiType,
						label,
						variant,
						...overrideField,
					},
					...getSubmitButtonProps(),
					...getResetButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getDayInput = (type: TDateRangeInputType): HTMLElement => {
	return screen.getByTestId(`${type}-day-input`);
};

const getMonthInput = (type: TDateRangeInputType): HTMLElement => {
	return screen.getByTestId(`${type}-month-input`);
};

const getYearInput = (type: TDateRangeInputType): HTMLElement => {
	return screen.getByTestId(`${type}-year-input`);
};

describe(uiType, () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});
	it("should be able to render the field", () => {
		renderComponent();

		expect(getDayInput(TDateRangeInputType.START)).toBeInTheDocument();
		expect(getMonthInput(TDateRangeInputType.START)).toBeInTheDocument();
		expect(getYearInput(TDateRangeInputType.START)).toBeInTheDocument();
	});

	it("should be able to support default value", async () => {
		const defaultDay = "01";
		const defaultMonth = "01";
		const defaultYear = "2022";
		const from = `${defaultYear}-${defaultMonth}-${defaultDay}`;
		const to = `${defaultYear}-${defaultMonth}-${"02"}`;
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: { from, to } } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getDayInput(TDateRangeInputType.START)).toHaveAttribute("value", defaultDay);
		expect(getMonthInput(TDateRangeInputType.START)).toHaveAttribute("value", defaultMonth);
		expect(getYearInput(TDateRangeInputType.START)).toHaveAttribute("value", defaultYear);
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: { from, to } }));
	});

	describe("dateFormat", () => {
		describe.each`
			dateFormat       | value
			${"d MMMM uuuu"} | ${{ from: "25 January 2022", to: "26 February 2022" }}
			${"MM-d-uu"}     | ${{ from: "01-25-22", to: "02-26-22" }}
			${"d/M/uuuu"}    | ${{ from: "25/1/2022", to: "26/2/2022" }}
			${"uuuu MMM dd"} | ${{ from: "2022 Jan 25", to: "2022 Feb 26" }}
		`("$dateFormat", ({ dateFormat, value }) => {
			it("should support date format", async () => {
				renderComponent({ variant, dateFormat });
				fireEvent.focus(getDayInput(TDateRangeInputType.START));
				fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: "25" } });
				fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: "01" } });
				fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: "2022" } });
				fireEvent.click(screen.getByText("Done"));
				fireEvent.change(getDayInput(TDateRangeInputType.END), { target: { value: "26" } });
				fireEvent.change(getMonthInput(TDateRangeInputType.END), { target: { value: "02" } });
				fireEvent.change(getYearInput(TDateRangeInputType.END), { target: { value: "2022" } });
				fireEvent.click(screen.getByText("Done"));
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
			});

			it("should accept defaultValue in the format as defined by dateFormat", async () => {
				renderComponent({ dateFormat, variant }, { defaultValues: { [COMPONENT_ID]: value } });

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
			});

			it("should reject defaultValue if it did not follow dateFormat", async () => {
				renderComponent(
					{ dateFormat, variant },
					{ defaultValues: { [COMPONENT_ID]: { from: "25 January 2022", to: "2022-02-25" } } }
				);

				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(screen.getByText(ERROR_MESSAGES.DATE_RANGE.INVALID)).toBeInTheDocument();
			});
		});
	});

	it.each(["week", "range", "fixed-range"])(
		"should support validation schema 'required' for %s variant",
		async (variantVal: "week" | "range" | "fixed-range") => {
			renderComponent({
				variant: variantVal,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		}
	);

	describe.each`
		condition           | config                               | invalid                                                     | valid
		${"future"}         | ${{ future: true }}                  | ${{ from: ["01", "01", "2021"], to: ["01", "01", "2022"] }} | ${{ from: ["01", "January", "2023"], to: ["01", "February", "2024"] }}
		${"past"}           | ${{ past: true }}                    | ${{ from: ["01", "01", "2022"], to: ["01", "02", "2022"] }} | ${{ from: ["01", "January", "2020"], to: ["01", "February", "2021"] }}
		${"non-future"}     | ${{ notFuture: true }}               | ${{ from: ["02", "01", "2022"], to: ["01", "02", "2022"] }} | ${{ from: ["01", "January", "2021"], to: ["01", "January", "2022"] }}
		${"non-past"}       | ${{ notPast: true }}                 | ${{ from: ["01", "01", "2021"], to: ["01", "02", "2021"] }} | ${{ from: ["01", "January", "2022"], to: ["01", "February", "2022"] }}
		${"min-date"}       | ${{ minDate: "2022-01-02" }}         | ${{ from: ["01", "01", "2021"], to: ["01", "02", "2021"] }} | ${{ from: ["01", "January", "2023"], to: ["01", "February", "2024"] }}
		${"max-date"}       | ${{ maxDate: "2022-01-02" }}         | ${{ from: ["01", "01", "2023"], to: ["01", "02", "2024"] }} | ${{ from: ["01", "January", "2020"], to: ["01", "February", "2021"] }}
		${"excluded-dates"} | ${{ excludedDates: ["2022-01-02"] }} | ${{ from: ["02", "01", "2022"], to: ["01", "02", "2022"] }} | ${{ from: ["01", "January", "2022"], to: ["01", "February", "2022"] }}
	`("$condition validation", ({ condition, config, invalid, valid }) => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it(`should ignore the invalid input values if there is validation for ${condition} dates`, async () => {
			renderComponent({ variant, validation: [config] });

			fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: invalid.from[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: invalid.from[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: invalid.from[2] } });
			fireEvent.click(getField("button", "Done"));
			fireEvent.change(getDayInput(TDateRangeInputType.END), { target: { value: invalid.to[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.END), { target: { value: invalid.to[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.END), { target: { value: invalid.to[2] } });
			fireEvent.click(getField("button", "Done"));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: { from: undefined, to: undefined } })
			);
		});

		it(`should show error message on submit if there is validation error for ${condition} dates and invalid default dates`, async () => {
			renderComponent(
				{ variant, validation: [{ errorMessage: ERROR_MESSAGE, ...config }] },
				{
					defaultValues: {
						[COMPONENT_ID]: {
							from: `${invalid.from[2]}-${invalid.from[1]}-${invalid.from[0]}`,
							to: `${invalid.to[2]}-${invalid.to[1]}-${invalid.to[0]}`,
						},
					},
				}
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).not.toBeCalled();
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it(`should not show error messages if week variant on submit if there is validation error for ${condition} dates and invalid default dates`, async () => {
			renderComponent(
				{ validation: [{ errorMessage: ERROR_MESSAGE, ...config }], variant: "week" },
				{
					defaultValues: {
						[COMPONENT_ID]: {
							from: `${invalid.from[2]}-${invalid.from[1]}-${invalid.from[0]}`,
							to: `${invalid.to[2]}-${invalid.to[1]}-${invalid.to[0]}`,
						},
					},
				}
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalled();
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it(`should be able to validate for ${condition} dates for a different date format`, async () => {
			renderComponent({ variant, validation: [{ dateFormat: "d MMMM uuuu", ...config }] });

			fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: invalid.from[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: invalid.from[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: invalid.from[2] } });
			fireEvent.click(getField("button", "Done"));
			fireEvent.change(getDayInput(TDateRangeInputType.END), { target: { value: invalid.to[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.END), { target: { value: invalid.to[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.END), { target: { value: invalid.to[2] } });
			fireEvent.click(getField("button", "Done"));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: { from: undefined, to: undefined } })
			);

			fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: valid.from[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: valid.from[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: valid.from[2] } });
			fireEvent.click(getField("button", "Done"));
			fireEvent.change(getDayInput(TDateRangeInputType.END), { target: { value: valid.to[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.END), { target: { value: valid.to[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.END), { target: { value: valid.to[2] } });
			fireEvent.click(getField("button", "Done"));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});
	describe("number-of-days validation", () => {
		const condition = "number-of-days";
		const config = { numberOfDays: 10 };
		const invalid = { from: ["02", "01", "2022"], to: ["04", "02", "2022"] };
		const valid = { from: ["01", "January", "2022"], to: ["06", "January", "2022"] };

		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it(`should show error message on submit if there is validation error for ${condition} dates and invalid default dates`, async () => {
			renderComponent(
				{ variant, validation: [{ errorMessage: ERROR_MESSAGE, ...config }] },
				{
					defaultValues: {
						[COMPONENT_ID]: {
							from: `${invalid.from[2]}-${invalid.from[1]}-${invalid.from[0]}`,
							to: `${invalid.to[2]}-${invalid.to[1]}-${invalid.to[0]}`,
						},
					},
				}
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).not.toBeCalled();
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it(`should not show error messages if week variant on submit if there is validation error for ${condition} dates and invalid default dates`, async () => {
			renderComponent(
				{ validation: [{ errorMessage: ERROR_MESSAGE, ...config }], variant: "week" },
				{
					defaultValues: {
						[COMPONENT_ID]: {
							from: `${invalid.from[2]}-${invalid.from[1]}-${invalid.from[0]}`,
							to: `${invalid.to[2]}-${invalid.to[1]}-${invalid.to[0]}`,
						},
					},
				}
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalled();
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it(`should be able to validate for ${condition} dates for a different date format`, async () => {
			renderComponent({ variant, dateFormat: "d MMMM uuuu", validation: [{ ...config }] });

			fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: valid.from[0] } });
			fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: valid.from[1] } });
			fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: valid.from[2] } });
			fireEvent.click(getField("button", "Done"));

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.focus(getDayInput(TDateRangeInputType.START));
			fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: "25" } });
			fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: "01" } });
			fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: "2022" } });
			fireEvent.click(screen.getByText("Done"));
			fireEvent.change(getDayInput(TDateRangeInputType.END), { target: { value: "25" } });
			fireEvent.change(getMonthInput(TDateRangeInputType.END), { target: { value: "02" } });
			fireEvent.change(getYearInput(TDateRangeInputType.END), { target: { value: "2022" } });
			fireEvent.click(screen.getByText("Done"));
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getDayInput(TDateRangeInputType.START)).toHaveAttribute("value", "");
			expect(getMonthInput(TDateRangeInputType.START)).toHaveAttribute("value", "");
			expect(getYearInput(TDateRangeInputType.START)).toHaveAttribute("value", "");
			expect(getDayInput(TDateRangeInputType.END)).toHaveAttribute("value", "");
			expect(getMonthInput(TDateRangeInputType.END)).toHaveAttribute("value", "");
			expect(getYearInput(TDateRangeInputType.END)).toHaveAttribute("value", "");
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultDay = "01";
			const defaultMonth = "01";
			const defaultYear = "2022";
			const defaultValue = `${defaultYear}-${defaultMonth}-${defaultDay}`;
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: { from: defaultValue, to: defaultValue } } });

			fireEvent.focus(getDayInput(TDateRangeInputType.START));
			fireEvent.change(getDayInput(TDateRangeInputType.START), { target: { value: "25" } });
			fireEvent.change(getMonthInput(TDateRangeInputType.START), { target: { value: "05" } });
			fireEvent.change(getYearInput(TDateRangeInputType.START), { target: { value: "2021" } });
			fireEvent.click(screen.getByText("Done"));
			fireEvent.change(getDayInput(TDateRangeInputType.END), { target: { value: "25" } });
			fireEvent.change(getMonthInput(TDateRangeInputType.END), { target: { value: "05" } });
			fireEvent.change(getYearInput(TDateRangeInputType.END), { target: { value: "2021" } });
			fireEvent.click(screen.getByText("Done"));
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getDayInput(TDateRangeInputType.START)).toHaveAttribute("value", defaultDay);
			expect(getMonthInput(TDateRangeInputType.START)).toHaveAttribute("value", defaultMonth);
			expect(getYearInput(TDateRangeInputType.START)).toHaveAttribute("value", defaultYear);
			expect(getDayInput(TDateRangeInputType.END)).toHaveAttribute("value", defaultDay);
			expect(getMonthInput(TDateRangeInputType.END)).toHaveAttribute("value", defaultMonth);
			expect(getYearInput(TDateRangeInputType.END)).toHaveAttribute("value", defaultYear);
			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: { from: defaultValue, to: defaultValue } })
			);
		});
	});

	labelTestSuite(renderComponent);
	warningTestSuite<TDateRangeFieldSchema>({ uiType, label, variant });
});
