import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
} from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { SUBMIT_BUTTON_ID } from "../../../common";

const submitFn = jest.fn();
const fieldOneId = "field1";
const fieldTwoId = "field2";
const fieldThreeId = "field3";

const renderComponent = (fields: Record<string, TFrontendEngineFieldSchema>) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			...fields,
			submit: {
				label: "Submit",
				fieldType: "submit",
			},
		},
	};

	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
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
		const fieldType = "text";
		const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldTwoId]: {
				label: "Field 2",
				fieldType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: invalid } });
		expect(screen.queryByTestId(fieldTwoTestId)).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: valid } });
		expect(screen.getByTestId(fieldTwoTestId)).toBeInTheDocument();
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
		const fieldType = "numeric";
		const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldTwoId]: {
				label: "Field 2",
				fieldType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: invalid } });
		expect(screen.queryByTestId(fieldTwoTestId)).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: valid } });
		expect(screen.getByTestId(fieldTwoTestId)).toBeInTheDocument();
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
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldTwoType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType: fieldOneType,
				options: [
					{ value: "Apple", label: "Apple" },
					{ value: "Berry", label: "Berry" },
					{ value: "Cherry", label: "Cherry" },
				],
			},
			[fieldTwoId]: {
				label: "Field 2",
				fieldType: fieldTwoType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		invalid?.forEach((value) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(screen.queryByTestId(fieldTwoTestId)).not.toBeInTheDocument();

		// fire invalid again to deselect values
		invalid?.forEach((value) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		valid?.forEach((value) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(screen.getByTestId(fieldTwoTestId)).toBeInTheDocument();
	});

	it("should support AND conditions", () => {
		const fieldType = "text";
		const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldType);
		const fieldThreeTestId = TestHelper.generateId(fieldThreeId, fieldType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldTwoId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldThreeId]: {
				label: "Field 2",
				fieldType,
				showIf: [{ [fieldOneId]: [{ filled: true }], [fieldTwoId]: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(screen.queryByTestId(fieldThreeTestId)).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		expect(screen.queryByTestId(fieldThreeTestId)).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldTwoTestId), { target: { value: "hello" } });
		expect(screen.getByTestId(fieldThreeTestId)).toBeInTheDocument();
	});

	it("should support OR conditions", () => {
		const fieldType = "text";
		const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldType);
		const fieldThreeTestId = TestHelper.generateId(fieldThreeId, fieldType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldTwoId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldThreeId]: {
				label: "Field 2",
				fieldType,
				showIf: [{ [fieldOneId]: [{ filled: true }] }, { [fieldTwoId]: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(screen.queryByTestId(fieldThreeTestId)).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		expect(screen.getByTestId(fieldThreeTestId)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: null } });
		fireEvent.change(screen.getByTestId(fieldTwoTestId), { target: { value: "hello" } });
		expect(screen.getByTestId(fieldThreeTestId)).toBeInTheDocument();
	});

	it("should remove validation schema for fields that are conditionally hidden", async () => {
		const errorMessage = "error message";
		const fieldType = "text";
		const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType: "text",
			},
			[fieldTwoId]: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ [fieldOneId]: [{ filled: true }, { min: 5 }] }],
				validation: [
					{ required: true, errorMessage },
					{ min: 5, errorMessage },
				],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		fireEvent.change(screen.getByTestId(fieldTwoTestId), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(screen.getByText(errorMessage)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hi" } });
		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
	});

	it("should not submit fields that are conditionally hidden", async () => {
		const fieldType = "text";
		const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
		const fieldTwoTestId = TestHelper.generateId(fieldTwoId, fieldType);
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: "Field 1",
				fieldType,
			},
			[fieldTwoId]: {
				label: "Field 2",
				fieldType,
				showIf: [{ [fieldOneId]: [{ min: 5 }] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		fireEvent.change(screen.getByTestId(fieldTwoTestId), { target: { value: "world" } });
		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [fieldOneId]: "hi" }));
		expect(submitFn).toBeCalledWith(expect.not.objectContaining({ [fieldTwoId]: expect.anything() }));
	});
});
