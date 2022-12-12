import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IEmailSchema, INumberSchema, ITextfieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "text";
const componentTestId = TestHelper.generateId(componentId, fieldType);

const renderComponent = (
	overrideField?: Partial<ITextfieldSchema | IEmailSchema | INumberSchema> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			[componentId]: {
				label: "Textfield",
				fieldType,
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

describe("textfield", () => {
	describe("text", () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			const component = renderComponent();

			expect(component.container.querySelector(`input[type=text]#field-base`)).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			const component = renderComponent();
			expect(component.container.querySelector(`input[inputMode=text]#field-base`)).toBeInTheDocument();
		});

		it("should support default value", async () => {
			const defaultValue = "hello";
			renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
		});

		it("should pass other props into the field", () => {
			renderComponent({
				maxLength: 10,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});
			expect(screen.getByTestId("field").getAttribute("maxLength")).toBe("10");
			expect(screen.getByTestId("field").getAttribute("placeholder")).toBe("placeholder");
			expect(screen.getByTestId("field").getAttribute("readOnly")).toBeDefined();
			expect(screen.getByTestId("field").getAttribute("disabled")).toBeDefined();
		});
	});

	describe("email", () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			const component = renderComponent({ fieldType: "email" });

			expect(component.container.querySelector(`input[type=email]#field-base`)).toBeInTheDocument();
		});

		it("should validate email format", async () => {
			renderComponent({ fieldType: "email" });
			fireEvent.change(screen.getByTestId("field"), { target: { value: "hello" } });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.queryByTestId("field-error-message")).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({ fieldType: "email", validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			const component = renderComponent({ fieldType: "email" });
			expect(component.container.querySelector(`input[inputMode=email]#field-base`)).toBeInTheDocument();
		});

		it("should support default value", async () => {
			const defaultValue = "john@doe.tld";
			renderComponent({ fieldType: "email" }, { defaultValues: { [componentId]: defaultValue } });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: "email",
				maxLength: 10,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});
			expect(screen.getByTestId("field").getAttribute("maxLength")).toBe("10");
			expect(screen.getByTestId("field").getAttribute("placeholder")).toBe("placeholder");
			expect(screen.getByTestId("field").getAttribute("readOnly")).toBeDefined();
			expect(screen.getByTestId("field").getAttribute("disabled")).toBeDefined();
		});
	});

	describe("number", () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			const component = renderComponent({ fieldType: "number" });

			expect(component.container.querySelector("input[type=number]#field-base")).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({ fieldType: "number", validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			const component = renderComponent({ fieldType: "number" });
			expect(component.container.querySelector(`input[inputMode=numeric]#field-base`)).toBeInTheDocument();
		});

		it("should support default value", async () => {
			const defaultValue = 1;
			renderComponent({ fieldType: "number" }, { defaultValues: { [componentId]: defaultValue } });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: "number",
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});
			expect(screen.getByTestId("field").getAttribute("placeholder")).toBe("placeholder");
			expect(screen.getByTestId("field").getAttribute("readOnly")).toBeDefined();
			expect(screen.getByTestId("field").getAttribute("disabled")).toBeDefined();
		});
	});
});
