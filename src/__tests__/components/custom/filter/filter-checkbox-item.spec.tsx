import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { IFilterItemCheckboxSchema } from "../../../../components/custom/filter/filter-item-checkbox/types";
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
const { ResizeObserver } = window;

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const REFERENCE_KEY = "filter-item-checkbox";

const renderComponent = (
	overrideField?: TOverrideField<IFilterItemCheckboxSchema>,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Filter Item Checkbox",
						referenceKey: REFERENCE_KEY,
						options: [
							{ label: "Apple", value: "Apple" },
							{ label: "Berry", value: "Berry" },
						],
						...overrideField,
					},
					...getSubmitButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getCheckboxes = (): HTMLElement[] => {
	return screen.getAllByRole("checkbox").filter(Boolean);
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
			const checkBox = screen.getByText(val).querySelector("input");
			expect(checkBox.checked).toBeTruthy();
		});
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
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
										[COMPONENT_ID]: {
											label: "Filter Item Checkbox",
											referenceKey: REFERENCE_KEY,
											options,
										},
										...getSubmitButtonProps(),
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
});
