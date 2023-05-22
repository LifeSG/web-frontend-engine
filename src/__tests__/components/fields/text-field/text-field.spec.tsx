import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FrontendEngine } from "../../../../components";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Textfield";
const DEFAULT_FIELD_TYPE = "text-field";
const EMAIL_FIELD_TYPE = "email-field";
const NUMERIC_FIELD_TYPE = "numeric-field";

const renderComponent = (
	overrideField?: Partial<ITextFieldSchema | IEmailFieldSchema | INumericFieldSchema> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Textfield",
						uiType: DEFAULT_FIELD_TYPE,
						...overrideField,
					},
					...getSubmitButtonProps(),
					...getResetButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getTextfield = (role: "textbox" | "spinbutton" = "textbox"): HTMLElement => {
	return getField(role, COMPONENT_LABEL);
};

describe(DEFAULT_FIELD_TYPE, () => {
	const EXPECTED_TEXT = "test this has been pasted";
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
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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

	it("should not prevent copy and paste if `preventCopyAndPaste` is false", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: false,
			},
		});
		const textField = getTextfield();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_TEXT));
		expect(textField).toHaveValue(EXPECTED_TEXT);
	});

	it("should prevent copy and paste if `preventCopyAndPaste` is true", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: true,
			},
		});
		const textField = getTextfield();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_TEXT));
		expect(textField).toHaveValue("");
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should allow drag and drop text into field if preventDragAndDrop is not true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: true,
			},
		});
		const textField = getTextfield();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_TEXT } });
		expect(textField).toHaveValue(EXPECTED_TEXT);
		expect(event).toBe(false);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should prevent drag & drop text into field if preventDragAndDrop is true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: false,
			},
		});
		const textField = getTextfield();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_TEXT } });
		expect(event).toBe(true);
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getTextfield(), { target: { value: "hello" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield()).toHaveValue("");
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "hello";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getTextfield(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield()).toHaveValue(defaultValue);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});
});

describe(EMAIL_FIELD_TYPE, () => {
	const EXPECTED_EMAIL = "aa@aa.com";
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent({ uiType: EMAIL_FIELD_TYPE });

		expect(getTextfield()).toBeInTheDocument();
	});

	it("should validate email format", async () => {
		renderComponent({ uiType: EMAIL_FIELD_TYPE });

		fireEvent.change(getTextfield(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText("Invalid email address")).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({
			uiType: EMAIL_FIELD_TYPE,
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent({ uiType: EMAIL_FIELD_TYPE });

		expect(getTextfield()).toHaveAttribute("inputMode", "email");
	});

	it("should apply maxLength attribute if max validation is specified", () => {
		renderComponent({ uiType: EMAIL_FIELD_TYPE, validation: [{ max: 5 }] });

		expect(getTextfield()).toHaveAttribute("maxLength", "5");
	});

	it("should apply maxLength attribute if length validation is specified", () => {
		renderComponent({ uiType: EMAIL_FIELD_TYPE, validation: [{ length: 5 }] });

		expect(getTextfield()).toHaveAttribute("maxLength", "5");
	});

	it("should support default value", async () => {
		const defaultValue = "john@doe.tld";
		renderComponent({ uiType: EMAIL_FIELD_TYPE }, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			uiType: EMAIL_FIELD_TYPE,
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
		expect(getTextfield()).toHaveAttribute("readOnly");
		expect(getTextfield()).toBeDisabled();
	});

	it("should not prevent copy and paste if `preventCopyAndPaste` is false", async () => {
		renderComponent({
			uiType: EMAIL_FIELD_TYPE,
			customOptions: {
				preventCopyAndPaste: false,
			},
		});
		const textField = getTextfield();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_EMAIL));
		expect(textField).toHaveValue(EXPECTED_EMAIL);
	});

	it("should prevent copy and paste if `preventCopyAndPaste` is true", async () => {
		renderComponent({
			uiType: EMAIL_FIELD_TYPE,
			customOptions: {
				preventCopyAndPaste: true,
			},
		});
		const textField = getTextfield();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_EMAIL));
		expect(textField).toHaveValue("");
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should allow drag and drop email into field if preventDragAndDrop is not true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: true,
			},
		});
		const textField = getTextfield();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_EMAIL } });
		expect(textField).toHaveValue(EXPECTED_EMAIL);
		expect(event).toBe(false);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should prevent drag & drop email into field if preventDragAndDrop is true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: false,
			},
		});
		const textField = getTextfield();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_EMAIL } });
		expect(event).toBe(true);
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent({ uiType: EMAIL_FIELD_TYPE });

			fireEvent.change(getTextfield(), { target: { value: "john@doe.com" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield()).toHaveValue("");
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "john@doe.com";
			renderComponent({ uiType: EMAIL_FIELD_TYPE }, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getTextfield(), { target: { value: "lorem@ipsum.com" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield()).toHaveValue(defaultValue);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});
});

