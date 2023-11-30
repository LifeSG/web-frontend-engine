import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IMultiSelectSchema } from "../../../../components/fields";
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

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const FIELD_LABEL = "Multiselect";
const UI_TYPE = "multi-select";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Multiselect",
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

const renderComponent = (overrideField?: TOverrideField<IMultiSelectSchema>, overrideSchema?: TOverrideSchema) => {
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
	return getField("button", FIELD_LABEL);
};

const getCheckboxA = (): HTMLElement => {
	return getField("button", "A");
};

const getCheckboxB = (): HTMLElement => {
	return getField("button", "B");
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
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getComponent()));
		expect(getCheckboxA().querySelector("div[aria-checked=true]")).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to render sub label and hint", () => {
		renderComponent({
			label: {
				mainLabel: "Main label",
				subLabel: "Sub label",
				hint: { content: "Hint" },
			},
		});
		fireEvent.click(screen.getByLabelText("popover-button"));

		expect(screen.getByText("Main label")).toBeInTheDocument();
		expect(screen.getByText("Sub label")).toBeInTheDocument();
		expect(screen.getByText("Hint")).toBeVisible();
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getComponent().parentElement).toHaveAttribute("disabled");
	});

	it("should be able to support custom list style width", async () => {
		const width = "24rem";
		renderComponent({ listStyleWidth: width });
		await waitFor(() => fireEvent.click(getComponent()));
		expect(getField("list")).toHaveStyle({ width });
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(screen.getByText(placeholder)).toBeInTheDocument();
	});

	it("should be able to toggle the checkboxes", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getComponent()));
		const apple = getCheckboxA();
		const berry = getCheckboxB();

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

	it("should be able to toggle all the checkboxes at once", async () => {
		renderComponent();

		fireEvent.click(getComponent());
		const selectAllButton = getField("button", "Select all");

		fireEvent.click(selectAllButton);
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(
			expect.objectContaining({ [COMPONENT_ID]: ["Apple", "Berry", "Cherry", "Durian"] })
		);

		fireEvent.click(selectAllButton);
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
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

				await waitFor(() => fireEvent.click(getComponent()));

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

				await waitFor(() => fireEvent.click(getComponent()));

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

			fireEvent.click(getComponent());
			const apple = getCheckboxA();
			const berry = getCheckboxB();

			fireEvent.click(apple);
			fireEvent.click(berry);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText("Select")).toBeInTheDocument();
			expect(apple.querySelector("div[aria-checked=false]")).toBeInTheDocument();
			expect(berry.querySelector("div[aria-checked=false]")).toBeInTheDocument();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = ["Apple"];
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			fireEvent.click(getComponent());
			const apple = getCheckboxA();
			const berry = getCheckboxB();

			fireEvent.click(berry);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText("1 selected")).toBeInTheDocument();
			expect(apple.querySelector("div[aria-checked=true]")).toBeInTheDocument();
			expect(berry.querySelector("div[aria-checked=false]")).toBeInTheDocument();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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
			fireEvent.click(getComponent());
			fireEvent.click(getCheckboxA());
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
			fireEvent.click(getComponent());
			fireEvent.click(getCheckboxA());
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
			fireEvent.click(getComponent());
			fireEvent.click(getCheckboxA());
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});
});
