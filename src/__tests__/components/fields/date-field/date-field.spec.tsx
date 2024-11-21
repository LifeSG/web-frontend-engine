import { LocalDate } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IDateFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/types";
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
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "date-field";
const COMPONENT_LABEL = "Date";
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

const renderComponent = (overrideField?: TOverrideField<IDateFieldSchema>, overrideSchema?: TOverrideSchema) => {
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

const getDayInput = (): HTMLElement => {
	return getField("textbox", "day");
};

const getMonthInput = (): HTMLElement => {
	return getField("textbox", "month");
};

const getYearInput = (): HTMLElement => {
	return getField("textbox", "year");
};

const changeDate = async (day: string, month: string, year: string) => {
	fireEvent.focus(getDayInput());
	fireEvent.change(getDayInput(), { target: { value: day } });
	fireEvent.change(getMonthInput(), { target: { value: month } });
	fireEvent.change(getYearInput(), { target: { value: year } });
	await waitFor(() => fireEvent.click(screen.getByText("Done")));
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
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
		it("should support customising date format error message", async () => {
			renderComponent(
				{ validation: [{ dateFormat: true, errorMessage: ERROR_MESSAGE }] },
				{ defaultValues: { [COMPONENT_ID]: "invalid" } }
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		describe.each`
			dateFormat       | value
			${"d MMMM uuuu"} | ${"25 January 2022"}
			${"MM-d-uu"}     | ${"01-25-22"}
			${"d/M/uuuu"}    | ${"25/1/2022"}
			${"uuuu MMM dd"} | ${"2022 Jan 25"}
		`("$dateFormat", ({ dateFormat, value }) => {
			it("should support date format", async () => {
				renderComponent({ dateFormat });
				await changeDate("25", "01", "2022");
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
		condition           | config                                                         | invalid                 | valid
		${"future"}         | ${{ future: true }}                                            | ${["01", "01", "2022"]} | ${["02", "01", "2022"]}
		${"past"}           | ${{ past: true }}                                              | ${["01", "01", "2022"]} | ${["12", "31", "2021"]}
		${"non-future"}     | ${{ notFuture: true }}                                         | ${["02", "01", "2022"]} | ${["01", "01", "2022"]}
		${"non-past"}       | ${{ notPast: true }}                                           | ${["31", "12", "2021"]} | ${["01", "01", "2022"]}
		${"min-date"}       | ${{ minDate: "2022-01-02" }}                                   | ${["01", "01", "2022"]} | ${["02", "01", "2022"]}
		${"max-date"}       | ${{ maxDate: "2022-01-02" }}                                   | ${["03", "01", "2022"]} | ${["02", "01", "2022"]}
		${"excluded-dates"} | ${{ excludedDates: ["2022-01-02"] }}                           | ${["02", "01", "2022"]} | ${["03", "01", "2022"]}
		${"within-days"}    | ${{ withinDays: { numberOfDays: 7 } }}                         | ${["09", "01", "2022"]} | ${["02", "01", "2022"]}
		${"within-days"}    | ${{ withinDays: { numberOfDays: -7 } }}                        | ${["02", "01", "2022"]} | ${["24", "12", "2021"]}
		${"within-days"}    | ${{ withinDays: { numberOfDays: 5, fromDate: "2022-01-05" } }} | ${["01", "01", "2022"]} | ${["06", "01", "2022"]}
	`("$condition validation", ({ condition, config, invalid, valid }) => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it(`should ignore the invalid input values if there is validation for ${condition} dates`, async () => {
			renderComponent({ validation: [config] });

			await changeDate(invalid[0], invalid[1], invalid[2]);
			fireEvent.click(getField("button", "Done"));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it(`should show error message on submit if there is validation error for ${condition} dates and invalid default dates`, async () => {
			renderComponent(
				{ validation: [{ errorMessage: ERROR_MESSAGE, ...config }] },
				{ defaultValues: { [COMPONENT_ID]: `${invalid[2]}-${invalid[1]}-${invalid[0]}` } }
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).not.toBeCalled();
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it(`should be able to validate for ${condition} dates for a different date format`, async () => {
			renderComponent({ validation: [{ dateFormat: "d MMMM uuuu", ...config }] });

			await changeDate(invalid[0], invalid[1], invalid[2]);
			fireEvent.click(getField("button", "Done"));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));

			await changeDate(valid[0], valid[1], valid[2]);

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});

	it("should derive the latest of the allowed dates if there are minDate, future and notPast rules", async () => {
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		renderComponent({ validation: [{ minDate: "2022-01-15" }, { future: true }, { notPast: true }] });

		await changeDate("05", "01", "2022");
		fireEvent.click(getField("button", "Done"));
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));

		await changeDate("15", "01", "2022");
		fireEvent.click(getField("button", "Done"));
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: "2022-01-15" }));
	});

	it("should derive the earliest of the allowed dates if there are maxDate, past and notFuture rules", async () => {
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		renderComponent({ validation: [{ maxDate: "2021-12-15" }, { past: true }, { notFuture: true }] });

		await changeDate("30", "12", "2021");
		fireEvent.click(getField("button", "Done"));
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));

		await changeDate("15", "12", "2021");
		fireEvent.click(getField("button", "Done"));
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: "2021-12-15" }));
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			await changeDate("25", "01", "2022");
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getDayInput()).toHaveAttribute("value", "");
			expect(getMonthInput()).toHaveAttribute("value", "");
			expect(getYearInput()).toHaveAttribute("value", "");
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultDay = "01";
			const defaultMonth = "01";
			const defaultYear = "2022";
			const defaultValue = `${defaultYear}-${defaultMonth}-${defaultDay}`;
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			await changeDate("25", "05", "2021");
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getDayInput()).toHaveAttribute("value", defaultDay);
			expect(getMonthInput()).toHaveAttribute("value", defaultMonth);
			expect(getYearInput()).toHaveAttribute("value", defaultYear);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});

		it("should revert to current date on reset", async () => {
			const currentDay = "01";
			const currentMonth = "01";
			const currentYear = "2022";
			const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
			jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse(currentDate));
			renderComponent({ useCurrentDate: true });

			await changeDate("25", "05", "2021");
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getDayInput()).toHaveAttribute("value", currentDay);
			expect(getMonthInput()).toHaveAttribute("value", currentMonth);
			expect(getYearInput()).toHaveAttribute("value", currentYear);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: currentDate }));
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

		it("should mount without setting form state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			await changeDate("25", "01", "2022");

			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "2022-02-25" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			await changeDate("25", "01", "2022");
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "2022-02-25" } }}
					onClick={handleClick}
				/>
			);
			await changeDate("25", "01", "2022");
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});
	labelTestSuite(renderComponent);
	warningTestSuite<IDateFieldSchema>({ label: COMPONENT_LABEL, uiType: UI_TYPE });
});
