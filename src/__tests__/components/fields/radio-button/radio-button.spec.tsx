import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IRadioButtonGroupSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const uiType = "radio";

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
				uiType,
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

describe(uiType, () => {
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

	describe("update options schema", () => {
		const CustomComponent = () => {
			const [options, setOptions] = useState([
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry" },
			]);
			return (
				<>
					<FrontendEngine
						data={{
							id: FRONTEND_ENGINE_ID,
							fields: {
								[componentId]: { label: "Radio", uiType, options },
								...getSubmitButtonProps(),
							},
						}}
						onSubmit={submitFn}
					/>
					<Button.Default
						onClick={() =>
							setOptions([
								{ label: "A", value: "Apple" },
								{ label: "B", value: "b" },
								{ label: "C", value: "Cherry" },
							])
						}
					>
						Update options
					</Button.Default>
				</>
			);
		};

		it.each`
			scenario                                                                 | selected | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field value if option is not removed on schema update"} | ${"A"}   | ${"Apple"}                | ${"Apple"}
			${"should clear field value if option is removed on schema update"}      | ${"B"}   | ${"Berry"}                | ${""}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string>) => {
				render(<CustomComponent />);

				fireEvent.click(screen.getByLabelText(selected));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: expectedValueBeforeUpdate }));

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: expectedValueAfterUpdate }));
			}
		);
	});
});
