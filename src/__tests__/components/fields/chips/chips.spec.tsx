import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IChipsSchema } from "../../../../components/fields";
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
const fieldType = "chips";
const textareaLabel = "D";

const renderComponent = (overrideField?: TOverrideField<IChipsSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Chips",
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

		expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByRole("button", { name: "A" })).toHaveStyle({ "background-color": "#A4A4A4" });
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(screen.getByRole("button", { name: "A" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "B" })).toBeDisabled();
	});

	it("should be able to toggle the chips", async () => {
		renderComponent();
		const apple = screen.getByRole("button", { name: "A" });
		const berry = screen.getByRole("button", { name: "B" });

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Berry"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: [] }));
	});

	it("should be able to support single selection", async () => {
		renderComponent({ multi: false });
		const apple = screen.getByRole("button", { name: "A" });
		const berry = screen.getByRole("button", { name: "B" });

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Apple"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Berry"] }));
	});

	it("should be able to render textarea upon selection", async () => {
		renderComponent({ textarea: { label: textareaLabel } });
		const chip = screen.getByRole("button", { name: textareaLabel });

		expect(screen.queryByRole("textbox", { name: textareaLabel })).not.toBeInTheDocument();

		await waitFor(() => fireEvent.click(chip));
		expect(screen.getByRole("textbox", { name: textareaLabel })).toBeInTheDocument();
	});

	describe("textarea", () => {
		it("should be able to support validation schema", async () => {
			renderComponent({
				textarea: { label: textareaLabel, validation: [{ required: true, errorMessage: ERROR_MESSAGE }] },
			});

			const chip = screen.getByRole("button", { name: textareaLabel });
			await waitFor(() => fireEvent.click(chip));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should be able to resize vertically", async () => {
			renderComponent({
				textarea: { label: textareaLabel, resizable: true },
			});

			const chip = screen.getByRole("button", { name: textareaLabel });
			await waitFor(() => fireEvent.click(chip));

			expect(screen.getByRole("textbox", { name: textareaLabel })).toHaveStyle({ resize: "vertical" });
		});

		it("should be able to support custom rows", async () => {
			renderComponent({
				textarea: { label: textareaLabel, rows: 1 },
			});

			const chip = screen.getByRole("button", { name: textareaLabel });
			await waitFor(() => fireEvent.click(chip));

			expect(screen.getByRole("textbox", { name: textareaLabel })).toHaveAttribute("rows", "1");
		});
	});
});
