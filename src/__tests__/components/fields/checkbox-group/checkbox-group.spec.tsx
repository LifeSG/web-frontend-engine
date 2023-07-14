import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { ICheckboxGroupSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "checkbox";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Checkbox",
					uiType: UI_TYPE,
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

const renderComponent = (overrideField?: TOverrideField<ICheckboxGroupSchema>, overrideSchema?: TOverrideSchema) => {
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

const getCheckboxes = (): HTMLElement[] => {
	return screen
		.getAllByRole("checkbox")
		.map((checkbox) => checkbox.querySelector("input"))
		.filter(Boolean);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getCheckboxes()).toHaveLength(4);
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const checkboxes = getCheckboxes();
		checkboxes.forEach((checkbox) => {
			if (defaultValues.includes((checkbox as HTMLInputElement).value)) {
				expect(checkbox.nextElementSibling.tagName).toBe("svg");
			} else {
				expect(checkbox.nextElementSibling).not.toBeInTheDocument();
			}
		});
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

		const checkboxes = getCheckboxes();
		expect(checkboxes[0]).toBeEnabled();
		expect(checkboxes[1]).toBeDisabled();

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		const checkboxes = getCheckboxes();
		checkboxes.forEach((checkbox) => {
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

		const checkboxes = getCheckboxes();
		checkboxes.forEach((checkbox) => {
			expect(checkbox).toBeDisabled();
		});

		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
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
													{ label: "C", value: "C" },
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

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			const checkboxes = getCheckboxes();
			fireEvent.click(checkboxes[0]);
			fireEvent.click(checkboxes[1]);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(checkboxes[0].nextElementSibling).not.toBeInTheDocument();
			expect(checkboxes[1].nextElementSibling).not.toBeInTheDocument();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = ["Apple"];
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			const checkboxes = getCheckboxes();
			fireEvent.click(checkboxes[1]);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(checkboxes[0].nextElementSibling.tagName).toBe("svg");
			expect(checkboxes[1].nextElementSibling).not.toBeInTheDocument();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
		});
	});
});
