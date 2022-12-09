import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ICheckboxGroupSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideField, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "checkbox";
const componentTestId = TestHelper.generateId(componentId, fieldType);

const renderComponent = (overrideField?: TOverrideField<ICheckboxGroupSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			[componentId]: {
				label: "Checkbox",
				fieldType,
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

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
		expect(screen.getAllByTestId(componentTestId)).toHaveLength(2);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["A"];
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValues } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(
			screen.getAllByTestId(componentTestId).forEach((input) => {
				expect(input).toHaveAttribute("disabled");
			})
		);

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: undefined }));
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const checkboxes = screen.getAllByTestId("checkbox");

		await waitFor(() => fireEvent.click(checkboxes[0].querySelector("input")));
		await waitFor(() => fireEvent.click(checkboxes[1].querySelector("input")));
		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["A", "B"] }));

		await waitFor(() => fireEvent.click(checkboxes[0].querySelector("input")));
		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["B"] }));

		await waitFor(() => fireEvent.click(checkboxes[1].querySelector("input")));
		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: [] }));
	});

	it.each`
		displaySize  | expected
		${"small"}   | ${"1.5rem"}
		${"default"} | ${"2rem"}
	`("should be support different displaySizes", ({ displaySize, expected }) => {
		renderComponent({ displaySize: displaySize });

		expect(
			screen.getAllByTestId("checkbox").forEach((checkbox) => {
				expect(checkbox).toHaveStyle({ width: expected, height: expected });
			})
		);
	});
});
