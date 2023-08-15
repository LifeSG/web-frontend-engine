import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
	TRestoreMode,
} from "../../../../components/frontend-engine";
import { ERROR_MESSAGE, FRONTEND_ENGINE_ID, getField, getSubmitButton, getSubmitButtonProps } from "../../../common";

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

const getFieldOne = (): HTMLElement => {
	return getField("textbox", FIELD_ONE_LABEL);
};

const getFieldTwo = (isQuery = false): HTMLElement => {
	return getField("textbox", FIELD_TWO_LABEL, isQuery);
};

const getFieldThree = (isQuery = false): HTMLElement => {
	return getField("textbox", FIELD_THREE_LABEL, isQuery);
};

describe("conditional-renderer", () => {
	beforeEach(() => {
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

		await waitFor(() => fireEvent.click(getField("button", FIELD_ONE_LABEL)));

		invalid?.forEach((value: string) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(getFieldTwo(true)).not.toBeInTheDocument();

		// fire invalid again to deselect values
		invalid?.forEach((value: string) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		valid?.forEach((value: string) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(getFieldTwo()).toBeInTheDocument();
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

	describe("restore mode", () => {
		const defaultValue = "world";
		const userInput = "bye";
		const uiType = "text-field";
		const defaultValues = { [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: defaultValue };

		it.each`
			restoreMode        | expected
			${"none"}          | ${{ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: "" }}
			${"default-value"} | ${{ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: defaultValue }}
			${"user-input"}    | ${{ [FIELD_ONE_ID]: "hello", [FIELD_TWO_ID]: userInput }}
		`("should populate conditionally rendered field in `$restoreMode` mode", async ({ restoreMode, expected }) => {
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

			fireEvent.change(getFieldOne(), { target: { value: "hello" } });

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining(expected));
		});

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
