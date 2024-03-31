import { fireEvent, render, screen } from "@testing-library/react";
import { IOrderedListSchema } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema, getField } from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "ordered-list";
const COMPONENT_TEST_ID = TestHelper.generateId(COMPONENT_ID, "ordered-list");

const renderComponent = (overrideField?: TOverrideField<IOrderedListSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						uiType: UI_TYPE,
						children: ["Item 1", "Item 2"],
						...overrideField,
					},
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("should be able to sanitize HTML string", () => {
		renderComponent({
			children: ["<div>This is a sanitized string<script>console.log('hello world')</script></div>"],
		});

		expect(screen.getByText("This is a sanitized string")).toBeInTheDocument();
		expect(screen.getByTestId(COMPONENT_TEST_ID).innerHTML.includes("script")).toBe(false);
	});

	it("should be able to render nested list items", () => {
		renderComponent({
			children: [
				{
					listItem: {
						uiType: "list-item",
						children: {
							text: {
								uiType: "text-body",
								children: "Item with list",
							},
							list: {
								uiType: "ordered-list",
								counterType: "lower-alpha",
								counterSeparator: ".",
								children: ["Nested item one", "Nested item two with <strong>bold</strong> text"],
							},
						},
					},
				},
			],
		});

		expect(screen.getAllByRole("listitem")).toHaveLength(3);
	});

	it("should be able to conditionally render a list item", async () => {
		renderComponent({
			children: [
				{
					listItem1: {
						uiType: "list-item",
						children: {
							listItemField: {
								uiType: "text-field",
								label: "listItemField",
							},
						},
					},
					listItem2: {
						uiType: "list-item",
						showIf: [{ listItemField: [{ filled: true }] }],
						children: "Item 2",
					},
				},
			],
		});

		expect(screen.getAllByRole("listitem")).toHaveLength(1);

		fireEvent.change(getField("textbox", "listItemField"), { target: { value: "hello" } });

		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});
});
