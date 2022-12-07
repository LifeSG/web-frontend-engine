import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IMultiSelectSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import { ERROR_MESSAGE } from "../../../common";

const submitFn = jest.fn();

const renderComponent = (
	overrideField?: Partial<Omit<IMultiSelectSchema, "fieldType" | "label">> | undefined,
	overrideSchema?: Partial<Omit<IFrontendEngineData, "fields">> | undefined
) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			field: {
				label: "Multiselect",
				fieldType: "multi-select",
				options: [
					{ label: "A", value: "A" },
					{ label: "B", value: "B" },
				],
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

describe("mutli-select", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
		expect(screen.getAllByTestId("list-item")).toHaveLength(2);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["A"];
		renderComponent(undefined, { defaultValues: { field: defaultValues } });

		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ field: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ field: undefined }));
	});

	it("should be able to support custom list style width", () => {
		const width = "24rem";
		renderComponent({ listStyleWidth: width });

		expect(screen.getByTestId("dropdown-list")).toHaveStyle({ width });
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(screen.getByText(placeholder)).toBeInTheDocument();
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const dropdownButtons = screen.getAllByTestId("list-item");

		await waitFor(() => fireEvent.click(dropdownButtons[0]));
		await waitFor(() => fireEvent.click(dropdownButtons[1]));
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ field: ["A", "B"] }));

		await waitFor(() => fireEvent.click(dropdownButtons[0]));
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ field: ["B"] }));

		await waitFor(() => fireEvent.click(dropdownButtons[1]));
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ field: [] }));
	});

	it("should be able to toggle all the checkboxes at once", async () => {
		renderComponent();
		const selectAllButton = screen.getByText("Select all");

		await waitFor(() => fireEvent.click(selectAllButton));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ field: ["A", "B"] }));
	});
});