describe(NUMERIC_FIELD_TYPE, () => {
	const EXPECTED_NUMBER = 10;
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE });

		expect(getTextfield("spinbutton")).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({
			uiType: NUMERIC_FIELD_TYPE,
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE });

		expect(getTextfield("spinbutton")).toHaveAttribute("inputMode", "numeric");
	});

	it("should apply min attribute if min validation is specified", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE, validation: [{ min: 5 }] });

		expect(getTextfield("spinbutton")).toHaveAttribute("min", "5");
	});

	it("should apply max attribute if max validation is specified", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE, validation: [{ max: 5 }] });

		expect(getTextfield("spinbutton")).toHaveAttribute("max", "5");
	});

	it("should support default value", async () => {
		const defaultValue = 1;
		renderComponent({ uiType: NUMERIC_FIELD_TYPE }, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			uiType: NUMERIC_FIELD_TYPE,
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getTextfield("spinbutton")).toHaveAttribute("placeholder", "placeholder");
		expect(getTextfield("spinbutton")).toHaveAttribute("readOnly");
		expect(getTextfield("spinbutton")).toBeDisabled();
	});

	it("should not prevent copy and paste if `preventCopyAndPaste` is false", async () => {
		renderComponent({
			uiType: NUMERIC_FIELD_TYPE,
			customOptions: {
				preventCopyAndPaste: false,
			},
		});
		const textField = getTextfield("spinbutton");
		textField.focus();
		await waitFor(() => userEvent.paste(`${EXPECTED_NUMBER}`));
		expect(textField).toHaveValue(EXPECTED_NUMBER);
	});

	it("should prevent copy and paste if `preventCopyAndPaste` is true", async () => {
		renderComponent({
			uiType: NUMERIC_FIELD_TYPE,
			customOptions: {
				preventCopyAndPaste: true,
			},
		});
		const textField = getTextfield("spinbutton");
		textField.focus();
		await waitFor(() => userEvent.paste(`${EXPECTED_NUMBER}`));
		expect(textField).toHaveValue(null);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should allow drag and drop number into field if preventDragAndDrop is not true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: true,
			},
		});
		const textField = getTextfield();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_NUMBER } });
		expect(textField).toHaveValue(`${EXPECTED_NUMBER}`);
		expect(event).toBe(false);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should prevent drag & drop number into field if preventDragAndDrop is true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: false,
			},
		});
		const textField = getTextfield();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_NUMBER } });
		expect(event).toBe(true);
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent({ uiType: NUMERIC_FIELD_TYPE });

			fireEvent.change(getTextfield("spinbutton"), { target: { value: 1 } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield("spinbutton")).toHaveValue(null);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = 1;
			renderComponent({ uiType: NUMERIC_FIELD_TYPE }, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getTextfield("spinbutton"), { target: { value: 2 } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield("spinbutton")).toHaveValue(defaultValue);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});
});
