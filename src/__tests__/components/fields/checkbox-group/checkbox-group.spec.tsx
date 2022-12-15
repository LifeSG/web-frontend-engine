import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ICheckboxGroupSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	getSubmitButton,
	getSubmitButtonProps,
	TOverrideField,
	TOverrideSchema,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "checkbox";

const renderComponent = (overrideField?: TOverrideField<ICheckboxGroupSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Checkbox",
				fieldType,
				options: [
					{ label: "A", value: "Apple" },
					{ label: "B", value: "Berry" },
				],
				...overrideField,
			},
			...getSubmitButtonProps(),
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
		const checkboxes = screen
			.getAllByRole("checkbox")
			.map((checkbox) => checkbox.querySelector("input"))
			.filter(Boolean);

		expect(checkboxes).toHaveLength(2);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		screen
			.getAllByRole("checkbox")
			.map((checkbox) => checkbox.querySelector("input"))
			.filter(Boolean)
			.forEach((checkbox) => {
				if (defaultValues.includes((checkbox as HTMLInputElement).value)) {
					expect(checkbox.nextElementSibling.tagName).toBe("svg");
				} else {
					expect(checkbox.nextElementSibling).not.toBeInTheDocument();
				}
			});
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		screen
			.getAllByRole("checkbox")
			.map((checkbox) => checkbox.querySelector("input"))
			.filter(Boolean)
			.forEach((checkbox) => {
				expect(checkbox).toBeDisabled();
			});

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: undefined }));
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const checkboxes = screen
			.getAllByRole("checkbox")
			.map((checkbox) => checkbox.querySelector("input"))
			.filter(Boolean);

		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: [] }));
	});

	it.each`
		displaySize  | expected
		${"small"}   | ${"1.5rem"}
		${"default"} | ${"2rem"}
	`("should be support different displaySizes", ({ displaySize, expected }) => {
		renderComponent({ displaySize: displaySize });
		const checkboxes = screen
			.getAllByRole("checkbox")
			.map((checkbox) => checkbox.querySelector("div"))
			.filter(Boolean);

		expect(
			checkboxes.forEach((checkbox) => {
				expect(checkbox).toHaveStyle({ width: expected, height: expected });
			})
		);
	});
});
