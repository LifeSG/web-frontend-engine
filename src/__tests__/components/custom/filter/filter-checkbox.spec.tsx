import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useState } from "react";
import { IFilterCheckboxSchema } from "../../../../components/custom/filter/filter-checkbox/types";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Filter Item Checkbox";
const REFERENCE_KEY = "filter-checkbox";

const renderComponent = (overrideField?: TOverrideField<IFilterCheckboxSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					filterItem1: {
						referenceKey: "filter",
						label: "Filter Item",
						children: {
							[COMPONENT_ID]: {
								label: COMPONENT_LABEL,
								referenceKey: REFERENCE_KEY,
								options: [
									{ label: "Apple", value: "Apple" },
									{ label: "Berry", value: "Berry" },
								],
								collapsible: true,
								...overrideField,
							},
							...getSubmitButtonProps(),
						},
					},
				},
			},
		},
		...overrideSchema,
	};

	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getCheckboxes = (): HTMLElement[] => {
	return screen.getAllByRole("checkbox");
};

const getCheckboxByVal = (val: string) => {
	return screen.getByText(val).closest("label").querySelector("input");
};

describe(REFERENCE_KEY, () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
		expect(getCheckboxes()).toHaveLength(2);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		defaultValues.forEach((val) => {
			const checkBox = getCheckboxByVal(val);
			expect(checkBox.checked).toBeTruthy();
		});
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to render hint", () => {
		renderComponent({
			label: {
				mainLabel: "Main label",
				hint: { content: "Hint" },
			},
		});
		fireEvent.click(screen.getByTestId("field-popover"));

		expect(within(screen.getByTestId("filter-item-title")).getByText("Main label")).toBeInTheDocument();
		expect(screen.getByText("Hint")).toBeVisible();
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const checkboxes = getCheckboxes();
		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
	});

	it("should support default values matching initial overrides", async () => {
		const value = "Overridden";
		renderComponent(
			{ options: [] },
			{
				defaultValues: { [COMPONENT_ID]: [value] },
				overrides: { [COMPONENT_ID]: { options: [{ label: value, value: value }] } },
			}
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [value] }));
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
							sections: {
								section: {
									uiType: "section",
									children: {
										field: {
											referenceKey: "filter",
											label: "Filter",
											children: {
												[COMPONENT_ID]: {
													label: COMPONENT_LABEL,
													referenceKey: REFERENCE_KEY,
													options,
												},
												...getSubmitButtonProps(),
											},
										},
									},
								},
							},
						}}
						onSubmit={SUBMIT_FN}
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

				selected.forEach((value) => fireEvent.click(getCheckboxByVal(value)));
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

	describe("clear behaviour on clicking clear button in filter", () => {
		const defaultValues = ["Apple"];
		const changedValue = ["Apple", "Berry"];

		it.each`
			scenario                                             | clearBehavior | expectedValue
			${"clear values by default"}                         | ${null}       | ${[]}
			${"clear values if clearBehavior=clear"}             | ${"clear"}    | ${[]}
			${"revert to default value if clearBehavior=revert"} | ${"revert"}   | ${defaultValues}
			${"not update value if clearBehavior=retain"}        | ${"retain"}   | ${changedValue}
		`("it should $scenario", async ({ clearBehavior, expectedValue }) => {
			renderComponent({ clearBehavior }, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			const checkboxes = getCheckboxes();
			await waitFor(() => fireEvent.click(checkboxes[1]));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: changedValue }));

			fireEvent.click(screen.getByRole("button", { name: "clear Filter Item" }));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValue }));
		});
	});

	describe("expanded (controlled component)", () => {
		it("should be expanded when override expanded is true", () => {
			renderComponent(undefined, {
				overrides: {
					filterItem1: {
						children: {
							[COMPONENT_ID]: {
								label: "Overriden filter check",
								expanded: true,
							},
						},
					},
				},
			});
			expect(screen.getByTestId("expand-collapse-button")).toHaveAttribute("aria-expanded", "true");
		});

		it("should be expanded when expanded is true", () => {
			renderComponent({
				expanded: true,
			});
			expect(screen.getByTestId("expand-collapse-button")).toHaveAttribute("aria-expanded", "true");
		});

		it("should be collapsed when override expanded is false", () => {
			renderComponent(
				{
					expanded: true,
				},
				{
					overrides: {
						filterItem1: {
							children: {
								[COMPONENT_ID]: {
									label: "Overriden filter check",
									expanded: false,
								},
							},
						},
					},
				}
			);

			expect(screen.getByTestId("expand-collapse-button")).toHaveAttribute("aria-expanded", "false");
		});

		it("should be collapsed when expanded is false", () => {
			renderComponent();

			expect(screen.getByTestId("expand-collapse-button")).toHaveAttribute("aria-expanded", "false");
		});
	});

	describe("nested options", () => {
		const nestedOptionsConfig = {
			options: [
				{
					label: "Food",
					key: "Food",
					options: [
						{ label: "Pizza", value: "Pizza" },
						{ label: "Burger", value: "Burger" },
					],
				},
				{ label: "Drinks", value: "Drinks" },
			],
		};

		it("should submit only child values when only children are selected", async () => {
			renderComponent(nestedOptionsConfig);

			const expandButton = screen.getByTestId("expand-collapse-button");
			fireEvent.click(expandButton);

			await waitFor(() => fireEvent.click(screen.getByText("Pizza")));
			await waitFor(() => fireEvent.click(screen.getByText("Burger")));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: expect.arrayContaining(["Pizza", "Burger"]),
				})
			);
		});

		it("should submit only child values when only parent is selected", async () => {
			renderComponent(nestedOptionsConfig);

			fireEvent.click(screen.getByText("Food"));

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: expect.arrayContaining(["Pizza", "Burger"]),
				})
			);
		});

		it("should submit standalone option values correctly", async () => {
			renderComponent(nestedOptionsConfig);

			fireEvent.click(screen.getByText("Drinks"));

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: ["Drinks"],
				})
			);
		});
	});
});
