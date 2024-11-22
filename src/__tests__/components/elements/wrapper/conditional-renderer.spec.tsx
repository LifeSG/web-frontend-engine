import { LocalDate } from "@js-joda/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
	TRestoreMode,
} from "../../../../components/frontend-engine";
import { SUBMIT_BUTTON_SCHEMA } from "../../../../stories/common";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const FIELD_ONE_ID = "field1";
const FIELD_TWO_ID = "field2";
const FIELD_THREE_ID = "field3";
const FIELD_ONE_LABEL = "Field one";
const FIELD_TWO_LABEL = "Field two";
const FIELD_THREE_LABEL = "Field three";

const renderComponent = (
	fields: Record<string, TFrontendEngineFieldSchema>,
	defaultValues?: Record<string, unknown> | undefined,
	overrides?: Record<string, unknown> | undefined,
	restoreMode?: TRestoreMode | undefined
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					...fields,
					...getSubmitButtonProps(),
				},
			},
		},
		defaultValues,
		overrides,
		restoreMode,
	};

	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getFieldOne = (isQuery = false): HTMLElement => {
	return getField("textbox", FIELD_ONE_LABEL, isQuery);
};

const getFieldTwo = (isQuery = false): HTMLElement => {
	return getField("textbox", FIELD_TWO_LABEL, isQuery);
};

const getFieldThree = (isQuery = false): HTMLElement => {
	return getField("textbox", FIELD_THREE_LABEL, isQuery);
};

export const changeDate = async (day: string, month: string, year: string) => {
	fireEvent.focus(getField("textbox", "day"));
	fireEvent.change(getField("textbox", "day"), { target: { value: day } });
	fireEvent.change(getField("textbox", "month"), { target: { value: month } });
	fireEvent.change(getField("textbox", "year"), { target: { value: year } });
	await waitFor(() => fireEvent.click(screen.getByText("Done")));
};

