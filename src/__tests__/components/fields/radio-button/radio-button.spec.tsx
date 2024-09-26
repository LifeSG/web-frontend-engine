import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { TRadioButtonGroupSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
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
const UI_TYPE = "radio";

const getRadioButtonA = (): HTMLElement => {
	return getField("radio", "A");
};

const getRadioButtonB = (): HTMLElement => {
	return getField("radio", "B");
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

const renderComponent = (overrideField?: TOverrideField<TRadioButtonGroupSchema>, overrideSchema?: TOverrideSchema) => {
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

describe(UI_TYPE, () => {
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
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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

		expect(getRadioButtonA()).toBeDisabled();
		expect(getRadioButtonB()).toBeDisabled();
	});

	it("should be disabled if configured for both component/options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple", disabled: false },
				{ label: "B", value: "Berry", disabled: false },
			],
			disabled: true,
		});

		expect(getRadioButtonA()).toBeDisabled();
		expect(getRadioButtonB()).toBeDisabled();
	});

	it("should be able to render HTML string in option label", () => {
		renderComponent({
			options: [{ label: "<strong>HTML Label</strong>", value: "HTML Label" }],
		});

		expect(screen.getByText("HTML Label")).toBeInTheDocument();
		expect(screen.getByText("HTML Label").nodeName).toBe("STRONG");
	});

	it("should be able to sanitize HTML string in option label", () => {
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
										{ label: "C", value: "Cherry" },
									],
								},
							},
						})}
					/>
				);

				fireEvent.click(screen.getByLabelText(selected));
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

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();
			const apple = getRadioButtonA();

			fireEvent.click(apple);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(apple).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "Apple";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			const apple = getRadioButtonA();
			const berry = getRadioButtonB();

			fireEvent.click(berry);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(apple).toBeChecked();
			expect(berry).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
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

	labelTestSuite(renderComponent);
	warningTestSuite<TRadioButtonGroupSchema>({
		label: "Radio",
		uiType: UI_TYPE,
		options: [
			{ label: "A", value: "Apple" },
			{ label: "B", value: "Berry" },
		],
	});
});
