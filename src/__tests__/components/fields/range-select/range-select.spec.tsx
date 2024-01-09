import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IRangeSelectSchema } from "../../../../components/fields";
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

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "range-select";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
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
					listStyleWidth: "40rem",
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<IRangeSelectSchema>, overrideSchema?: TOverrideSchema) => {
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

const getComponent = (): HTMLElement => {
	return getField("button", "Select Select");
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
		jest.resetAllMocks();
		setupJestCanvasMock();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getComponent()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = { from: "Apple", to: "Cherry" };
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(screen.getByTestId(COMPONENT_ID)).toHaveTextContent("AC");
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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

		expect(getComponent()).toHaveAttribute("disabled");
	});

	it("should be able to support custom placeholder", () => {
		const placeholders = { from: "ABC", to: "DEF" };
		renderComponent({ placeholders });

		expect(screen.getByText(placeholders.from)).toBeInTheDocument();
		expect(screen.getByText(placeholders.to)).toBeInTheDocument();
	});

	it("should be able to select both options", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getComponent()));

		await waitFor(() => fireEvent.click(getOptionA()));
		await waitFor(() => fireEvent.click(getOptionC()));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: { from: "Apple", to: "Cherry" } }));
	});

	it("should be able to clear all inputs when only 1st option is selected and then click away outside of component", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getComponent()));
		await waitFor(() => fireEvent.click(getOptionA()));
		fireEvent.mouseDown(document.body);
		await waitFor(() => fireEvent.click(getComponent()));
		expect(queryByText(getRangeSelector(), "A")).toBeNull();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(
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

			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = { from: "Apple", to: "Cherry" };
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			// Click on the range-select with default values
			await waitFor(() => fireEvent.click(getField("button", "A C")));
			await waitFor(() => fireEvent.click(screen.getAllByText("B")[0]));
			await waitFor(() => fireEvent.click(screen.getAllByText("D")[0]));
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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

			expect(SUBMIT_FN).toBeCalledWith(
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

			expect(SUBMIT_FN).toBeCalledWith(
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
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
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
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
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
			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
});