describe("conditional-renderer", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it.each`
		condition      | config                       | invalid    | valid
		${"filled"}    | ${{ filled: true }}          | ${null}    | ${"hello"}
		${"empty"}     | ${{ empty: true }}           | ${"hello"} | ${null}
		${"equals"}    | ${{ equals: "hello" }}       | ${"hi"}    | ${"hello"}
		${"notEquals"} | ${{ notEquals: "hello" }}    | ${"hello"} | ${"hi"}
		${"min"}       | ${{ min: 4 }}                | ${"hi"}    | ${"hello"}
		${"max"}       | ${{ max: 4 }}                | ${"hello"} | ${"hi"}
		${"matches"}   | ${{ matches: "/^(hello)/" }} | ${"hi"}    | ${"hello"}
		${"email"}     | ${{ email: true }}           | ${"hello"} | ${"john@doe.tld"}
		${"url"}       | ${{ url: true }}             | ${"hello"} | ${"https://domain.tld"}
		${"uuid"}      | ${{ uuid: true }}            | ${"hello"} | ${"e9949c11-51b6-4c44-9070-623dfb2ca01a"}
	`("should support $condition condition for string conditional rendering", ({ config, invalid, valid }) => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(getFieldOne(), { target: { value: invalid } });
		expect(getFieldTwo(true)).not.toBeInTheDocument();

		fireEvent.change(getFieldOne(), { target: { value: valid } });
		expect(getFieldTwo()).toBeInTheDocument();
	});

	it.each`
		condition      | config                | invalid | valid
		${"filled"}    | ${{ filled: true }}   | ${null} | ${1}
		${"empty"}     | ${{ empty: true }}    | ${1}    | ${null}
		${"equals"}    | ${{ equals: 1 }}      | ${2}    | ${1}
		${"notEquals"} | ${{ notEquals: 1 }}   | ${1}    | ${2}
		${"min"}       | ${{ min: 5 }}         | ${4}    | ${5}
		${"max"}       | ${{ max: 5 }}         | ${6}    | ${5}
		${"lessThan"}  | ${{ lessThan: 5 }}    | ${5}    | ${4}
		${"moreThan"}  | ${{ moreThan: 5 }}    | ${5}    | ${6}
		${"positive"}  | ${{ positive: true }} | ${-1}   | ${1}
		${"negative"}  | ${{ negative: true }} | ${1}    | ${-1}
		${"integer"}   | ${{ integer: true }}  | ${1.1}  | ${1}
	`("should support $condition condition for number conditional rendering", ({ config, invalid, valid }) => {
		const uiType = "numeric-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(getField("spinbutton", FIELD_ONE_LABEL), { target: { value: invalid } });
		expect(getField("spinbutton", FIELD_TWO_LABEL, true)).not.toBeInTheDocument();

		fireEvent.change(getField("spinbutton", FIELD_ONE_LABEL), { target: { value: valid } });
		expect(getField("spinbutton", FIELD_TWO_LABEL)).toBeInTheDocument();
	});

	it.each`
		condition              | config                               | invalid                         | valid
		${"filled"}            | ${{ filled: true }}                  | ${null}                         | ${["Apple"]}
		${"empty"}             | ${{ empty: true }}                   | ${["Apple"]}                    | ${null}
		${"equals"}            | ${{ equals: ["Apple"] }}             | ${["Berry"]}                    | ${["Apple"]}
		${"notEquals"}         | ${{ notEquals: ["Apple"] }}          | ${["Apple"]}                    | ${["Berry"]}
		${"min"}               | ${{ min: 2 }}                        | ${["Apple"]}                    | ${["Apple", "Berry"]}
		${"max"}               | ${{ max: 2 }}                        | ${["Apple", "Berry", "Cherry"]} | ${["Apple", "Berry"]}
		${"includes (string)"} | ${{ includes: "Berry" }}             | ${["Apple"]}                    | ${["Apple", "Berry"]}
		${"includes (array)"}  | ${{ includes: ["Berry", "Cherry"] }} | ${["Berry"]}                    | ${["Apple", "Berry", "Cherry"]}
		${"excludes (string)"} | ${{ excludes: "Berry" }}             | ${["Apple", "Berry"]}           | ${["Apple", "Cherry"]}
		${"excludes (array)"}  | ${{ excludes: ["Berry", "Cherry"] }} | ${["Apple", "Berry"]}           | ${["Apple"]}
	`("should support $condition condition for array conditional rendering", async ({ config, invalid, valid }) => {
		setupJestCanvasMock();
		const fieldOneType = "multi-select";
		const fieldTwoType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType: fieldOneType,
				options: [
					{ value: "Apple", label: "Apple" },
					{ value: "Berry", label: "Berry" },
					{ value: "Cherry", label: "Cherry" },
				],
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType: fieldTwoType,
				showIf: [{ [FIELD_ONE_ID]: [config] }],
			},
		};
		renderComponent(fields);

		await waitFor(() => fireEvent.click(getField("button", "Select")));

		invalid?.forEach((value: string) => {
			fireEvent.click(screen.getByRole("option", { name: value }));
		});
		expect(getFieldTwo(true)).not.toBeInTheDocument();

		// fire invalid again to deselect values
		invalid?.forEach((value: string) => {
			fireEvent.click(screen.getByRole("option", { name: value }));
		});
		valid?.forEach((value: string) => {
			fireEvent.click(screen.getByRole("option", { name: value }));
		});
		expect(getFieldTwo()).toBeInTheDocument();
	});

	describe.each`
		condition        | config                                                         | invalid                 | valid
		${"within-days"} | ${{ withinDays: { numberOfDays: 7 } }}                         | ${["09", "01", "2022"]} | ${["02", "01", "2022"]}
		${"within-days"} | ${{ withinDays: { numberOfDays: -7 } }}                        | ${["02", "01", "2022"]} | ${["31", "12", "2021"]}
		${"within-days"} | ${{ withinDays: { numberOfDays: 5, fromDate: "2022-01-05" } }} | ${["01", "01", "2022"]} | ${["06", "01", "2022"]}
	`("$condition validation", ({ condition, config, invalid, valid }) => {
		beforeEach(() => {
			jest.spyOn(LocalDate, "now").mockReturnValue(LocalDate.parse("2022-01-01"));
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it(`should support ${condition} condition for date field conditional rendering`, async () => {
			const uiTypeField1 = "date-field";
			const uiTypeField2 = "text-field";
			const fields: Record<string, TFrontendEngineFieldSchema> = {
				[FIELD_ONE_ID]: {
					label: FIELD_ONE_LABEL,
					uiType: uiTypeField1,
					validation: [config],
				},
				[FIELD_TWO_ID]: {
					label: FIELD_TWO_LABEL,
					uiType: uiTypeField2,
					showIf: [{ [FIELD_ONE_ID]: [{ filled: true }] }],
				},
			};
			renderComponent(fields);

			await changeDate(invalid[0], invalid[1], invalid[2]);
			fireEvent.click(getField("button", "Done"));
			expect(getFieldTwo(true)).not.toBeInTheDocument();

			await changeDate(valid[0], valid[1], valid[2]);
			fireEvent.click(getField("button", "Done"));
			expect(getFieldTwo()).toBeInTheDocument();
		});
	});

	it("should support AND conditions", () => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
			},
			[FIELD_THREE_ID]: {
				label: FIELD_THREE_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [{ filled: true }], [FIELD_TWO_ID]: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(getFieldThree(true)).not.toBeInTheDocument();

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		expect(getFieldThree(true)).not.toBeInTheDocument();

		fireEvent.change(getFieldTwo(), { target: { value: "hello" } });
		expect(getFieldThree()).toBeInTheDocument();
	});

	it("should support OR conditions", () => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
			},
			[FIELD_THREE_ID]: {
				label: FIELD_THREE_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [{ filled: true }] }, { [FIELD_TWO_ID]: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(getFieldThree(true)).not.toBeInTheDocument();

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		expect(getFieldThree()).toBeInTheDocument();

		fireEvent.change(getFieldOne(), { target: { value: null } });
		fireEvent.change(getFieldTwo(), { target: { value: "hello" } });
		expect(getFieldThree()).toBeInTheDocument();
	});

	it("should render conditional field if form is prefilled with matching value", () => {
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType: "text-field",
			},
			wrapper: {
				uiType: "div",
				children: {
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType: "text-field",
					},
				},
				showIf: [{ [FIELD_ONE_ID]: [{ filled: true }] }],
			},
		};
		renderComponent(fields, { [FIELD_ONE_ID]: "hello" });

		expect(getFieldTwo()).toBeInTheDocument();
	});

	it("should remove validation schema for fields that are conditionally hidden", async () => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [{ filled: true }, { min: 5 }] }],
				validation: [
					{ required: true, errorMessage: ERROR_MESSAGE },
					{ min: 5, errorMessage: ERROR_MESSAGE },
				],
			},
		};
		renderComponent(fields);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.change(getFieldTwo(), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(SUBMIT_FN).not.toBeCalled();

		fireEvent.change(getFieldOne(), { target: { value: "hi" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalled();
	});

	it("should remove validation schema for fields with parents that are conditionally hidden", async () => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			wrapper: {
				uiType: "div",
				showIf: [{ [FIELD_ONE_ID]: [{ filled: true }, { min: 5 }] }],
				children: {
					nested: {
						uiType: "div",
						children: {
							[FIELD_TWO_ID]: {
								label: FIELD_TWO_LABEL,
								uiType,
								validation: [
									{ required: true, errorMessage: ERROR_MESSAGE },
									{ min: 5, errorMessage: ERROR_MESSAGE },
								],
							},
						},
					},
				},
			},
		};
		renderComponent(fields);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.change(getFieldTwo(), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(SUBMIT_FN).not.toBeCalled();

		fireEvent.change(getFieldTwo(), { target: { value: "" } });
		fireEvent.change(getFieldOne(), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalled();
	});

	it("should not submit fields that are conditionally hidden", async () => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [{ min: 5 }] }],
			},
			nested: {
				uiType: "div",
				children: {
					[FIELD_THREE_ID]: {
						label: FIELD_THREE_LABEL,
						uiType,
						showIf: [{ [FIELD_ONE_ID]: [{ min: 5 }] }],
					},
				},
			},
		};
		renderComponent(fields);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.change(getFieldTwo(), { target: { value: "world" } });
		fireEvent.change(getFieldThree(), { target: { value: "kitty" } });
		fireEvent.change(getFieldOne(), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hi" }));

		const values = SUBMIT_FN.mock.lastCall[0];
		expect(values).not.toHaveProperty(FIELD_TWO_ID);
		expect(values).not.toHaveProperty(FIELD_THREE_ID);
	});

	it("should not submit prefilled fields that are conditionally hidden", async () => {
		const uiType = "text-field";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[FIELD_ONE_ID]: {
				label: FIELD_ONE_LABEL,
				uiType,
			},
			[FIELD_TWO_ID]: {
				label: FIELD_TWO_LABEL,
				uiType,
				showIf: [{ [FIELD_ONE_ID]: [{ min: 5 }] }],
			},
			nested: {
				uiType: "div",
				children: {
					[FIELD_THREE_ID]: {
						label: FIELD_THREE_LABEL,
						uiType,
						showIf: [{ [FIELD_ONE_ID]: [{ min: 5 }] }],
					},
				},
			},
		};
		const defaultValues = {
			[FIELD_ONE_ID]: "hi",
			[FIELD_TWO_ID]: "world",
			[FIELD_THREE_ID]: "kitty",
		};
		renderComponent(fields, defaultValues);

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hi" }));

		const values = SUBMIT_FN.mock.lastCall[0];
		expect(values).not.toHaveProperty(FIELD_TWO_ID);
		expect(values).not.toHaveProperty(FIELD_THREE_ID);
	});

	describe("shown condition", () => {
		it("should support shown condition", () => {
			const uiType = "text-field";
			const fields: Record<string, TFrontendEngineFieldSchema> = {
				[FIELD_ONE_ID]: {
					label: FIELD_ONE_LABEL,
					uiType,
				},
				[FIELD_TWO_ID]: {
					label: FIELD_TWO_LABEL,
					uiType,
					showIf: [{ [FIELD_ONE_ID]: [{ equals: "show" }] }],
				},
				[FIELD_THREE_ID]: {
					label: FIELD_THREE_LABEL,
					uiType,
					showIf: [{ [FIELD_TWO_ID]: [{ shown: true }] }],
				},
			};
			renderComponent(fields);

			fireEvent.change(getFieldOne(), { target: { value: "show" } });
			expect(getFieldTwo()).toBeInTheDocument();
			expect(getFieldThree()).toBeInTheDocument();

			fireEvent.change(getFieldOne(), { target: { value: "hide" } });
			expect(getFieldTwo(true)).not.toBeInTheDocument();
			expect(getFieldThree(true)).not.toBeInTheDocument();
		});

		it("should support shown condition as one of the conditional rendering rules", () => {
			const uiType = "text-field";
			const fields: Record<string, TFrontendEngineFieldSchema> = {
				[FIELD_ONE_ID]: {
					label: FIELD_ONE_LABEL,
					uiType,
				},
				[FIELD_TWO_ID]: {
					label: FIELD_TWO_LABEL,
					uiType,
					showIf: [{ [FIELD_ONE_ID]: [{ equals: "show" }] }],
				},
				[FIELD_THREE_ID]: {
					label: FIELD_THREE_LABEL,
					uiType,
					showIf: [{ [FIELD_TWO_ID]: [{ shown: true }, { filled: true }] }],
				},
			};
			renderComponent(fields);

			fireEvent.change(getFieldOne(), { target: { value: "show" } });
			fireEvent.change(getFieldTwo(), { target: { value: "val" } });
			expect(getFieldTwo()).toBeInTheDocument();
			expect(getFieldThree()).toBeInTheDocument();

			fireEvent.change(getFieldOne(), { target: { value: "hide" } });
			expect(getFieldTwo(true)).not.toBeInTheDocument();
			expect(getFieldThree(true)).not.toBeInTheDocument();
		});

		it("should support shown conditions declared out of order", () => {
			const uiType = "text-field";
			const fields: Record<string, TFrontendEngineFieldSchema> = {
				[FIELD_THREE_ID]: {
					label: FIELD_THREE_LABEL,
					uiType,
					showIf: [{ [FIELD_TWO_ID]: [{ shown: true }] }],
				},
				[FIELD_TWO_ID]: {
					label: FIELD_TWO_LABEL,
					uiType,
					showIf: [{ [FIELD_ONE_ID]: [{ equals: "show" }] }],
				},
				[FIELD_ONE_ID]: {
					label: FIELD_ONE_LABEL,
					uiType,
				},
			};
			renderComponent(fields);

			fireEvent.change(getFieldOne(), { target: { value: "show" } });
			expect(getFieldTwo()).toBeInTheDocument();
			expect(getFieldThree()).toBeInTheDocument();

			fireEvent.change(getFieldOne(), { target: { value: "hide" } });
			expect(getFieldTwo(true)).not.toBeInTheDocument();
			expect(getFieldThree(true)).not.toBeInTheDocument();
		});

		it("should still evaluate shown condition if source field is not defined", async () => {
			const uiType = "text-field";
			const fields: Record<string, TFrontendEngineFieldSchema> = {
				[FIELD_ONE_ID]: {
					label: FIELD_ONE_LABEL,
					uiType,
					showIf: [{ missing: [{ shown: true }] }],
					validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				},
			};
			renderComponent(fields);

			expect(getFieldOne(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({}));
		});
	});

	describe("overrides", () => {
		const uiType = "text-field";

		it("should allow overriding of conditionally rendered components", () => {
			renderComponent(
				{
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType,
					},
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType,
						showIf: [{ [FIELD_ONE_ID]: [{ filled: true }] }],
					},
				},
				undefined,
				{
					[FIELD_TWO_ID]: {
						disabled: true,
					},
				}
			);
			fireEvent.change(getFieldOne(), { target: { value: "hello" } });

			expect(getFieldTwo()).toBeDisabled();
		});

		it("should allow overriding of component into being conditionally rendered", () => {
			renderComponent(
				{
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType,
					},
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType,
					},
				},
				undefined,
				{
					[FIELD_TWO_ID]: {
						showIf: [{ [FIELD_ONE_ID]: [{ filled: true }] }],
					},
				}
			);

			expect(getFieldTwo(true)).not.toBeInTheDocument();
		});

		it("should allow overriding of conditional rendering rules", () => {
			renderComponent(
				{
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType,
					},
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType,
						showIf: [{ [FIELD_ONE_ID]: [{ equals: "hello" }] }],
					},
				},
				undefined,
				{
					[FIELD_TWO_ID]: {
						showIf: [{ [FIELD_ONE_ID]: [{ equals: "hi" }] }],
					},
				}
			);
			fireEvent.change(getFieldOne(), { target: { value: "hi" } });

			expect(getFieldTwo()).toBeInTheDocument();
		});
	});

	it("should support shown condition dependent on overrides", async () => {
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			overridden: {
				uiType: "div",
				children: {},
			},
			wrapper: {
				uiType: "div",
				showIf: [{ parent: [{ shown: true }] }],
				children: {
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType: "text-field",
						showIf: [{ missing: [{ shown: true }] }],
					},
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType: "text-field",
					},
				},
			},
		};
		renderComponent(
			fields,
			{ [FIELD_ONE_ID]: "one", [FIELD_TWO_ID]: "two" },
			{
				overridden: {
					children: {
						parent: { uiType: "hidden-field" },
					},
				},
			}
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_TWO_ID]: "two" }));
	});

	describe("restore mode", () => {
		it.each`
			restoreMode        | dataType     | field2UiType       | field2DefaultValue     | field2UserInput       | field2ExpectedValue
			${"none"}          | ${"string"}  | ${"text-field"}    | ${undefined}           | ${"bye"}              | ${""}
			${"none"}          | ${"number"}  | ${"numeric-field"} | ${undefined}           | ${1}                  | ${undefined}
			${"none"}          | ${"boolean"} | ${"switch"}        | ${undefined}           | ${true}               | ${undefined}
			${"none"}          | ${"array"}   | ${"checkbox"}      | ${undefined}           | ${["Apple", "Berry"]} | ${[]}
			${"default-value"} | ${"string"}  | ${"text-field"}    | ${"world"}             | ${"bye"}              | ${"world"}
			${"default-value"} | ${"number"}  | ${"numeric-field"} | ${2}                   | ${1}                  | ${2}
			${"default-value"} | ${"boolean"} | ${"switch"}        | ${false}               | ${true}               | ${false}
			${"default-value"} | ${"array"}   | ${"checkbox"}      | ${["Apple", "Cherry"]} | ${["Apple", "Berry"]} | ${["Apple", "Cherry"]}
			${"user-input"}    | ${"string"}  | ${"text-field"}    | ${undefined}           | ${"bye"}              | ${"bye"}
			${"user-input"}    | ${"number"}  | ${"numeric-field"} | ${undefined}           | ${1}                  | ${1}
			${"user-input"}    | ${"boolean"} | ${"switch"}        | ${undefined}           | ${true}               | ${true}
			${"user-input"}    | ${"array"}   | ${"checkbox"}      | ${undefined}           | ${["Apple", "Berry"]} | ${["Apple", "Berry"]}
		`(
			"should populate $dataType-based conditionally rendered field in `$restoreMode` restoreMode",
			async ({ restoreMode, field2UiType, field2DefaultValue, field2UserInput, field2ExpectedValue }) => {
				render(
					<FrontendEngineWithCustomButton
						data={{
							id: FRONTEND_ENGINE_ID,
							sections: {
								section: {
									uiType: "section",
									children: {
										[FIELD_ONE_ID]: { label: FIELD_ONE_LABEL, uiType: "text-field" },
										[FIELD_TWO_ID]: {
											label: FIELD_TWO_LABEL,
											uiType: field2UiType,
											showIf: [{ [FIELD_ONE_ID]: [{ min: 5 }] }],
											options: [
												{ label: "Apple", value: "Apple" },
												{ label: "Berry", value: "Berry" },
												{ label: "Cherry", value: "Cherry" },
											],
										},
										...SUBMIT_BUTTON_SCHEMA,
									},
								},
							},
							defaultValues: { [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: field2DefaultValue },
							restoreMode,
						}}
						onClick={(ref) => ref.current?.setValue(FIELD_TWO_ID, field2UserInput)}
						onSubmit={SUBMIT_FN}
					/>
				);

				await waitFor(() => fireEvent.click(getField("button", "Custom Button")));

				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: field2UserInput })
				);

				fireEvent.change(getFieldOne(), { target: { value: "hi" } });

				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hi" }));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.not.objectContaining({ [FIELD_TWO_ID]: expect.anything() })
				);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });

				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: field2ExpectedValue })
				);
			}
		);

		const defaultValue = "world";
		const userInput = "bye";
		const uiType = "text-field";
		const defaultValues = { [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: defaultValue };

		it.each`
			restoreMode        | expected
			${"none"}          | ${{ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: "" }}
			${"default-value"} | ${{ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: defaultValue }}
			${"user-input"}    | ${{ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: userInput }}
		`("should reset hidden field in `$restoreMode` mode", async ({ restoreMode }) => {
			renderComponent(
				{
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType,
					},
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType,
						showIf: [{ [FIELD_ONE_ID]: [{ min: 5 }] }],
					},
					reset: {
						label: "Reset",
						uiType: "reset",
					},
				},
				defaultValues,
				undefined,
				restoreMode
			);

			fireEvent.change(getFieldTwo(), { target: { value: userInput } });

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: userInput })
			);

			fireEvent.change(getFieldOne(), { target: { value: "hi" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hi" }));
			expect(SUBMIT_FN).toBeCalledWith(expect.not.objectContaining({ [FIELD_TWO_ID]: expect.anything() }));

			fireEvent.click(screen.queryByText("Reset"));

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: defaultValue })
			);
		});
	});
});
