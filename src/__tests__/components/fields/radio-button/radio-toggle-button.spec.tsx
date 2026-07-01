import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { TRadioButtonGroupSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getField,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
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

const renderComponent = createRenderComponent<TRadioButtonGroupSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
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
	submitFn: SUBMIT_FN,
});

const ComponentWithSetSchemaButton = (props: { onClick: (data: IFrontendEngineData) => IFrontendEngineData }) => {
	const { onClick } = props;
	const [schema, setSchema] = useState<IFrontendEngineData>(renderComponent.schema);
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

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: ["Apple"],
		modifyField: () => fireEvent.click(getRadioButtonA()),
	});

	labelTestSuite(renderComponent);
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
