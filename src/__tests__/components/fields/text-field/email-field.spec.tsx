import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IEmailFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getField,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Email";
const UI_TYPE = "email-field";
const EXPECTED_VALUE = "aa@aa.com";

const renderComponent = createRenderComponent<IEmailFieldSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: COMPONENT_LABEL,
		uiType: UI_TYPE,
	},
	submitFn: SUBMIT_FN,
});

const getEmailField = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getEmailField()).toBeInTheDocument();
	});

	it("should validate email format", async () => {
		renderComponent();

		fireEvent.change(getEmailField(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText(ERROR_MESSAGES.EMAIL.INVALID)).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent();

		expect(getEmailField()).toHaveAttribute("inputMode", "email");
	});

	it("should apply maxLength attribute if max validation is specified", () => {
		renderComponent({ validation: [{ max: 5 }] });

		expect(getEmailField()).toHaveAttribute("maxLength", "5");
	});

	it("should apply maxLength attribute if length validation is specified", () => {
		renderComponent({ validation: [{ length: 5 }] });

		expect(getEmailField()).toHaveAttribute("maxLength", "5");
	});

	it("should support default value", async () => {
		const defaultValue = "john@doe.tld";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getEmailField()).toHaveAttribute("placeholder", "placeholder");
		expect(getEmailField()).toHaveAttribute("readOnly");
		expect(getEmailField()).toHaveAttribute("aria-disabled", "true");
	});

	it("should not prevent copy and paste if `preventCopyAndPaste` is false", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: false,
			},
		});
		const textField = getEmailField();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_VALUE));
		expect(textField).toHaveValue(EXPECTED_VALUE);
	});

	it("should prevent copy and paste if `preventCopyAndPaste` is true", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: true,
			},
		});
		const textField = getEmailField();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_VALUE));
		expect(textField).toHaveValue("");
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should allow drag and drop email into field if preventDragAndDrop is not true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: true,
			},
		});
		const textField = getEmailField();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_VALUE } });
		expect(textField).toHaveValue(EXPECTED_VALUE);
		expect(event).toBe(false);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should prevent drag & drop email into field if preventDragAndDrop is true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: false,
			},
		});
		const textField = getEmailField();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_VALUE } });
		expect(event).toBe(true);
	});

	describe("addOn", () => {
		it("should be able to render the icon add on", async () => {
			renderComponent({
				customOptions: {
					addOn: { type: "icon", icon: "TicketIcon" },
				},
			});

			fireEvent.change(getEmailField(), { target: { value: "john@doe.com" } });

			const startIcon = document.querySelector("svg");
			expect(startIcon).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "john@doe.com" }));
		});

		it("should be able to render the label add on", async () => {
			renderComponent({
				customOptions: {
					addOn: { type: "label", value: "#" },
				},
			});

			const emailField = screen.getByTestId("input");
			fireEvent.change(emailField, { target: { value: "john@doe.com" } });

			expect(screen.getByText("#")).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "john@doe.com" }));
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getEmailField(), { target: { value: "john@doe.com" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getEmailField()).toHaveValue("");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "john@doe.com";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getEmailField(), { target: { value: "lorem@ipsum.com" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getEmailField()).toHaveValue(defaultValue);
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: "john@doe.tld",
		modifyField: () => fireEvent.change(getEmailField(), { target: { value: "world" } }),
	});

	labelTestSuite(renderComponent);
	warningTestSuite<IEmailFieldSchema>({ label: COMPONENT_LABEL, uiType: UI_TYPE });
});
