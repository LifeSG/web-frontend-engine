import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { ICheckboxGroupSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "checkbox";

const renderComponent = (overrideField?: TOverrideField<ICheckboxGroupSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				label: "Checkbox",
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

const getCheckboxes = (): HTMLElement[] => {
	return screen
		.getAllByRole("checkbox")
		.map((checkbox) => checkbox.querySelector("input"))
		.filter(Boolean);
};

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getCheckboxes()).toHaveLength(2);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [componentId]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const checkboxes = getCheckboxes();
		checkboxes.forEach((checkbox) => {
			if (defaultValues.includes((checkbox as HTMLInputElement).value)) {
				expect(checkbox.nextElementSibling.tagName).toBe("svg");
			} else {
				expect(checkbox.nextElementSibling).not.toBeInTheDocument();
			}
		});
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const checkboxes = getCheckboxes();
		checkboxes.forEach((checkbox) => {
			expect(checkbox).toBeDisabled();
		});

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: undefined }));
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const checkboxes = getCheckboxes();

		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: ["Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: [] }));
	});

	it.each`
		displaySize  | expected
		${"small"}   | ${"1.5rem"}
		${"default"} | ${"2rem"}
	`("should be support different displaySizes", ({ displaySize, expected }) => {
		renderComponent({ displaySize: displaySize });
		const checkboxes = getCheckboxes().map((checkbox) => checkbox.parentElement);

		expect(
			checkboxes.forEach((checkbox) => {
				expect(checkbox).toHaveStyle({ width: expected, height: expected });
			})
		);
	});

	describe("update options schema", () => {
		const CustomComponent = () => {
			const [options, setOptions] = useState([
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry" },
				{ label: "C", value: "Cherry" },
				{ label: "D", value: "Durian" },
			]);
			return (
				<>
					<FrontendEngine
						data={{
							id: FRONTEND_ENGINE_ID,
							fields: {
								[componentId]: { label: "Checkbox", fieldType, options },
								...getSubmitButtonProps(),
							},
						}}
						onSubmit={submitFn}
					/>
					<Button.Default
						onClick={() =>
							setOptions([
								{ label: "A", value: "Apple" },
								{ label: "B", value: "Berry" },
								{ label: "C", value: "C" },
								{ label: "E", value: "Eggplant" },
							])
						}
					>
						Update options
					</Button.Default>
				</>
			);
		};
		it.each`
			scenario                                                                             | selected      | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field values if option is not removed on schema update"}            | ${["A", "B"]} | ${["Apple", "Berry"]}     | ${["Apple", "Berry"]}
			${"should clear field values if option is removed on schema update"}                 | ${["C", "D"]} | ${["Cherry", "Durian"]}   | ${[]}
			${"should retain the field values of options that are not removed on schema update"} | ${["A", "D"]} | ${["Apple", "Durian"]}    | ${["Apple"]}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(<CustomComponent />);

				selected.forEach((value) => fireEvent.click(screen.getByLabelText(value)));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: expectedValueBeforeUpdate }));

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: expectedValueAfterUpdate }));
			}
		);
	});
});
