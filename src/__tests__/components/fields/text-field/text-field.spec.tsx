import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ITextFieldSchema } from "../../../../components/fields";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getField,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Textfield";
const UI_TYPE = "text-field";
const EXPECTED_TEXT = "test this has been pasted";

const renderComponent = createRenderComponent<ITextFieldSchema>({
	componentId: COMPONENT_ID,
	baseSchema: { label: COMPONENT_LABEL, uiType: UI_TYPE },
	submitFn: SUBMIT_FN,
});

const getTextfield = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

describe(UI_TYPE, () => {
	afterEach(() => {
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
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
		expect(getTextfield()).toHaveAttribute("readonly");
		expect(getTextfield()).toHaveAttribute("aria-disabled", "true");
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

	// testing the return value of onChange event when customOptions.uppercase is set to true
	it("should return string in uppercase if uppercase is true", () => {
		renderComponent({
			customOptions: {
				textTransform: "uppercase",
			},
		});

		fireEvent.change(getTextfield(), { target: { value: "hello" } });
		expect(getTextfield()).toHaveValue("HELLO");
	});

	describe("addOn", () => {
		it("should be able to render the icon add on", async () => {
			renderComponent({
				customOptions: {
					addOn: { type: "icon", icon: "TicketIcon" },
				},
			});

			fireEvent.change(getTextfield(), { target: { value: "hello" } });

			const startIcon = document.querySelector("svg");
			expect(startIcon).toBeInTheDocument();
			expect(getTextfield()).toHaveValue("hello");

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "hello" }));
		});

		it("should be able to render the label add on", async () => {
			renderComponent({
				customOptions: {
					addOn: { type: "label", value: "$" },
				},
			});

			const textfield = screen.getByTestId("input");
			fireEvent.change(textfield, { target: { value: "hello" } });

			expect(screen.getByText("$")).toBeInTheDocument();
			expect(textfield).toHaveValue("hello");

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "hello" }));
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getTextfield(), { target: { value: "hello" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield()).toHaveValue("");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "hello";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getTextfield(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextfield()).toHaveValue(defaultValue);
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: "hello",
		modifyField: () => fireEvent.change(getTextfield(), { target: { value: "world" } }),
	});

	labelTestSuite(renderComponent);
});
