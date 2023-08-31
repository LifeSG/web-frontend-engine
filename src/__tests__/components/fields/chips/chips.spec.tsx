import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { IChipsSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
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

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "chips";
const TEXT_AREA_LABEL = "E";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Chips",
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

const renderComponent = (overrideField?: TOverrideField<IChipsSchema>, overrideSchema?: TOverrideSchema) => {
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

const getChipA = (pressed = false): HTMLElement => {
	return getField("button", pressed ? { name: "A", pressed: true } : "A");
};

const getChipB = (): HTMLElement => {
	return getField("button", "B");
};

const getTextareaChip = (pressed = false): HTMLElement => {
	return getField("button", pressed ? { name: TEXT_AREA_LABEL, pressed: true } : TEXT_AREA_LABEL);
};

const getTextarea = (isQuery = false): HTMLElement => {
	return getField("textbox", TEXT_AREA_LABEL, isQuery);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getChipA()).toBeInTheDocument();
		expect(getChipB()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getChipA(true)).toBeInTheDocument();
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to support default values in textarea", async () => {
		const defaultValues = ["E"];
		const defaultTextAreaValue = "Eggplant";
		renderComponent(
			{ textarea: { label: TEXT_AREA_LABEL } },
			{
				defaultValues: {
					[COMPONENT_ID]: defaultValues,
					[`${COMPONENT_ID}-textarea`]: defaultTextAreaValue,
				},
			}
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getTextareaChip(true)).toBeInTheDocument();
		expect(getTextarea()).toHaveValue(defaultTextAreaValue);
		expect(SUBMIT_FN).toBeCalledWith(
			expect.objectContaining({
				[COMPONENT_ID]: defaultValues,
				[`${COMPONENT_ID}-textarea`]: defaultTextAreaValue,
			})
		);
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

		expect(getChipA()).toBeEnabled();
		expect(getChipB()).toBeDisabled();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getChipA()).toBeDisabled();
		expect(getChipB()).toBeDisabled();
	});

	it("should be disabled if configured for both component/options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple", disabled: false },
				{ label: "B", value: "Berry", disabled: false },
			],
			disabled: true,
		});

		expect(getChipA()).toBeDisabled();
		expect(getChipB()).toBeDisabled();
	});

	it("should be able to toggle the chips", async () => {
		renderComponent();
		const apple = getChipA();
		const berry = getChipB();

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
	});

	it("should be able to support single selection", async () => {
		renderComponent({ validation: [{ max: 1 }] });
		const apple = getChipA();
		const berry = getChipB();

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));
	});

	it("should be able to render textarea upon selection", async () => {
		renderComponent({ textarea: { label: TEXT_AREA_LABEL } });

		expect(getTextarea(true)).not.toBeInTheDocument();

		await waitFor(() => fireEvent.click(getTextareaChip()));
		expect(getTextarea()).toBeInTheDocument();
	});

	describe("textarea", () => {
		it("should be able to support validation schema", async () => {
			renderComponent({
				textarea: { label: TEXT_AREA_LABEL, validation: [{ required: true, errorMessage: ERROR_MESSAGE }] },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should be able to resize vertically", async () => {
			renderComponent({
				textarea: { label: TEXT_AREA_LABEL, resizable: true },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));

			expect(getTextarea()).toHaveStyle({ resize: "vertical" });
		});

		it("should be able to support custom rows", async () => {
			renderComponent({
				textarea: { label: TEXT_AREA_LABEL, rows: 1 },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));

			expect(getTextarea()).toHaveAttribute("rows", "1");
		});
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

				selected.forEach((name) => fireEvent.click(screen.getByRole("button", { name })));
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
			scenario                                                                        | selected      | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field values if particular field is not overridden"}           | ${["A", "B"]} | ${["Apple", "Berry"]}     | ${["Apple", "Berry"]}
			${"should clear field values if option is removed through overriding"}          | ${["C", "D"]} | ${["Cherry", "Durian"]}   | ${[]}
			${"should retain the field values of options that are not removed on override"} | ${["A", "D"]} | ${["Apple", "Durian"]}    | ${["Apple"]}
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
										{ label: "C", value: "C" },
										{ label: "E", value: "Eggplant" },
									],
								},
							},
						})}
					/>
				);

				selected.forEach((name) => fireEvent.click(screen.getByRole("button", { name })));
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

			fireEvent.click(getChipA());
			fireEvent.click(getChipB());
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getField("button", { name: "A", pressed: true }, true)).not.toBeInTheDocument();
			expect(getField("button", { name: "B", pressed: true }, true)).not.toBeInTheDocument();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = ["Apple"];
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			fireEvent.click(getChipB());
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getChipA(true)).toBeInTheDocument();
			expect(getField("button", { name: "B", pressed: true }, true)).not.toBeInTheDocument();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
		});

		it("should revert to default textarea value on reset", async () => {
			const defaultValues = [TEXT_AREA_LABEL];
			const defaultTextAreaValue = "Eggplant";
			renderComponent(
				{ textarea: { label: TEXT_AREA_LABEL } },
				{
					defaultValues: {
						[COMPONENT_ID]: defaultValues,
						[`${COMPONENT_ID}-textarea`]: defaultTextAreaValue,
					},
				}
			);

			fireEvent.click(getChipB());
			fireEvent.change(getTextarea(), { target: { value: "Hello" } });
			fireEvent.click(getTextareaChip());
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getTextareaChip(true)).toBeInTheDocument();
			expect(getTextarea()).toHaveValue(defaultTextAreaValue);
			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: defaultValues,
					[`${COMPONENT_ID}-textarea`]: defaultTextAreaValue,
				})
			);
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

		it("should set form state as dirty if user modifies the field", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(getChipA());
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

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(getChipA());
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: ["Apple"] } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(getChipB());
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});
});
