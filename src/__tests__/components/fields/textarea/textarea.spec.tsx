import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ITextareaSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideField, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "textarea";
const componentTestId = TestHelper.generateId(componentId, fieldType);

const renderComponent = (overrideField?: TOverrideField<ITextareaSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			[componentId]: {
				label: "Textarea",
				fieldType: "textarea",
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

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		const component = renderComponent();

		expect(component.container.querySelector(`textarea#field__textarea-base`)).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should support default value", async () => {
		const defaultValue = "hello";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();
	});

	it("should be able to show character counter if maxLength is defined", () => {
		renderComponent({ maxLength: 100 });

		expect(screen.getByText("100 characters left")).toBeInTheDocument();
	});

	it("should show pills as defined in chipTexts", () => {
		renderComponent({ chipTexts: ["Pill 1", "Pill 2", "Pill 3"] });

		expect(screen.getByText("Pill 1")).toBeInTheDocument();
		expect(screen.getByText("Pill 2")).toBeInTheDocument();
		expect(screen.getByText("Pill 3")).toBeInTheDocument();
	});

	it("should append text upon clicking a pill", () => {
		renderComponent({ chipTexts: ["Pill 1", "Pill 2", "Pill 3"] });

		fireEvent.change(screen.getByTestId("field__textarea"), { target: { value: "Hello" } });
		fireEvent.click(screen.getByText("Pill 1"));
		expect(screen.getByDisplayValue("Hello Pill 1")).toBeInTheDocument();
	});

	it("should pass other props into the field", () => {
		renderComponent({
			rows: 5,
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});
		expect(screen.getByTestId("field__textarea").getAttribute("rows")).toBe("5");
		expect(screen.getByTestId("field__textarea").getAttribute("placeholder")).toBe("placeholder");
		expect(screen.getByTestId("field__textarea").getAttribute("readOnly")).toBeDefined();
		expect(screen.getByTestId("field__textarea").getAttribute("disabled")).toBeDefined();
	});
});
