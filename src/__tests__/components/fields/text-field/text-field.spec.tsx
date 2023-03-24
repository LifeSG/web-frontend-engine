import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const componentLabel = "Textfield";
const defaultFieldType = "text-field";
const emailFieldType = "email-field";
const numericFieldType = "numeric-field";

const renderComponent = (
	overrideField?: Partial<ITextFieldSchema | IEmailFieldSchema | INumericFieldSchema> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Textfield",
				uiType: defaultFieldType,
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

		expect(getTextfield()).toHaveAttribute("inputMode", "text");
	});

	it("should apply maxLength attribute if max validation is specified", () => {
		renderComponent({ validation: [{ max: 5 }] });

		expect(getTextfield()).toHaveAttribute("maxLength", "5");
	});

	it("should apply maxLength attribute if length validation is specified", () => {
		renderComponent({ validation: [{ length: 5 }] });

		expect(getTextfield()).toHaveAttribute("maxLength", "5");
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
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

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
		renderComponent({ uiType: emailFieldType });

		expect(getTextfield()).toBeInTheDocument();
	});

	it("should validate email format", async () => {
		renderComponent({ uiType: emailFieldType });

		fireEvent.change(getTextfield(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText("Invalid email address")).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({
			uiType: emailFieldType,
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent({ uiType: emailFieldType });

		expect(getTextfield()).toHaveAttribute("inputMode", "email");
	});

	it("should apply maxLength attribute if max validation is specified", () => {
		renderComponent({ uiType: emailFieldType, validation: [{ max: 5 }] });

		expect(getTextfield()).toHaveAttribute("maxLength", "5");
	});

	it("should apply maxLength attribute if length validation is specified", () => {
		renderComponent({ uiType: emailFieldType, validation: [{ length: 5 }] });

		expect(getTextfield()).toHaveAttribute("maxLength", "5");
	});

	it("should support default value", async () => {
		const defaultValue = "john@doe.tld";
		renderComponent({ uiType: emailFieldType }, { defaultValues: { [componentId]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			uiType: emailFieldType,
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
		expect(getTextfield()).toHaveAttribute("readOnly");
		expect(getTextfield()).toBeDisabled();
	});
});

describe(numericFieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent({ uiType: numericFieldType });

		expect(getTextfield()).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({
			uiType: numericFieldType,
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent({ uiType: numericFieldType });

		expect(getTextfield()).toHaveAttribute("inputMode", "numeric");
	});

	it("should apply min attribute if min validation is specified", () => {
		renderComponent({ uiType: numericFieldType, validation: [{ min: 5 }] });

		expect(getTextfield()).toHaveAttribute("min", "5");
	});

	it("should apply max attribute if max validation is specified", () => {
		renderComponent({ uiType: numericFieldType, validation: [{ max: 5 }] });

		expect(getTextfield()).toHaveAttribute("max", "5");
	});

	it("should support default value", async () => {
		const defaultValue = 1;
		renderComponent({ uiType: numericFieldType }, { defaultValues: { [componentId]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			uiType: numericFieldType,
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
		expect(getTextfield()).toHaveAttribute("readOnly");
		expect(getTextfield()).toBeDisabled();
	});
});
