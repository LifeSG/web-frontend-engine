import { fireEvent, render, waitFor } from "@testing-library/react";
import { IChipsSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
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

const getChipA = (pressed = false): HTMLElement => {
	return getField("button", pressed ? { name: "A", pressed: true } : "A");
};

const getChipB = (): HTMLElement => {
	return getField("button", "B");
};

const getTextareaChip = (): HTMLElement => {
	return getField("button", textareaLabel);
};

const getTextarea = (isQuery = false): HTMLElement => {
	return getField("textbox", textareaLabel, isQuery);
};

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getChipA()).toBeInTheDocument();
		expect(getChipB()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getChipA(true)).toBeInTheDocument();
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getChipA()).toBeDisabled();
		expect(getChipB()).toBeDisabled();
	});

	it("should be able to toggle the chips", async () => {
		renderComponent();
		const apple = getChipA();
		const berry = getChipB();

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
		renderComponent({ validation: [{ max: 1 }] });
		const apple = getChipA();
		const berry = getChipB();

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Apple"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Berry"] }));
	});

	it("should be able to render textarea upon selection", async () => {
		renderComponent({ textarea: { label: textareaLabel } });

		expect(getTextarea(true)).not.toBeInTheDocument();

		await waitFor(() => fireEvent.click(getTextareaChip()));
		expect(getTextarea()).toBeInTheDocument();
	});

	describe("textarea", () => {
		it("should be able to support validation schema", async () => {
			renderComponent({
				textarea: { label: textareaLabel, validation: [{ required: true, errorMessage: ERROR_MESSAGE }] },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should be able to resize vertically", async () => {
			renderComponent({
				textarea: { label: textareaLabel, resizable: true },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));

			expect(getTextarea()).toHaveStyle({ resize: "vertical" });
		});

		it("should be able to support custom rows", async () => {
			renderComponent({
				textarea: { label: textareaLabel, rows: 1 },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));

			expect(getTextarea()).toHaveAttribute("rows", "1");
		});
	});
});
