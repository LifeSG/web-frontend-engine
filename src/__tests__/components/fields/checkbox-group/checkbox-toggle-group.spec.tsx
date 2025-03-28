import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { TCheckboxGroupSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
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
import { labelTestSuite } from "../../../common/tests";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const NESTED_FIELD_ID = "nested-field";
const UI_TYPE = "checkbox";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Toggle",
					uiType: UI_TYPE,
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ label: "A", value: "Apple" },
						{ label: "B", value: "Berry" },
						{ label: "C", value: "Cherry" },
						{ label: "D", value: "Durian" },
					],
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<TCheckboxGroupSchema>, overrideSchema?: TOverrideSchema) => {
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
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const ComponentWithSetSchemaButton = (props: { onClick: (data: IFrontendEngineData) => IFrontendEngineData }) => {
	const { onClick } = props;
	const [schema, setSchema] = useState<IFrontendEngineData>(JSON_SCHEMA);
	return (
		<>
			<FrontendEngine data={schema} onSubmit={SUBMIT_FN} />
			<Button.Default onClick={() => setSchema(onClick)}>Update options</Button.Default>
		</>
	);
};

const getToggles = (): HTMLElement[] => {
	return screen.getAllByRole("checkbox");
};

const getNestedField = (): HTMLElement => {
	return screen.queryByRole("textbox");
};

describe("checkbox toggle group", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getToggles()).toHaveLength(4);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const toggles = getToggles();
		const checkbox = toggles.find((chkbx) => chkbx.nextElementSibling.querySelector("label").textContent === "A");
		expect(checkbox).toBeChecked();
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured for options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry", disabled: true },
			],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const toggles = getToggles();
		expect(toggles[0]).toBeEnabled();
		expect(toggles[1]).toBeDisabled();

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const toggles = getToggles();
		toggles.forEach((checkbox) => {
			expect(checkbox).toBeDisabled();
		});

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
	});

	it("should be disabled if configured for both component/options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple", disabled: false },
				{ label: "B", value: "Berry", disabled: false },
			],
			disabled: true,
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const toggles = getToggles();
		toggles.forEach((checkbox) => {
			expect(checkbox).toBeDisabled();
		});

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const toggles = getToggles();

		await waitFor(() => fireEvent.click(toggles[0]));
		await waitFor(() => fireEvent.click(toggles[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(toggles[0]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));

		await waitFor(() => fireEvent.click(toggles[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
	});

	it("should be able to render HTML string in option label", () => {
		renderComponent({
			options: [{ label: "<strong>HTML Label</strong>", value: "HTML Label" }],
		});

		expect(screen.getByText("HTML Label")).toBeInTheDocument();
		expect(screen.getByText("HTML Label").nodeName).toBe("STRONG");
	});

	it("should be able to sanitise HTML string in option label", () => {
		renderComponent({
			className: "checkbox-field",
			options: [
				{ label: "This is a sanitized string<script>console.log('hello world')</script>", value: "HTML Label" },
			],
		});

		expect(screen.getByText("This is a sanitized string")).toBeInTheDocument();
		expect(document.querySelector(".checkbox-field").innerHTML.includes("script")).toBe(false);
	});

	it("should be able to render FEE schema in option label", () => {
		renderComponent({
			options: [{ label: { text: { uiType: "span", children: "Schema Label" } }, value: "Schema Label" }],
		});

		expect(screen.getByText("Schema Label")).toBeInTheDocument();
	});

	it("should be able to render option subLabel", () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple", subLabel: "Keeps the doctor away" },
				{ label: "B", value: "Berry", subLabel: "Berry nutritious, good for you" },
			],
		});

		expect(screen.getByText("Keeps the doctor away")).toBeInTheDocument();
		expect(screen.getByText("Berry nutritious, good for you")).toBeInTheDocument();
	});

	describe("update options through schema", () => {
		it.each`
			scenario                                                                             | selected      | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field values if option is not removed on schema update"}            | ${["A", "B"]} | ${["Apple", "Berry"]}     | ${["Apple", "Berry"]}
			${"should clear field values if option is removed on schema update"}                 | ${["C", "D"]} | ${["Cherry", "Durian"]}   | ${[]}
			${"should retain the field values of options that are not removed on schema update"} | ${["A", "D"]} | ${["Apple", "Durian"]}    | ${["Apple"]}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(
					<ComponentWithSetSchemaButton
						onClick={(data) =>
							merge(cloneDeep(data), {
								sections: {
									section: {
										children: {
											[COMPONENT_ID]: {
												options: [
													{ label: "A", value: "Apple" },
													{ label: "B", value: "Berry" },
													{ label: "C", value: "c" },
													{ label: "E", value: "Eggplant" },
												],
											},
										},
									},
								},
							})
						}
					/>
				);

				selected.forEach((value) => fireEvent.click(screen.getByLabelText(value)));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate }));
			}
		);
	});

	describe("update options through overrides", () => {
		it.each`
			scenario                                                                          | selected      | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field values if particular field is not overridden"}             | ${["A", "B"]} | ${["Apple", "Berry"]}     | ${["Apple", "Berry"]}
			${"should clear field values if option is removed through overriding"}            | ${["C", "D"]} | ${["Cherry", "Durian"]}   | ${[]}
			${"should retain the field values of options that are not removed on overriding"} | ${["A", "D"]} | ${["Apple", "Durian"]}    | ${["Apple"]}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(
					<ComponentWithSetSchemaButton
						onClick={(data) => ({
							...data,
							overrides: {
								[COMPONENT_ID]: {
									options: [
										{ label: "A", value: "Apple" },
										{ label: "B", value: "Berry" },
										{ label: "C", value: "c" },
										{ label: "E", value: "Eggplant" },
									],
								},
							},
						})}
					/>
				);

				selected.forEach((value) => fireEvent.click(screen.getByLabelText(value)));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate }));
			}
		);
	});

	describe("nested fields in options", () => {
		it("should be able to support default values in nested field", async () => {
			const defaultValues = ["Apple"];
			const defaultTextAreaValue = "Fuji";
			renderComponent(
				{
					options: [
						{
							label: "A",
							value: "Apple",
							children: { [NESTED_FIELD_ID]: { uiType: "text-field", label: "Variety" } },
						},
					],
				},
				{
					defaultValues: {
						[COMPONENT_ID]: defaultValues,
						[NESTED_FIELD_ID]: defaultTextAreaValue,
					},
				}
			);

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: defaultValues,
					[NESTED_FIELD_ID]: defaultTextAreaValue,
				})
			);
		});

		it("should be able to support validation for nested field", async () => {
			renderComponent({
				options: [
					{
						label: "A",
						value: "Apple",
						children: {
							[NESTED_FIELD_ID]: {
								uiType: "text-field",
								label: "Variety",
								validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
							},
						},
					},
				],
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();

			fireEvent.change(getNestedField(), { target: { value: "Hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[NESTED_FIELD_ID]: "Hello",
				})
			);
		});

		it("should be able to support validation for conditionally rendered nested field", async () => {
			renderComponent({
				options: [
					{
						label: "A",
						value: "Apple",
						children: {
							[NESTED_FIELD_ID]: {
								uiType: "text-field",
								label: "Variety",
								validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
								showIf: [{ [COMPONENT_ID]: [{ filled: true }, { includes: ["Apple"] }] }],
							},
						},
					},
				],
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.not.objectContaining({ [NESTED_FIELD_ID]: expect.anything() })
			);

			const checkboxes = getToggles();
			fireEvent.click(checkboxes[0]);
			fireEvent.change(getNestedField(), { target: { value: "Hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: ["Apple"],
					[NESTED_FIELD_ID]: "Hello",
				})
			);
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			const checkboxes = getToggles();
			fireEvent.click(checkboxes[0]);
			fireEvent.click(checkboxes[1]);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(checkboxes[0]).not.toBeChecked();
			expect(checkboxes[1]).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = ["Apple"];
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			const checkboxes = getToggles();
			fireEvent.click(checkboxes[1]);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(checkboxes[0]).toBeChecked();
			expect(checkboxes[1]).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			const toggles = getToggles();
			await waitFor(() => fireEvent.click(toggles[0]));
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: ["Apple"] } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			const toggles = getToggles();
			await waitFor(() => fireEvent.click(toggles[0]));
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: ["Apple"] } }}
					onClick={handleClick}
				/>
			);
			const toggles = getToggles();
			await waitFor(() => fireEvent.click(toggles[1]));
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
});
