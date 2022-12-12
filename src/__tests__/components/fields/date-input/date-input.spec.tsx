import { LocalDate } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IDateInputSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideField, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "date";
const componentTestId = TestHelper.generateId(componentId, fieldType);

const renderComponent = (overrideField?: TOverrideField<IDateInputSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			[componentId]: {
				label: "Date",
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
		jest.restoreAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
	});

	it("should be able to support default value", async () => {
		const defaultDay = "01";
		const defaultMonth = "01";
		const defaultYear = "2022";
		const defaultValue = `${defaultYear}-${defaultMonth}-${defaultDay}`;
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(screen.getByTestId("day-input")).toHaveAttribute("value", defaultDay);
		expect(screen.getByTestId("month-input")).toHaveAttribute("value", defaultMonth);
		expect(screen.getByTestId("year-input")).toHaveAttribute("value", defaultYear);
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should show current date if useCurrentDate=true", async () => {
		const date = "2022-01-01";
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse(date));
		renderComponent({ useCurrentDate: true });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				field: date,
			})
		);
	});

	it("should support other date formats", async () => {
		renderComponent({ dateFormat: "d MMMM uuuu" });
		fireEvent.change(screen.getByTestId("day-input"), { target: { value: "1" } });
		fireEvent.change(screen.getByTestId("month-input"), { target: { value: "1" } });
		fireEvent.change(screen.getByTestId("year-input"), { target: { value: "2022" } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				[componentId]: "1 January 2022",
			})
		);
	});

	it("should accept defaultValue in the format as defined by dateFormat", async () => {
		renderComponent({ dateFormat: "d MMMM uuuu" }, { defaultValues: { [componentId]: "1 January 2022" } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				[componentId]: "1 January 2022",
			})
		);
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it.each`
		condition       | config                 | invalid           | valid
		${"future"}     | ${{ future: true }}    | ${[1, 1, 2022]}   | ${[2, 1, 2022]}
		${"past"}       | ${{ past: true }}      | ${[1, 1, 2022]}   | ${[12, 31, 2021]}
		${"non-future"} | ${{ notFuture: true }} | ${[2, 1, 2022]}   | ${[1, 1, 2022]}
		${"non-past"}   | ${{ notPast: true }}   | ${[31, 12, 2021]} | ${[1, 1, 2022]}
	`("should be able to validate for $condition dates", async ({ config, invalid, valid }) => {
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		renderComponent({ validation: [{ errorMessage: ERROR_MESSAGE, ...config }] });

		fireEvent.change(screen.getByTestId("day-input"), { target: { value: invalid[0] } });
		fireEvent.change(screen.getByTestId("month-input"), { target: { value: invalid[1] } });
		fireEvent.change(screen.getByTestId("year-input"), { target: { value: invalid[2] } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.change(screen.getByTestId("day-input"), { target: { value: valid[0] } });
			fireEvent.change(screen.getByTestId("month-input"), { target: { value: valid[1] } });
			fireEvent.change(screen.getByTestId("year-input"), { target: { value: valid[2] } });
		});
		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
	});
});
