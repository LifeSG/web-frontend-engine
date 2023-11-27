import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
const { ResizeObserver } = window;

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
	return screen
		.getAllByRole("checkbox")
		.filter((el) => el.getAttribute("data-testid") !== "toggle-label")
		.filter(Boolean);
};

const getCheckboxByVal = (val: string) => {
	return screen
		.getAllByText(val)
		.find((el) => el.getAttribute("data-testid") !== "toggle-label")
		?.querySelector("input");
};

describe(REFERENCE_KEY, () => {
	beforeEach(() => {
		jest.resetAllMocks();
		delete window.ResizeObserver;
		window.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
	});

	afterEach(() => {
		window.ResizeObserver = ResizeObserver;
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
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();
		const checkboxes = getCheckboxes();
		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[0]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));

		await waitFor(() => fireEvent.click(checkboxes[1]));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
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
				expect(SUBMIT_FN).toBeCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate }));
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
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: changedValue }));

			fireEvent.click(screen.getByRole("button", { name: "Clear" }));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValue }));
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
			//This is checking for the chevron
			expect(screen.getByLabelText("Collapse")).toBeVisible();
		});

		it("should be expanded when expanded is true", () => {
			renderComponent({
				expanded: true,
			});
			//This is checking for the chevron
			expect(screen.getByLabelText("Collapse")).toBeVisible();
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
			//This is checking for the chevron
			expect(screen.getByLabelText("Expand")).toBeVisible();
		});

		it("should be collapsed when expanded is false", () => {
			renderComponent();
			//This is checking for the chevron
			expect(screen.getByLabelText("Expand")).toBeVisible();
		});
	});
});
