import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IEmailSchema, INumberSchema, ITextfieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	SUBMIT_BUTTON_ID,
	SUBMIT_BUTTON_NAME,
	TOverrideSchema,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const componentLabel = "Textfield";
const defaultFieldType = "text";
const emailFieldType = "email";
const numberFieldType = "numeric";

const renderComponent = (
	overrideField?: Partial<ITextfieldSchema | IEmailSchema | INumberSchema> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Textfield",
				fieldType: defaultFieldType,
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

describe("textfield", () => {
	describe(defaultFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent();

			expect(screen.getByRole("textbox", { name: componentLabel })).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent();

			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute(
				"inputMode",
				defaultFieldType
			);
		});

		it("should support default value", async () => {
			const defaultValue = "hello";
			renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
		});

		it("should pass other props into the field", () => {
			renderComponent({
				maxLength: 10,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("maxLength", "10");
			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("placeholder", "placeholder");
			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("readonly");
			expect(screen.getByRole("textbox", { name: componentLabel })).toBeDisabled();
		});
	});

	describe(emailFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent({ fieldType: emailFieldType });

			expect(screen.getByRole("textbox", { name: componentLabel })).toBeInTheDocument();
		});

		it("should validate email format", async () => {
			renderComponent({ fieldType: emailFieldType });

			fireEvent.change(screen.getByRole("textbox", { name: componentLabel }), { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));

			expect(screen.getByRole("heading", { name: "Invalid email address" })).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({
				fieldType: emailFieldType,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent({ fieldType: emailFieldType });

			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("inputMode", emailFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = "john@doe.tld";
			renderComponent({ fieldType: emailFieldType }, { defaultValues: { [componentId]: defaultValue } });

			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: emailFieldType,
				maxLength: 10,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("maxLength", "10");
			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("placeholder", "placeholder");
			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("readOnly");
			expect(screen.getByRole("textbox", { name: componentLabel })).toBeDisabled();
		});
	});

	describe(numberFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent({ fieldType: numberFieldType });

			expect(screen.getByRole("textbox", { name: componentLabel })).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({
				fieldType: numberFieldType,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent({ fieldType: numberFieldType });

			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("inputMode", numberFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = 1;
			renderComponent({ fieldType: numberFieldType }, { defaultValues: { [componentId]: defaultValue } });

			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: numberFieldType,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("placeholder", "placeholder");
			expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("readOnly");
			expect(screen.getByRole("textbox", { name: componentLabel })).toBeDisabled();
		});
	});
});
