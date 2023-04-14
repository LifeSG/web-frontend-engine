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
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getTextfield = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

describe(DEFAULT_FIELD_TYPE, () => {
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
});

describe(EMAIL_FIELD_TYPE, () => {
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
});

describe(NUMERIC_FIELD_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE });

		expect(getTextfield()).toBeInTheDocument();
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

		expect(getTextfield()).toHaveAttribute("inputMode", "numeric");
	});

	it("should apply min attribute if min validation is specified", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE, validation: [{ min: 5 }] });

		expect(getTextfield()).toHaveAttribute("min", "5");
	});

	it("should apply max attribute if max validation is specified", () => {
		renderComponent({ uiType: NUMERIC_FIELD_TYPE, validation: [{ max: 5 }] });

		expect(getTextfield()).toHaveAttribute("max", "5");
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

		expect(getTextfield()).toHaveAttribute("placeholder", "placeholder");
		expect(getTextfield()).toHaveAttribute("readOnly");
		expect(getTextfield()).toBeDisabled();
	});
});
