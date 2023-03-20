import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactElement, ReactNode, useState } from "react";
import { FrontendEngine } from "../../../../components";
import { ICheckboxGroupSchema } from "../../../../components/fields";
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
const fieldType = "select";

const renderComponent = (overrideField?: TOverrideField<ICheckboxGroupSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Select",
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

const getSelectToggle = (): HTMLElement => {
	return getField("button", "Select");
};

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getSelectToggle()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultLabel = "A";
		const defaultValue = "Apple";
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByTestId(componentId)).toHaveTextContent(defaultLabel);
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getSelectToggle().parentElement).toHaveAttribute("disabled");
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(screen.getByText(placeholder)).toBeInTheDocument();
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
								[componentId]: { label: "Select", fieldType, options },
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

				fireEvent.click(screen.getByRole("button", { name: selected }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: expectedValueBeforeUpdate }));

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: expectedValueAfterUpdate }));
			}
		);
	});
});
