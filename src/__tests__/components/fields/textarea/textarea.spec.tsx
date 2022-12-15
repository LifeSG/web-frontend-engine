import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ITextareaSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	SUBMIT_BUTTON_ID,
	SUBMIT_BUTTON_NAME,
	TOverrideField,
	TOverrideSchema,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "textarea";
const componentLabel = "Textarea";

const renderComponent = (overrideField?: TOverrideField<ITextareaSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: componentLabel,
				fieldType: "textarea",
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

describe(fieldType, () => {
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

	it("should support default value", async () => {
		const defaultValue = "hello";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		expect(screen.getByText(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
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

		fireEvent.change(screen.getByRole("textbox", { name: componentLabel }), {
			target: { value: "Hello" },
		});
		fireEvent.click(screen.getByText("Pill 1"));

		expect(screen.getByText("Hello Pill 1")).toBeInTheDocument();
	});

	it("should pass other props into the field", () => {
		renderComponent({
			rows: 5,
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("rows", "5");
		expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("placeholder", "placeholder");
		expect(screen.getByRole("textbox", { name: componentLabel })).toHaveAttribute("readonly");
		expect(screen.getByRole("textbox", { name: componentLabel })).toBeDisabled();
	});
});
