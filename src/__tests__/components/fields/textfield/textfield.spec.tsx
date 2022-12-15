import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IEmailSchema, INumberSchema, ITextfieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
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
			...getSubmitButtonProps(),
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

const getTextfield = (): HTMLElement => {
	return getField("textbox", componentLabel);
};

describe("textfield", () => {
	describe(defaultFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent();

			expect(getTextfield()).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent();

			expect(getTextfield()).toHaveAttribute("inputMode", defaultFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = "hello";
			renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
		});

		it("should pass other props into the field", () => {
			renderComponent({
				maxLength: 10,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(getTextfield()).toHaveAttribute("maxLength", "10");
			expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
			expect(getTextfield()).toHaveAttribute("readonly");
			expect(getTextfield()).toBeDisabled();
		});
	});

	describe(emailFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent({ fieldType: emailFieldType });

			expect(getTextfield()).toBeInTheDocument();
		});

		it("should validate email format", async () => {
			renderComponent({ fieldType: emailFieldType });

			fireEvent.change(getTextfield(), { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText("Invalid email address")).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({
				fieldType: emailFieldType,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent({ fieldType: emailFieldType });

			expect(getTextfield()).toHaveAttribute("inputMode", emailFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = "john@doe.tld";
			renderComponent({ fieldType: emailFieldType }, { defaultValues: { [componentId]: defaultValue } });

			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
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

			expect(getTextfield()).toHaveAttribute("maxLength", "10");
			expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
			expect(getTextfield()).toHaveAttribute("readOnly");
			expect(getTextfield()).toBeDisabled();
		});
	});

	describe(numberFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent({ fieldType: numberFieldType });

			expect(getTextfield()).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({
				fieldType: numberFieldType,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent({ fieldType: numberFieldType });

			expect(getTextfield()).toHaveAttribute("inputMode", numberFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = 1;
			renderComponent({ fieldType: numberFieldType }, { defaultValues: { [componentId]: defaultValue } });

			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: numberFieldType,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
			expect(getTextfield()).toHaveAttribute("readOnly");
			expect(getTextfield()).toBeDisabled();
		});
	});
});
