import { fireEvent, render, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IRadioButtonGroupSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
	TOverrideField,
	TOverrideSchema,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "radio";

const getRadioButtonA = (): HTMLElement => {
	return getField("radio", "A");
};

const getRadioButtonB = (): HTMLElement => {
	return getField("radio", "B");
};

const renderComponent = (overrideField?: TOverrideField<IRadioButtonGroupSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Radio",
				fieldType,
				options: [
					{ label: "A", value: "Apple" },
					{ label: "B", value: "Berry" },
				],
				...overrideField,
			},
			...getSubmitButtonProps(),
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

		expect(getRadioButtonA()).toBeInTheDocument();
		expect(getRadioButtonB()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "Apple";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		expect(getRadioButtonA()).toBeChecked();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getRadioButtonA()).toBeDisabled();
		expect(getRadioButtonB()).toBeDisabled();
	});
});
