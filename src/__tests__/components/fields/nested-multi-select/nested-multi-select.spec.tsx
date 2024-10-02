import { Button } from "@lifesg/react-design-system/button";
import { ByRoleOptions, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IL1Value, INestedMultiSelectSchema } from "../../../../components/fields";
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
const UI_TYPE = "nested-multi-select";

const NESTED_JSON_FIELDS: TOverrideField<INestedMultiSelectSchema> = {
	mode: "expand",
	options: [
		{
			label: "Red",
			key: "redKey",
			subItems: [{ label: "A", value: "Apple", key: "appleKey" }],
		},
		{
			label: "Blue",
			key: "blueKey",
			subItems: [{ label: "B", value: "Berry", key: "berryKey" }],
		},
		{
			label: "Orange",
			key: "orangeKey",
			subItems: [{ label: "C", value: "Carrot", key: "carrotKey" }],
		},
		{
			label: "Green",
			key: "greenKey",
			subItems: [{ label: "D", value: "Durian", key: "durianKey" }],
		},
	],
};

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Nestedmultiselect",
					uiType: UI_TYPE,
					options: [
						{ label: "A", value: "Apple", key: "appleKey" },
						{ label: "B", value: "Berry", key: "berryKey" },
						{ label: "C", value: "Cherry", key: "cherryKey" },
						{ label: "D", value: "Durian", key: "durianKey" },
					],
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (
	overrideField?: TOverrideField<INestedMultiSelectSchema>,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData<INestedMultiSelectSchema> = merge(cloneDeep(JSON_SCHEMA), overrideSchema);
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

const ComponentWithSetSchemaButton = (props: {
	onClick: (data: IFrontendEngineData) => IFrontendEngineData;
	initialSchema?: IFrontendEngineData;
}) => {
	const { onClick, initialSchema } = props;
	const [schema, setSchema] = useState<IFrontendEngineData>(initialSchema ?? JSON_SCHEMA);
	return (
		<>
			<FrontendEngine data={schema} onSubmit={SUBMIT_FN} />
			<Button.Default onClick={() => setSchema(onClick)}>Update options</Button.Default>
		</>
	);
};

const getComponent = (): HTMLElement => {
	return screen.getByTestId("field-base");
};

const getCheckboxA = (isQuery = false, options?: ByRoleOptions): HTMLElement => {
	return getField("button", { name: "A", ...options }, isQuery);
};

const getCheckboxB = (isQuery = false, options?: ByRoleOptions): HTMLElement => {
	return getField("button", { name: "B", ...options }, isQuery);
};

const getCheckboxC = (isQuery = false, options?: ByRoleOptions): HTMLElement => {
	return getField("button", { name: "C", ...options }, isQuery);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		setupJestCanvasMock();
	});
	afterEach(() => {
		jest.resetAllMocks();
		cleanup();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getComponent()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues: IL1Value = {
			appleKey: "Apple",
			berryKey: "Berry",
		};

		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });
		await waitFor(() => fireEvent.click(getComponent()));
		expect(getCheckboxA().querySelector("div[aria-checked=true]")).toBeInTheDocument();
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenLastCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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
		expect(SUBMIT_FN).toHaveBeenLastCalledWith(
			expect.objectContaining({
				[COMPONENT_ID]: {
					appleKey: "Apple",
					berryKey: "Berry",
				},
			})
		);

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenLastCalledWith(expect.objectContaining({ [COMPONENT_ID]: { berryKey: "Berry" } }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenLastCalledWith(expect.objectContaining({ [COMPONENT_ID]: {} }));
	});

	it("should be able to toggle all the checkboxes at once", async () => {
		renderComponent();

		fireEvent.click(getComponent());
		const selectAllButton = getField("button", "Select all");

		fireEvent.click(selectAllButton);
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenLastCalledWith(
			expect.objectContaining({
				[COMPONENT_ID]: {
					appleKey: "Apple",
					berryKey: "Berry",
					cherryKey: "Cherry",
					durianKey: "Durian",
				},
			})
		);

		fireEvent.click(selectAllButton);
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenLastCalledWith(expect.objectContaining({ [COMPONENT_ID]: {} }));
	});

	describe("mode", () => {
		it.each`
			scenario                                            | mode
			${"should hide child options if mode is collapsed"} | ${"collapse"}
			${"should show child options if mode is expanded"}  | ${"expand"}
			${"should show child options if mode is default"}   | ${"default"}
		`("$scenario", async ({ mode }) => {
			renderComponent({
				mode,
				options: [
					{
						label: "Parent",
						key: "parentKey",
						subItems: [
							{ label: "A", value: "Apple", key: "appleKey" },
							{ label: "B", value: "Berry", key: "berryKey" },
						],
					},
					{
						label: "Parent 2",
						value: "parent 2",
						key: "parent-2Key",
					},
				],
			});
			await waitFor(() => fireEvent.click(getComponent()));
			const apple = getCheckboxA(true);
			const berry = getCheckboxB(true);
			const parent = screen.queryByRole("button", { name: "Parent" });
			const test = (obj: HTMLElement) =>
				mode === "collapse" ? expect(obj).toBeNull() : expect(obj).toBeInTheDocument();
			expect(parent).toBeVisible();
			test(apple);
			test(berry);
		});
	});

	describe("search options", () => {
		it.each`
			scenario                                                         | searchTerm  | expectedResult    | expectedHiddenResult
			${"should display all options if no search terms are specified"} | ${""}       | ${["App", "Ber"]} | ${[]}
			${"should display the relevant option if search term matches"}   | ${"app"}    | ${["App"]}        | ${["Ber"]}
			${"should display nothing if the search term is mismatched"}     | ${"cherry"} | ${[]}             | ${["App", "Ber"]}
		`("$scenario", async ({ searchTerm, expectedResult, expectedHiddenResult }) => {
			renderComponent({
				enableSearch: true,
				options: [
					{
						label: "Parent",
						key: "parentKey",
						subItems: [
							{ label: "App", value: "Apple", key: "appKey" },
							{ label: "Ber", value: "Berry", key: "berKey" },
						],
					},
				],
			});
			await waitFor(() => fireEvent.click(getComponent()));
			const input = getField("textbox", { name: "Type to search" });
			await waitFor(() =>
				fireEvent.change(input, {
					target: {
						value: searchTerm,
					},
				})
			);
			expect(input).toHaveValue(searchTerm);
			expectedResult.forEach((name: string) => {
				expect(screen.queryByRole("button", { name })).toBeInTheDocument();
			});
			expectedHiddenResult.forEach((name: string) => {
				expect(screen.queryByRole("button", { name })).toBeNull();
			});
		});
	});

	describe("update options through schema", () => {
		it.each`
			scenario                                                                             | selected      | expectedValueBeforeUpdate                       | expectedValueAfterUpdate
			${"should retain the field values of options that are not removed on schema update"} | ${["A", "D"]} | ${{ appleKey: "Apple", durianKey: "Durian" }}   | ${{ appleKey: "Apple" }}
			${"should retain field values if option is not removed on schema update"}            | ${["A", "B"]} | ${{ appleKey: "Apple", berryKey: "Berry" }}     | ${{ appleKey: "Apple", berryKey: "Berry" }}
			${"should clear field values if option is removed on schema update"}                 | ${["C", "D"]} | ${{ cherryKey: "Cherry", durianKey: "Durian" }} | ${{}}
		`("$scenario", async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }) => {
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
												{ label: "C", value: "C", key: "cKey" },
												{ label: "E", value: "Eggplant", key: "eggplantKey" },
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
			selected.forEach((name: string) => fireEvent.click(screen.getByRole("button", { name })));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenLastCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
			);
			fireEvent.click(screen.getByRole("button", { name: "Update options" }));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenLastCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
			);
		});

		it.each`
			scenario                                                                                    | selected      | expectedValueBeforeUpdate                                                    | expectedValueAfterUpdate
			${"should retain the nested field values of options that are not removed on schema update"} | ${["A", "C"]} | ${{ redKey: { appleKey: "Apple" }, orangeKey: { carrotKey: "Carrot" } }}     | ${{ redKey: { appleKey: "Apple" } }}
			${"should retain nested field values if option is not removed on schema update"}            | ${["A", "B"]} | ${{ redKey: { appleKey: "Apple" }, blueKey: { berryKey: "Berry" } }}         | ${{ redKey: { appleKey: "Apple" }, blueKey: { berryKey: "Berry" } }}
			${"should clear nested field values if option is removed on schema update"}                 | ${["C", "D"]} | ${{ orangeKey: { carrotKey: "Carrot" }, greenKey: { durianKey: "Durian" } }} | ${{}}
		`("$scenario", async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }) => {
			render(
				<ComponentWithSetSchemaButton
					initialSchema={merge(cloneDeep(JSON_SCHEMA), {
						sections: {
							section: {
								children: {
									[COMPONENT_ID]: NESTED_JSON_FIELDS,
								},
							},
						},
					})}
					onClick={(data) =>
						merge(cloneDeep(data), {
							sections: {
								section: {
									children: {
										[COMPONENT_ID]: {
											options: [
												{
													label: "Red",
													value: "Red",
													key: "redKey",
													subItems: [{ label: "A", value: "Apple" }],
												},
												{
													label: "Blue",
													value: "Blue",
													key: "blueKey",
													subItems: [{ label: "B", value: "Berry", key: "berryKey" }],
												},
												{
													label: "Orange",
													value: "Orange",
													key: "orangeKey",
													subItems: [{ label: "E", value: "Eggplant", key: "eggplantKey" }],
												},
												{ label: "F", value: "Fish", key: "fishKey" },
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
			selected.forEach((name: string) => fireEvent.click(screen.getByRole("button", { name })));
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenLastCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
			);
			fireEvent.click(screen.getByRole("button", { name: "Update options" }));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenLastCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
			);
		});
	});

	it("should support default values matching initial overrides", async () => {
		renderComponent(
			{ options: [] },
			{
				defaultValues: { [COMPONENT_ID]: { parentKey: { childKey: "Overridden" } } },
				overrides: {
					[COMPONENT_ID]: {
						options: [
							{
								label: "parent",
								key: "parentKey",
								subItems: [{ label: "child", value: "Overridden", key: "childKey" }],
							},
						],
					},
				},
			}
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({ [COMPONENT_ID]: { parentKey: { childKey: "Overridden" } } })
		);
	});

	describe("update options through overrides", () => {
		it.each`
			scenario                                                                          | selected      | expectedValueBeforeUpdate                       | expectedValueAfterUpdate
			${"should retain the field values of options that are not removed on overriding"} | ${["A", "D"]} | ${{ appleKey: "Apple", durianKey: "Durian" }}   | ${{ appleKey: "Apple" }}
			${"should retain field values if particular field is not overridden"}             | ${["A", "B"]} | ${{ appleKey: "Apple", berryKey: "Berry" }}     | ${{ appleKey: "Apple", berryKey: "Berry" }}
			${"should clear field values if option is removed through overriding"}            | ${["C", "D"]} | ${{ cherryKey: "Cherry", durianKey: "Durian" }} | ${{}}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(
					<ComponentWithSetSchemaButton
						initialSchema={JSON_SCHEMA}
						onClick={(data) => ({
							...data,
							overrides: {
								[COMPONENT_ID]: {
									label: "overridden",
									options: [
										{ label: "A", value: "Apple" },
										{ label: "B", value: "Berry" },
										{ label: "C", value: "C", key: "cKey" },
										{ label: "E", value: "Eggplant", key: "eggplantKey" },
									],
								},
							},
						})}
					/>
				);

				await waitFor(() => fireEvent.click(getComponent()));

				selected.forEach((name) => fireEvent.click(screen.getByRole("button", { name })));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenLastCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);
				fireEvent.click(screen.getByRole("button", { name: "Update options" }));

				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenLastCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
				);
			}
		);

		it.each`
			scenario                                                                                 | selected      | expectedValueBeforeUpdate                                                    | expectedValueAfterUpdate
			${"should retain the nested field values of options that are not removed on overriding"} | ${["A", "C"]} | ${{ redKey: { appleKey: "Apple" }, orangeKey: { carrotKey: "Carrot" } }}     | ${{ redKey: { appleKey: "Apple" } }}
			${"should retain nested field values if particular nested field is not overridden"}      | ${["A", "B"]} | ${{ redKey: { appleKey: "Apple" }, blueKey: { berryKey: "Berry" } }}         | ${{ redKey: { appleKey: "Apple" }, blueKey: { berryKey: "Berry" } }}
			${"should clear nested field values if option is removed on overriding"}                 | ${["C", "D"]} | ${{ orangeKey: { carrotKey: "Carrot" }, greenKey: { durianKey: "Durian" } }} | ${{}}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(
					<ComponentWithSetSchemaButton
						initialSchema={merge(cloneDeep(JSON_SCHEMA), {
							sections: {
								section: {
									children: {
										[COMPONENT_ID]: NESTED_JSON_FIELDS,
									},
								},
							},
						})}
						onClick={(data) => ({
							...data,
							overrides: {
								[COMPONENT_ID]: {
									label: "overridden",
									options: [
										{
											label: "Red",
											value: "Red",
											key: "redKey",
											subItems: [{ label: "A", value: "Apple" }],
										},
										{
											label: "Blue",
											value: "Blue",
											key: "blueKey",
											subItems: [{ label: "B", value: "Berry", key: "berryKey" }],
										},
										{
											label: "Orange",
											value: "Orange",
											key: "orangeKey",
											subItems: [{ label: "E", value: "Eggplant", key: "eggplantKey" }],
										},
										{ label: "F", value: "Fish", key: "fishKey" },
									],
								},
							},
						})}
					/>
				);

				await waitFor(() => fireEvent.click(getComponent()));

				selected.forEach((name) => fireEvent.click(screen.getByRole("button", { name })));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenLastCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);
				fireEvent.click(screen.getByRole("button", { name: "Update options" }));

				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenLastCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
				);
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
			expect(SUBMIT_FN).toHaveBeenLastCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = {
				appleKey: "Apple",
				berryKey: "Berry",
			};
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			fireEvent.click(getComponent());
			const apple = getCheckboxA();
			const berry = getCheckboxB();
			const cherry = getCheckboxC();
			fireEvent.click(cherry);
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText("2 selected")).toBeInTheDocument();
			expect(apple.querySelector("div[aria-checked=true]")).toBeInTheDocument();
			expect(berry.querySelector("div[aria-checked=true]")).toBeInTheDocument();
			expect(cherry.querySelector("div[aria-checked=false]")).toBeInTheDocument();
			expect(SUBMIT_FN).toHaveBeenLastCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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
					data={{
						...JSON_SCHEMA,
						defaultValues: {
							[COMPONENT_ID]: {
								appleKey: "apple",
							},
						},
					}}
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
					data={{
						...JSON_SCHEMA,
						defaultValues: {
							[COMPONENT_ID]: {
								appleKey: "apple",
								berryKey: "Berry",
							},
						},
					}}
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

	labelTestSuite(renderComponent);
	warningTestSuite<INestedMultiSelectSchema>({
		label: "Nestedmultiselect",
		uiType: UI_TYPE,
		options: [
			{ label: "A", value: "Apple", key: "appleKey" },
			{ label: "B", value: "Berry", key: "berryKey" },
			{ label: "C", value: "Cherry", key: "cherryKey" },
			{ label: "D", value: "Durian", key: "durianKey" },
		],
	});
});
