import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
} from "../../../../components/frontend-engine";

const submitFn = jest.fn();
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
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "text",
			},
			field2: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ field1: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId("field1"), { target: { value: invalid } });
		expect(screen.queryByTestId("field2")).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field1"), { target: { value: valid } });
		expect(screen.getByTestId("field2")).toBeInTheDocument();
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
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "number",
			},
			field2: {
				label: "Field 2",
				fieldType: "number",
				showIf: [{ field1: [config] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId("field1"), { target: { value: invalid } });
		expect(screen.queryByTestId("field2")).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field1"), { target: { value: valid } });
		expect(screen.getByTestId("field2")).toBeInTheDocument();
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
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "multi-select",
				options: [
					{ value: "Apple", label: "Apple" },
					{ value: "Berry", label: "Berry" },
					{ value: "Cherry", label: "Cherry" },
				],
			},
			field2: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ field1: [config] }],
			},
		};
		renderComponent(fields);

		invalid?.forEach((value) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(screen.queryByTestId("field2")).not.toBeInTheDocument();

		// fire invalid again to deselect values
		invalid?.forEach((value) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		valid?.forEach((value) => {
			fireEvent.click(screen.getByText(value).closest("button"));
		});
		expect(screen.getByTestId("field2")).toBeInTheDocument();
	});

	it("should support AND conditions", () => {
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "text",
			},
			field2: {
				label: "Field 1",
				fieldType: "text",
			},
			field3: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ field1: [{ filled: true }], field2: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(screen.queryByTestId("field3")).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field1"), { target: { value: "hello" } });
		expect(screen.queryByTestId("field3")).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field2"), { target: { value: "hello" } });
		expect(screen.getByTestId("field3")).toBeInTheDocument();
	});

	it("should support OR conditions", () => {
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "text",
			},
			field2: {
				label: "Field 1",
				fieldType: "text",
			},
			field3: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ field1: [{ filled: true }] }, { field2: [{ filled: true }] }],
			},
		};
		renderComponent(fields);

		expect(screen.queryByTestId("field3")).not.toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field1"), { target: { value: "hello" } });
		expect(screen.getByTestId("field3")).toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field1"), { target: { value: null } });
		fireEvent.change(screen.getByTestId("field2"), { target: { value: "hello" } });
		expect(screen.getByTestId("field3")).toBeInTheDocument();
	});

	it("should remove validation schema for fields that are conditionally hidden", async () => {
		const errorMessage = "error message";
		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "text",
			},
			field2: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ field1: [{ filled: true }, { min: 5 }] }],
				validation: [
					{ required: true, errorMessage },
					{ min: 5, errorMessage },
				],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId("field1"), { target: { value: "hello" } });
		fireEvent.change(screen.getByTestId("field2"), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(screen.getByText(errorMessage)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId("field1"), { target: { value: "hi" } });
		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
	});

	it("should not submit fields that are conditionally hidden", async () => {
		jest.clearAllMocks();

		const fields: Record<string, TFrontendEngineFieldSchema> = {
			field1: {
				label: "Field 1",
				fieldType: "text",
			},
			field2: {
				label: "Field 2",
				fieldType: "text",
				showIf: [{ field1: [{ min: 5 }] }],
			},
		};
		renderComponent(fields);

		fireEvent.change(screen.getByTestId("field1"), { target: { value: "hello" } });
		fireEvent.change(screen.getByTestId("field2"), { target: { value: "world" } });
		fireEvent.change(screen.getByTestId("field1"), { target: { value: "hi" } });

		await waitFor(() => fireEvent.click(screen.getByTestId("submit")));
		expect(submitFn).toBeCalledWith(expect.objectContaining({ field1: "hi" }));
		expect(submitFn).toBeCalledWith(expect.not.objectContaining({ field2: expect.anything() }));
	});
});
