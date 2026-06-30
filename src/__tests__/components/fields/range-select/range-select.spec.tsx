import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IRangeSelectSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "range-select";

const renderComponent = createRenderComponent<IRangeSelectSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: "RangeSelect",
		uiType: UI_TYPE,
		options: {
			from: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry" },
			],
			to: [
				{ label: "C", value: "Cherry" },
				{ label: "D", value: "Date" },
			],
		},
	},
	submitFn: SUBMIT_FN,
});

const ComponentWithSetSchemaButton = (props: { onClick: (data: IFrontendEngineData) => IFrontendEngineData }) => {
	const { onClick } = props;
	const [schema, setSchema] = useState<IFrontendEngineData>(renderComponent.schema);
	return (
		<>
			<FrontendEngine data={schema} onSubmit={SUBMIT_FN} />
			<Button onClick={() => setSchema(onClick)}>Update options</Button>
		</>
	);
};

const getComponent = (): HTMLElement => {
	return screen.getAllByRole("combobox", { name: /Select/i })[0];
};

const getRangeSelector = (): HTMLElement => {
	return screen.getByTestId("field-base");
};

const getClearButton = (): HTMLElement => {
	return screen.getByRole("button", { name: /Clear/i });
};

const getOptionA = (): HTMLElement => {
	return screen.getAllByText("A")[0];
};

const getOptionC = (): HTMLElement => {
	return screen.getAllByText("C")[0];
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		setupJestCanvasMock();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getComponent()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = { from: "Apple", to: "Cherry" };
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(getRangeSelector()).toHaveTextContent("AC");
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent(
			{
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			},
			{ defaultValues: { [COMPONENT_ID]: { from: "", to: "" } } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getComponent()).toHaveAttribute("aria-disabled", "true");
	});

	it("should be able to support custom placeholder", () => {
		const placeholders = { from: "ABC", to: "DEF" };
		renderComponent({ placeholders });

		expect(screen.getAllByText(placeholders.from)[0]).toBeInTheDocument();
		expect(screen.getAllByText(placeholders.to)[0]).toBeInTheDocument();
	});

	it("should be able to select both options", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getComponent()));

		await waitFor(() => fireEvent.click(getOptionA()));
		await waitFor(() => fireEvent.click(getOptionC()));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({ [COMPONENT_ID]: { from: "Apple", to: "Cherry" } })
		);
	});

	it("should be able to clear all inputs when only 1st option is selected and then click away outside of component", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getComponent()));
		await waitFor(() => fireEvent.click(getOptionA()));
		fireEvent.pointerDown(document.body);
		await waitFor(() => fireEvent.click(getComponent()));
		expect(queryByText(getRangeSelector(), "A")).toBeNull();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({ [COMPONENT_ID]: { from: undefined, to: undefined } })
		);
	});

	describe("update options through schema", () => {
		it.each`
			scenario                                                                             | selected      | expectedValueBeforeUpdate          | expectedValueAfterUpdate
			${"should retain field values if option is not removed on schema update"}            | ${["A", "C"]} | ${{ from: "Apple", to: "Cherry" }} | ${{ from: "Apple", to: "Cherry" }}
			${"should clear field values if option is removed on schema update"}                 | ${["B", "D"]} | ${{ from: "Berry", to: "Date" }}   | ${{ from: "", to: "" }}
			${"should retain the field values of options that are not removed on schema update"} | ${["A", "D"]} | ${{ from: "Apple", to: "Date" }}   | ${{ from: "Apple", to: "" }}
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
												options: {
													from: [
														{ label: "A", value: "Apple" },
														{ label: "B", value: "Banana" },
													],
													to: [
														{ label: "C", value: "Cherry" },
														{ label: "E", value: "Eggplant" },
													],
												},
											},
										},
									},
								},
							})
						}
					/>
				);
				await waitFor(() => fireEvent.click(getComponent()));

				selected.forEach((name) => fireEvent.click(screen.getAllByText(name)[0]));
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

	it("should support default values matching initial overrides", async () => {
		renderComponent(
			{ options: {} },
			{
				defaultValues: { [COMPONENT_ID]: { from: "Apple", to: "Cherry" } },
				overrides: {
					[COMPONENT_ID]: {
						options: {
							from: [{ label: "A", value: "Apple" }],
							to: [{ label: "C", value: "Cherry" }],
						},
					},
				},
			}
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({ [COMPONENT_ID]: { from: "Apple", to: "Cherry" } })
		);
	});

	describe("update options through overrides", () => {
		it.each`
			scenario                                                                        | selected      | expectedValueBeforeUpdate          | expectedValueAfterUpdate
			${"should retain field values if option is not removed on override"}            | ${["A", "C"]} | ${{ from: "Apple", to: "Cherry" }} | ${{ from: "Apple", to: "Cherry" }}
			${"should clear field values if option is removed on override"}                 | ${["B", "D"]} | ${{ from: "Berry", to: "Date" }}   | ${{ from: "", to: "" }}
			${"should retain the field values of options that are not removed on override"} | ${["A", "D"]} | ${{ from: "Apple", to: "Date" }}   | ${{ from: "Apple", to: "" }}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(
					<ComponentWithSetSchemaButton
						onClick={(data) => ({
							...data,
							overrides: {
								[COMPONENT_ID]: {
									options: {
										from: [
											{ label: "A", value: "Apple" },
											{ label: "B", value: "Banana" },
										],
										to: [
											{ label: "C", value: "Cherry" },
											{ label: "E", value: "Eggplant" },
										],
									},
								},
							},
						})}
					/>
				);
				await waitFor(() => fireEvent.click(getComponent()));

				selected.forEach((name) => fireEvent.click(screen.getAllByText(name)[0]));
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

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = { from: "Apple", to: "Cherry" };
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			// Click on the range-select with default values
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(screen.getAllByText("B")[0]));
			await waitFor(() => fireEvent.click(screen.getAllByText("D")[0]));
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
		});
	});

	describe("clear button", () => {
		it("should clear selection when clicking the cross icon and submit, submitted values should be empty", async () => {
			renderComponent();

			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			await waitFor(() => fireEvent.click(getClearButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: { from: undefined, to: undefined } })
			);
		});

		it("should clear selection when clicking the cross icon, values should remain empty upon clicking back the component", async () => {
			renderComponent();

			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			await waitFor(() => fireEvent.click(getClearButton()));
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: { from: undefined, to: undefined } })
			);
		});

		it("should clear selection when clicking submit and then clicking the cross icon, to value should remain empty upon reselecting the from value", async () => {
			renderComponent();

			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			await waitFor(() => fireEvent.click(getClearButton()));
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));

			expect(queryByText(getRangeSelector(), "A")).toBeTruthy();
			expect(queryByText(getRangeSelector(), "C")).toBeNull();
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: ["Apple"],
		modifyField: async () => {
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
		},
	});

	labelTestSuite(renderComponent);
	warningTestSuite<IRangeSelectSchema>({
		label: "RangeSelect",
		uiType: UI_TYPE,
		options: {
			from: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry" },
			],
			to: [
				{ label: "C", value: "Cherry" },
				{ label: "D", value: "Date" },
			],
		},
	});
});
