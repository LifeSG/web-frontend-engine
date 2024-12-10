import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IArrayFieldSchema } from "../../../../components/custom";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const VALUE_CHANGE_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "array-field";
const TEXT_FIELD_ID = "input";
const TEXT_FIELD_LABEL = "TextField";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					referenceKey: UI_TYPE,
					sectionTitle: "Section title",
					fieldSchema: {
						[TEXT_FIELD_ID]: {
							uiType: "text-field",
							label: TEXT_FIELD_LABEL,
						},
					},
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<IArrayFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), overrideSchema);
	merge(json, {
		sections: {
			section: {
				children: {
					[COMPONENT_ID]: overrideField,
				},
			},
		},
	});
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} onValueChange={VALUE_CHANGE_FN} />);
};

const getTextField = (index: number): HTMLElement => {
	const els = screen.getAllByRole("textbox");
	return els[index] ?? null;
};

const getAddButton = (): HTMLElement => {
	return screen.queryByRole("button", { name: "Add" });
};

const getRemoveButton = (index: number): HTMLElement => {
	const els = screen.queryAllByRole("button", { name: "Remove" });
	return els[index] ?? null;
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getTextField(0)).toBeInTheDocument();
	});

	it("should be able to support default values with a single entry", async () => {
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({ [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] })
		);
	});

	it("should be able to support default values with multiple entries", async () => {
		renderComponent(undefined, {
			defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }, { [TEXT_FIELD_ID]: "World" }] },
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({
				[COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }, { [TEXT_FIELD_ID]: "World" }],
			})
		);
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should show error for invalid entries", async () => {
		renderComponent({
			fieldSchema: {
				[TEXT_FIELD_ID]: {
					uiType: "text-field",
					label: TEXT_FIELD_LABEL,
					validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				},
			},
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should handle adding of section", async () => {
		renderComponent();

		fireEvent.click(getAddButton());

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [{}, {}] }));
	});

	describe("when removing section", () => {
		it("should show prompt, then delete the entry and dismiss prompt on confirmation", async () => {
			renderComponent();

			fireEvent.click(getRemoveButton(0));

			expect(screen.queryByText("Remove entry?")).toBeVisible();

			fireEvent.click(screen.queryByTestId("field-remove-prompt__btn-remove"));

			expect(screen.queryByText("Remove entry?")).not.toBeVisible();

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
		});

		it("should show prompt, then retain the entry and dismiss prompt on cancellation", async () => {
			renderComponent();

			fireEvent.click(getRemoveButton(0));

			expect(screen.queryByText("Remove entry?")).toBeVisible();

			fireEvent.click(screen.queryByTestId("field-remove-prompt__btn-back"));

			expect(screen.queryByText("Remove entry?")).not.toBeVisible();

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [{}] }));
		});

		it("should preserve states of other non-removed entries", async () => {
			renderComponent();

			fireEvent.click(getAddButton());
			fireEvent.click(getAddButton());
			fireEvent.change(getTextField(0), { target: { value: "Hello" } });
			fireEvent.change(getTextField(2), { target: { value: "World" } });
			fireEvent.click(getRemoveButton(0));
			fireEvent.click(screen.queryByTestId("field-remove-prompt__btn-remove"));

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: [{}, { input: "World" }] })
			);
			expect(getTextField(0)).toHaveValue("");
			expect(getTextField(1)).toHaveValue("World");
		});

		it("should preserve states of other non-removed entries with default values", async () => {
			renderComponent(undefined, {
				defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }, { [TEXT_FIELD_ID]: "World" }] },
			});

			fireEvent.click(getAddButton());
			fireEvent.click(getRemoveButton(0));
			fireEvent.click(screen.queryByTestId("field-remove-prompt__btn-remove"));

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: [{ input: "World" }, {}] })
			);
			expect(getTextField(0)).toHaveValue("World");
			expect(getTextField(1)).toHaveValue("");
		});

		it("should become valid if invalid section was removed", async () => {
			renderComponent({
				fieldSchema: {
					[TEXT_FIELD_ID]: {
						uiType: "text-field",
						label: TEXT_FIELD_LABEL,
						validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
					},
				},
			});

			fireEvent.change(getTextField(0), { target: { value: "hello" } });
			fireEvent.click(getAddButton());

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).toBeInTheDocument();
			expect(VALUE_CHANGE_FN).toHaveBeenCalledWith(expect.anything(), false);

			fireEvent.click(getRemoveButton(1));
			fireEvent.click(screen.queryByTestId("field-remove-prompt__btn-remove"));

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
			expect(VALUE_CHANGE_FN).toHaveBeenCalledWith(expect.anything(), true);
		});
	});

	it("should support customisation of buttons and confirmation modal", async () => {
		renderComponent({
			addButton: { label: "Plus" },
			removeButton: { label: "Minus" },
			removeConfirmationModal: { title: "Bye bye" },
		});

		expect(screen.queryByText("Plus")).toBeVisible();
		expect(screen.queryByText("Minus")).toBeVisible();

		fireEvent.click(screen.queryByText("Minus"));

		expect(screen.queryByText("Bye bye")).toBeVisible();
	});

	describe("min rule", () => {
		it("should hide remove button but show add button when min items are reached", async () => {
			renderComponent(
				{ validation: [{ min: 1, errorMessage: ERROR_MESSAGE }] },
				{
					defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] },
				}
			);

			expect(getAddButton()).toBeInTheDocument();
			expect(getRemoveButton(0)).not.toBeInTheDocument();
		});

		it("should show error when min rule is not fulfilled", async () => {
			renderComponent({ validation: [{ min: 2, errorMessage: ERROR_MESSAGE }] });

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should not show error when min rule is fulfilled", async () => {
			renderComponent({ validation: [{ min: 2, errorMessage: ERROR_MESSAGE }] });

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });
			fireEvent.click(getAddButton());
			fireEvent.change(getTextField(1), { target: { value: "World" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});

	describe("max rule", () => {
		it("should hide add button but show remove button when max items are reached", async () => {
			renderComponent(
				{ validation: [{ max: 1, errorMessage: ERROR_MESSAGE }] },
				{
					defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] },
				}
			);

			expect(getAddButton()).not.toBeInTheDocument();
			expect(getRemoveButton(0)).toBeInTheDocument();
		});

		it("should show error when max rule is not fulfilled", async () => {
			renderComponent(
				{ validation: [{ max: 1, errorMessage: ERROR_MESSAGE }] },
				{
					defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }, { [TEXT_FIELD_ID]: "World" }] },
				}
			);

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});
	});

	describe("length rule", () => {
		it("should show the specified number of sections and hide buttons", async () => {
			renderComponent({ validation: [{ length: 2, errorMessage: ERROR_MESSAGE }] });

			expect(screen.queryAllByText("Section title")).toHaveLength(2);
			expect(getAddButton()).not.toBeInTheDocument();
			expect(getRemoveButton(0)).not.toBeInTheDocument();
		});

		it("should show the specified number of sections given default value has less elements", async () => {
			renderComponent(
				{ validation: [{ length: 2, errorMessage: ERROR_MESSAGE }] },
				{
					defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] },
				}
			);

			expect(screen.queryAllByText("Section title")).toHaveLength(2);
			expect(getAddButton()).not.toBeInTheDocument();
			expect(getRemoveButton(0)).not.toBeInTheDocument();
		});

		it("should not show error when length rule is fulfilled", async () => {
			renderComponent(
				{ validation: [{ length: 2, errorMessage: ERROR_MESSAGE }] },
				{
					defaultValues: { [COMPONENT_ID]: [{}, {}] },
				}
			);

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it("should show error when length rule is not fulfilled", async () => {
			renderComponent(
				{ validation: [{ length: 2, errorMessage: ERROR_MESSAGE }] },
				{
					defaultValues: { [COMPONENT_ID]: [{}] },
				}
			);

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });

			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [{}] }));
			expect(screen.queryAllByText("Section title")).toHaveLength(1);
		});

		it("should clear selection on reset and remove added items", async () => {
			renderComponent();

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });
			fireEvent.click(getAddButton());
			fireEvent.change(getTextField(1), { target: { value: "World" } });

			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [{}] }));
			expect(screen.queryAllByText("Section title")).toHaveLength(1);
		});

		it("should revert to default value on reset", async () => {
			renderComponent(undefined, {
				defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] },
			});

			fireEvent.click(getAddButton());
			fireEvent.change(getTextField(1), { target: { value: "World" } });

			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] })
			);
			expect(screen.queryAllByText("Section title")).toHaveLength(1);
		});
	});

	describe("dirty state", () => {
		let formIsDirty: boolean;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};

		beforeEach(() => {
			formIsDirty = undefined;
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...JSON_SCHEMA,
						defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] },
					}}
					onClick={handleClick}
				/>
			);

			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...JSON_SCHEMA,
						defaultValues: { [COMPONENT_ID]: [{ [TEXT_FIELD_ID]: "Hello" }] },
					}}
					onClick={handleClick}
				/>
			);

			fireEvent.change(getTextField(0), { target: { value: "Hello" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	describe("form config", () => {
		it("should include form values of unregistered fields if stripUnknown is not true", async () => {
			const mockOnSubmit = jest.fn();
			render(
				<FrontendEngine
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[COMPONENT_ID]: {
										referenceKey: UI_TYPE,
										sectionTitle: "Section title",
										fieldSchema: {
											field1: {
												uiType: "text-field",
												label: "Field 1",
											},
										},
										validation: [{ length: 1 }],
									},
									...getSubmitButtonProps(),
								},
							},
						},
						stripUnknown: false,
						defaultValues: {
							[COMPONENT_ID]: [{ nonExistentField: "hello world" }],
						},
					}}
					onSubmit={mockOnSubmit}
				/>
			);

			fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(mockOnSubmit).toHaveBeenLastCalledWith({
				field: [
					{
						field1: "hello",
						nonExistentField: "hello world",
					},
				],
			});
		});

		it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
			const mockOnSubmit = jest.fn();
			render(
				<FrontendEngine
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[COMPONENT_ID]: {
										referenceKey: UI_TYPE,
										sectionTitle: "Section title",
										fieldSchema: {
											field1: {
												uiType: "text-field",
												label: "Field 1",
												showIf: [{ field2: [{ empty: true }] }],
											},
										},
										validation: [{ length: 1 }],
									},
									...getSubmitButtonProps(),
								},
							},
						},
						stripUnknown: true,
						defaultValues: {
							[COMPONENT_ID]: [{ nonExistentField: "hello world" }],
						},
					}}
					onSubmit={mockOnSubmit}
				/>
			);

			fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(mockOnSubmit).toHaveBeenLastCalledWith({
				field: [
					{
						field1: "hello",
					},
				],
			});
		});
	});

	warningTestSuite<IArrayFieldSchema>({
		referenceKey: UI_TYPE,
		fieldSchema: {
			[TEXT_FIELD_ID]: {
				uiType: "text-field",
				label: TEXT_FIELD_LABEL,
			},
		},
	});
});
