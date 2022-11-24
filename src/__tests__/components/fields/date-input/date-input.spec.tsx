import { LocalDate } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IDateInputSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";

const ERROR_MESSAGE = "test error message";
const submitFn = jest.fn();

const renderComponent = (
	overrideField?: Partial<Omit<IDateInputSchema, "fieldType" | "label">> | undefined,
	overrideSchema?: Partial<Omit<IFrontendEngineData, "fields">> | undefined
) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			field: {
				label: "Date",
				fieldType: "date",
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

describe("date-input", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
		expect(screen.getByTestId("field")).toBeInTheDocument();
	});

	it("should support default value", async () => {
		const defaultValue = "2022-01-01";
		renderComponent(undefined, {
			defaultValues: {
				field: defaultValue,
			},
		});
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				field: defaultValue,
			})
		);
	});

	it("should show current date if useCurrentDate=true", async () => {
		const date = "2022-01-01";
		jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse(date));
		renderComponent({ useCurrentDate: true });
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

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
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				field: "1 January 2022",
			})
		);
	});

	it("should accept defaultValue in the format as defined by dateFormat", async () => {
		renderComponent({ dateFormat: "d MMMM uuuu" }, { defaultValues: { field: "1 January 2022" } });
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

		expect(submitFn).toBeCalledWith(
			expect.objectContaining({
				field: "1 January 2022",
			})
		);
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

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
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();

		await waitFor(() => {
			fireEvent.change(screen.getByTestId("day-input"), { target: { value: valid[0] } });
			fireEvent.change(screen.getByTestId("month-input"), { target: { value: valid[1] } });
			fireEvent.change(screen.getByTestId("year-input"), { target: { value: valid[2] } });
		});
		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
	});
});
