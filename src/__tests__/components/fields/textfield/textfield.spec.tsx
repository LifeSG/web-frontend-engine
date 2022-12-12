import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IEmailSchema, INumberSchema, ITextfieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const defaultFieldType = "text";
const emailFieldType = "email";
const numberFieldType = "numeric";
const defaultTestId = TestHelper.generateId(componentId, defaultFieldType);
const emailTestId = TestHelper.generateId(componentId, emailFieldType);
const numberTestId = TestHelper.generateId(componentId, numberFieldType);

const renderComponent = (
	overrideField?: Partial<ITextfieldSchema | IEmailSchema | INumberSchema> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: "test",
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

			expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent();

			expect(screen.getByTestId(defaultTestId)).toHaveAttribute("inputMode", defaultFieldType);
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

			expect(screen.getByTestId(defaultTestId)).toHaveAttribute("maxLength", "10");
			expect(screen.getByTestId(defaultTestId)).toHaveAttribute("placeholder", "placeholder");
			expect(screen.getByTestId(defaultTestId)).toHaveAttribute("readonly");
			expect(screen.getByTestId(defaultTestId)).toHaveAttribute("disabled");
		});
	});

	describe(emailFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent({ fieldType: emailFieldType });

			expect(screen.getByTestId(emailTestId)).toBeInTheDocument();
		});

		it("should validate email format", async () => {
			renderComponent({ fieldType: emailFieldType });

			fireEvent.change(screen.getByTestId(emailTestId), { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.queryByTestId("field-error-message")).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({
				fieldType: emailFieldType,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent({ fieldType: emailFieldType });

			expect(screen.getByTestId(emailTestId)).toHaveAttribute("inputMode", emailFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = "john@doe.tld";
			renderComponent({ fieldType: emailFieldType }, { defaultValues: { [componentId]: defaultValue } });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: emailFieldType,
				maxLength: 10,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(screen.getByTestId(emailTestId)).toHaveAttribute("maxLength", "10");
			expect(screen.getByTestId(emailTestId)).toHaveAttribute("placeholder", "placeholder");
			expect(screen.getByTestId(emailTestId)).toHaveAttribute("readOnly");
			expect(screen.getByTestId(emailTestId)).toHaveAttribute("disabled");
		});
	});

	describe(numberFieldType, () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it("should be able to render the field", () => {
			renderComponent({ fieldType: numberFieldType });

			expect(screen.getByTestId(numberTestId)).toBeInTheDocument();
		});

		it("should support validation schema", async () => {
			renderComponent({
				fieldType: numberFieldType,
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should apply inputMode according to its type", () => {
			renderComponent({ fieldType: numberFieldType });

			expect(screen.getByTestId(numberTestId)).toHaveAttribute("inputMode", numberFieldType);
		});

		it("should support default value", async () => {
			const defaultValue = 1;
			renderComponent({ fieldType: numberFieldType }, { defaultValues: { [componentId]: defaultValue } });

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
			expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
		});

		it("should pass other props into the field", () => {
			renderComponent({
				fieldType: numberFieldType,
				placeholder: "placeholder",
				readOnly: true,
				disabled: true,
			});

			expect(screen.getByTestId(numberTestId)).toHaveAttribute("placeholder", "placeholder");
			expect(screen.getByTestId(numberTestId)).toHaveAttribute("readOnly");
			expect(screen.getByTestId(numberTestId)).toHaveAttribute("disabled");
		});
	});
});
