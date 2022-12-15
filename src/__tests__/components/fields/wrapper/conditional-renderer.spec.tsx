import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
} from "../../../../components/frontend-engine";
import { ERROR_MESSAGE, FRONTEND_ENGINE_ID, SUBMIT_BUTTON_ID, SUBMIT_BUTTON_NAME } from "../../../common";

const submitFn = jest.fn();
const fieldOneId = "field1";
const fieldTwoId = "field2";
const fieldThreeId = "field3";
const fieldOneLabel = "Field 1";
const fieldTwoLabel = "Field 2";
const fieldThreeLabel = "Field 3";

const renderComponent = (fields: Record<string, TFrontendEngineFieldSchema>) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			...fields,
			[SUBMIT_BUTTON_ID]: {
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
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				fieldType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: invalid } });
		expect(screen.queryByRole("textbox", { name: fieldTwoLabel })).not.toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: valid } });
		expect(screen.getByRole("textbox", { name: fieldTwoLabel })).toBeInTheDocument();
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
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				fieldType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: invalid } });
		expect(screen.queryByRole("textbox", { name: fieldTwoLabel })).not.toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: valid } });
		expect(screen.getByRole("textbox", { name: fieldTwoLabel })).toBeInTheDocument();
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
				fieldType: fieldOneType,
				options: [
					{ value: "Apple", label: "Apple" },
					{ value: "Berry", label: "Berry" },
					{ value: "Cherry", label: "Cherry" },
				],
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType: fieldTwoType,
				showIf: [{ [fieldOneId]: [config] }],
			},
		};
		renderComponent(fields);

		invalid?.forEach((value: string) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(screen.queryByRole("textbox", { name: fieldTwoLabel })).not.toBeInTheDocument();

		// fire invalid again to deselect values
		invalid?.forEach((value: string) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		valid?.forEach((value: string) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(screen.getByRole("textbox", { name: fieldTwoLabel })).toBeInTheDocument();
	});

	it("should support AND conditions", () => {
		const fieldType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				fieldType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType,
			},
			[fieldThreeId]: {
				label: fieldThreeLabel,
				fieldType,
				showIf: [{ [fieldOneId]: [{ filled: true }], [fieldTwoId]: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(screen.queryByRole("textbox", { name: fieldThreeLabel })).not.toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		expect(screen.queryByRole("textbox", { name: fieldThreeLabel })).not.toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldTwoLabel }), { target: { value: "hello" } });
		expect(screen.getByRole("textbox", { name: fieldThreeLabel })).toBeInTheDocument();
	});

	it("should support OR conditions", () => {
		const fieldType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				fieldType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType,
			},
			[fieldThreeId]: {
				label: fieldThreeLabel,
				fieldType,
				showIf: [{ [fieldOneId]: [{ filled: true }] }, { [fieldTwoId]: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(screen.queryByRole("textbox", { name: fieldThreeLabel })).not.toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		expect(screen.getByRole("textbox", { name: fieldThreeLabel })).toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: null } });
		fireEvent.change(screen.getByRole("textbox", { name: fieldTwoLabel }), { target: { value: "hello" } });
		expect(screen.getByRole("textbox", { name: fieldThreeLabel })).toBeInTheDocument();
	});

	it("should remove validation schema for fields that are conditionally hidden", async () => {
		const fieldType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				fieldType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType,
				showIf: [{ [fieldOneId]: [{ filled: true }, { min: 5 }] }],
				validation: [
					{ required: true, errorMessage: ERROR_MESSAGE },
					{ min: 5, errorMessage: ERROR_MESSAGE },
				],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		fireEvent.change(screen.getByRole("textbox", { name: fieldTwoLabel }), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hi" } });
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
	});

	it("should not submit fields that are conditionally hidden", async () => {
		const fieldType = "text";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			[fieldOneId]: {
				label: fieldOneLabel,
				fieldType,
			},
			[fieldTwoId]: {
				label: fieldTwoLabel,
				fieldType,
				showIf: [{ [fieldOneId]: [{ min: 5 }] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		fireEvent.change(screen.getByRole("textbox", { name: fieldTwoLabel }), { target: { value: "world" } });
		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON_NAME })));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ [fieldOneId]: "hi" }));
		expect(submitFn).toBeCalledWith(expect.not.objectContaining({ [fieldTwoId]: expect.anything() }));
	});
});
