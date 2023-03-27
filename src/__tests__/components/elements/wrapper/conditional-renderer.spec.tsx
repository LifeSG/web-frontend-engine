import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
} from "../../../../components/frontend-engine";
import { ERROR_MESSAGE, FRONTEND_ENGINE_ID, getField, getSubmitButton, getSubmitButtonProps } from "../../../common";

const submitFn = jest.fn();
const fieldOneId = "field1";
const fieldTwoId = "field2";
const fieldThreeId = "field3";
const fieldOneLabel = "Field one";
const fieldTwoLabel = "Field two";
const fieldThreeLabel = "Field three";

const renderComponent = (fields: Record<string, TFrontendEngineFieldSchema>) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			...fields,
			...getSubmitButtonProps(),
		},
	};

	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

const getFieldOne = (): HTMLElement => {
	return getField("textbox", fieldOneLabel);
};

const getFieldTwo = (isQuery = false): HTMLElement => {
	return getField("textbox", fieldTwoLabel, isQuery);
};

const getFieldThree = (isQuery = false): HTMLElement => {
	return getField("textbox", fieldThreeLabel, isQuery);
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
		const uiType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType,
				showIf: [{ [fieldOneId]: [config] }],
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
		const uiType = "numeric";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(getFieldOne(), { target: { value: invalid } });
		expect(getFieldTwo(true)).not.toBeInTheDocument();

		fireEvent.change(getFieldOne(), { target: { value: valid } });
		expect(getFieldTwo()).toBeInTheDocument();
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
	`("should support $condition condition for array conditional rendering", ({ config, invalid, valid }) => {
		const fieldOneType = "multi-select";
		const fieldTwoType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType: fieldOneType,
				options: [
					{ value: "Apple", label: "Apple" },
					{ value: "Berry", label: "Berry" },
					{ value: "Cherry", label: "Cherry" },
				],
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType: fieldTwoType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

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
		const uiType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType,
			},
			[fieldThreeId]: {
				label: fieldThreeLabel,
				uiType,
				showIf: [{ [fieldOneId]: [{ filled: true }], [fieldTwoId]: [{ filled: true }] }],
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
		const uiType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType,
			},
			[fieldThreeId]: {
				label: fieldThreeLabel,
				uiType,
				showIf: [{ [fieldOneId]: [{ filled: true }] }, { [fieldTwoId]: [{ filled: true }] }],
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

	it("should remove validation schema for fields that are conditionally hidden", async () => {
		const uiType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType,
				showIf: [{ [fieldOneId]: [{ filled: true }, { min: 5 }] }],
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

		fireEvent.change(getFieldOne(), { target: { value: "hi" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
	});

	it("should not submit fields that are conditionally hidden", async () => {
		const uiType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				uiType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				uiType,
				showIf: [{ [fieldOneId]: [{ min: 5 }] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.change(getFieldTwo(), { target: { value: "world" } });
		fireEvent.change(getFieldOne(), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [fieldOneId]: "hi" }));
		expect(submitFn).toBeCalledWith(expect.not.objectContaining({ [fieldTwoId]: expect.anything() }));
	});
});
