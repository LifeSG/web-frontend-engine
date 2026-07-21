import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { TRadioButtonGroupSchema } from "../../../../components/fields";
import { IRadioButtonToggleSchema } from "../../../../components/fields/radio-button/types";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const NESTED_FIELD_ID = "nested-field";
const UI_TYPE = "radio";

const getRadioButtonA = (): HTMLElement => {
	return getField("radio", "A");
};

const getRadioButtonB = (): HTMLElement => {
	return getField("radio", "B");
};

const getNestedField = (): HTMLElement => {
	return screen.queryByRole("textbox");
};

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Radio",
					uiType: UI_TYPE,
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ label: "A", value: "Apple" },
						{ label: "B", value: "Berry" },
					],
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (
	overrideField?: Partial<Omit<IRadioButtonToggleSchema, "uiType">>,
	overrideSchema?: TOverrideSchema
) => {
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

describe("radio toggle button", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getRadioButtonA()).toBeInTheDocument();
		expect(getRadioButtonB()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "Apple";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(getRadioButtonA()).toBeChecked();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should show error immediately when selected value fails notEquals validation", async () => {
		renderComponent({
			validation: [{ required: true }, { notEquals: "Apple", errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));
		fireEvent.click(getRadioButtonA());

		await waitFor(() => expect(getErrorMessage()).toBeInTheDocument());
	});

	it("should clear error when selected value passes notEquals validation", async () => {
		renderComponent({
			validation: [{ required: true }, { notEquals: "Apple", errorMessage: ERROR_MESSAGE }],
		});

		// Trigger validation by submitting with invalid value
		fireEvent.click(getRadioButtonA());
		await waitFor(() => fireEvent.click(getSubmitButton()));
		await waitFor(() => expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument());

		// Select valid value — error should clear
		fireEvent.click(getRadioButtonB());
		await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument());
	});

	it("should be disabled if configured for options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry", disabled: true },
			],
		});

		expect(getRadioButtonA()).toBeEnabled();
		expect(getRadioButtonB()).toBeDisabled();
	});

	it("should be disabled if configured for component", async () => {
		renderComponent({ disabled: true });

		// Button are only visually disabled if configured on the component level
		expect(getRadioButtonA()).toHaveAttribute("aria-disabled", "true");
		expect(getRadioButtonB()).toHaveAttribute("aria-disabled", "true");

		expect(getRadioButtonA()).toHaveAttribute("tabindex", "0");
		expect(getRadioButtonB()).toHaveAttribute("tabindex", "0");
	});

	it("should be disabled if configured for both component/options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple", disabled: false },
				{ label: "B", value: "Berry", disabled: false },
			],
			disabled: true,
		});

		// Button are only visually disabled if configured on the component level
		expect(getRadioButtonA()).toHaveAttribute("aria-disabled", "true");
		expect(getRadioButtonB()).toHaveAttribute("aria-disabled", "true");

		expect(getRadioButtonA()).toHaveAttribute("tabindex", "0");
		expect(getRadioButtonB()).toHaveAttribute("tabindex", "0");
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
			className: "radio-field",
			options: [
				{ label: "This is a sanitized string<script>console.log('hello world')</script>", value: "HTML Label" },
			],
		});

		expect(screen.getByText("This is a sanitized string")).toBeInTheDocument();
		expect(document.querySelector(".radio-field").innerHTML.includes("script")).toBe(false);
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
			scenario                                                                 | selected | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field value if option is not removed on schema update"} | ${"A"}   | ${"Apple"}                | ${"Apple"}
			${"should clear field value if option is removed on schema update"}      | ${"B"}   | ${"Berry"}                | ${""}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string>) => {
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
													{ label: "B", value: "b" },
													{ label: "C", value: "Cherry" },
												],
											},
										},
									},
								},
							})
						}
					/>
				);

				fireEvent.click(screen.getByLabelText(selected));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
				);
			}
		);
	});

	describe("update options through overrides", () => {
		it.each`
			scenario                                                              | selected | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field value if option is not removed on overriding"} | ${"A"}   | ${"Apple"}                | ${"Apple"}
			${"should clear field value if option is removed on overriding"}      | ${"B"}   | ${"Berry"}                | ${""}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string>) => {
				render(
					<ComponentWithSetSchemaButton
						onClick={(data) => ({
							...data,
							overrides: {
								[COMPONENT_ID]: {
									options: [
										{ label: "A", value: "Apple" },
										{ label: "B", value: "b" },
									],
								},
							},
						})}
					/>
				);
				fireEvent.click(screen.getByLabelText(selected));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
				);
			}
		);
	});

	describe("nested fields in options", () => {
		it("should be able to support default values in nested field", async () => {
			const defaultValues = "Apple";
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
								showIf: [{ [COMPONENT_ID]: [{ equals: "Apple" }] }],
							},
						},
					},
				],
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "" }));
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.not.objectContaining({ [NESTED_FIELD_ID]: expect.anything() })
			);

			fireEvent.click(getRadioButtonA());
			fireEvent.change(getNestedField(), { target: { value: "Hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: "Apple",
					[NESTED_FIELD_ID]: "Hello",
				})
			);
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();
			const apple = getRadioButtonA();

			fireEvent.click(apple);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(apple).not.toBeChecked();
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "Apple";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			const apple = getRadioButtonA();
			const berry = getRadioButtonB();

			fireEvent.click(berry);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(apple).toBeChecked();
			expect(berry).not.toBeChecked();
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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
			fireEvent.click(getRadioButtonA());
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
			fireEvent.click(getRadioButtonA());
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
			fireEvent.click(getRadioButtonA());
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	describe("allowDeselection feature", () => {
		it("should deselect when clicking selected option if allowDeselection is true", async () => {
			renderComponent({
				allowDeselection: true,
				customOptions: {
					styleType: "toggle",
				},
			});

			const radioButtonA = getRadioButtonA();

			// Select option A
			fireEvent.click(radioButtonA);
			await waitFor(() => expect(radioButtonA).toBeChecked());

			// Click again to deselect
			fireEvent.click(radioButtonA);
			await waitFor(() => {
				expect(radioButtonA).not.toBeChecked();
			});

			// Submit and verify value is null
			fireEvent.click(getSubmitButton());
			await waitFor(() => {
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						[COMPONENT_ID]: null,
					})
				);
			});
		});

		it.each`
			description    | allowDeselection
			${"false"}     | ${false}
			${"undefined"} | ${undefined}
		`("should not deselect when allowDeselection is $description", async ({ allowDeselection }) => {
			renderComponent({
				...(allowDeselection !== undefined && { allowDeselection }),
				customOptions: {
					styleType: "toggle",
				},
			});

			const radioButtonA = getRadioButtonA();
			fireEvent.click(radioButtonA);
			await waitFor(() => expect(radioButtonA).toBeChecked());

			fireEvent.click(radioButtonA);
			await waitFor(() => expect(radioButtonA).toBeChecked());

			fireEvent.click(getSubmitButton());
			await waitFor(() =>
				expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "Apple" }))
			);
		});

		it("should not deselect disabled option even with allowDeselection true", async () => {
			renderComponent(
				{
					allowDeselection: true,
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ value: "Apple", label: "A" },
						{ value: "Berry", label: "B", disabled: true },
					],
				},
				{ defaultValues: { [COMPONENT_ID]: "Berry" } }
			);

			const radioButtonB = getRadioButtonB();
			expect(radioButtonB).toBeChecked();

			// B is selected and disabled — clicking it should NOT deselect
			fireEvent.click(radioButtonB);
			await waitFor(() => {
				expect(radioButtonB).toBeChecked();
			});
		});

		it("should clear nested children when deselecting option with children", async () => {
			const JSON_WITH_CHILDREN: IFrontendEngineData = {
				id: FRONTEND_ENGINE_ID,
				sections: {
					section: {
						uiType: "section",
						children: {
							[COMPONENT_ID]: {
								label: "Radio",
								uiType: UI_TYPE,
								allowDeselection: true,
								customOptions: {
									styleType: "toggle",
								},
								options: [
									{
										label: "A",
										value: "Apple",
										children: {
											[NESTED_FIELD_ID]: {
												label: "Nested",
												uiType: "text-field",
											},
										},
									},
									{ label: "B", value: "Berry" },
								],
							},
							...getSubmitButtonProps(),
						},
					},
				},
			};

			render(<FrontendEngine data={JSON_WITH_CHILDREN} onSubmit={SUBMIT_FN} />);

			const radioButtonA = getRadioButtonA();

			// Select option A - nested field should appear
			fireEvent.click(radioButtonA);
			await waitFor(() => {
				expect(radioButtonA).toBeChecked();
				expect(getNestedField()).toBeInTheDocument();
			});

			// Type in nested field
			fireEvent.change(getNestedField(), { target: { value: "test value" } });
			await waitFor(() => {
				expect(getNestedField()).toHaveValue("test value");
			});

			// Deselect option A
			fireEvent.click(radioButtonA);
			await waitFor(() => {
				expect(radioButtonA).not.toBeChecked();
			});
			await waitFor(() => {
				expect(getNestedField()).not.toBeInTheDocument();
			});

			// Submit and verify nested field value is cleared
			fireEvent.click(getSubmitButton());
			await waitFor(() => {
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						[COMPONENT_ID]: null,
					})
				);
				// Nested field should not be in the submission (it's removed/unmounted)
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.not.objectContaining({
						[NESTED_FIELD_ID]: expect.anything(),
					})
				);
			});
		});

		it("should trigger required validation when deselecting required field", async () => {
			renderComponent({
				allowDeselection: true,
				customOptions: {
					styleType: "toggle",
				},
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			});

			const radioButtonA = getRadioButtonA();

			// Select option A
			fireEvent.click(radioButtonA);
			await waitFor(() => expect(radioButtonA).toBeChecked());

			// Deselect option A
			fireEvent.click(radioButtonA);
			await waitFor(() => {
				expect(radioButtonA).not.toBeChecked();
			});

			// Try to submit - should show validation error
			fireEvent.click(getSubmitButton());
			await waitFor(() => {
				expect(SUBMIT_FN).not.toHaveBeenCalled();
				expect(getErrorMessage()).toBeInTheDocument();
			});
		});
	});

	describe("layoutColumns feature", () => {
		it.each`
			description     | layoutColumns
			${"number"}     | ${2}
			${"responsive"} | ${{ mobile: 1, desktop: 2 }}
		`("should render toggles in grid when layoutColumns is $description", ({ layoutColumns }) => {
			renderComponent({
				customOptions: {
					styleType: "toggle",
					layoutColumns,
				},
				options: [
					{ label: "A", value: "a" },
					{ label: "B", value: "b" },
					{ label: "C", value: "c" },
					{ label: "D", value: "d" },
				],
			});

			expect(screen.getAllByRole("radio")).toHaveLength(4);
		});

		it("should work with layoutType and layoutColumns together", () => {
			renderComponent({
				customOptions: {
					styleType: "toggle",
					layoutColumns: 2,
					layoutType: "horizontal",
				},
			});

			expect(screen.getAllByRole("radio")).toHaveLength(2);
		});
	});

	describe("minItemWidth feature", () => {
		it("should apply fixed item width when minItemWidth is set", () => {
			renderComponent({
				customOptions: { styleType: "toggle", minItemWidth: 200 },
				options: [
					{ label: "A", value: "a" },
					{ label: "B", value: "b" },
				],
			});
			expect(screen.getAllByRole("radio")).toHaveLength(2);
		});

		it("should apply responsive minItemWidth per breakpoint", () => {
			renderComponent({
				customOptions: { styleType: "toggle", minItemWidth: { mobile: 100, desktop: 200 } },
				options: [
					{ label: "A", value: "a" },
					{ label: "B", value: "b" },
				],
			});
			expect(screen.getAllByRole("radio")).toHaveLength(2);
		});
	});

	describe("stretch feature", () => {
		it("should render grid with auto-fill when stretch is true", () => {
			renderComponent({
				customOptions: { styleType: "toggle", stretch: true },
				options: [
					{ label: "A", value: "a" },
					{ label: "B", value: "b" },
				],
			});
			expect(screen.getAllByRole("radio")).toHaveLength(2);
		});

		it("should use layoutColumns with stretch", () => {
			renderComponent({
				customOptions: { styleType: "toggle", layoutColumns: 2, stretch: true },
				options: [
					{ label: "A", value: "a" },
					{ label: "B", value: "b" },
					{ label: "C", value: "c" },
				],
			});
			expect(screen.getAllByRole("radio")).toHaveLength(3);
		});
	});

	labelTestSuite(renderComponent as (overrideField: unknown) => void);
	warningTestSuite<TRadioButtonGroupSchema>({
		label: "Radio",
		uiType: UI_TYPE,
		customOptions: {
			styleType: "toggle",
		},
		options: [
			{ label: "A", value: "Apple" },
			{ label: "B", value: "Berry" },
		],
	});
});
