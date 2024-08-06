import { render, screen } from "@testing-library/react";
import { ITimelineSchema } from "../../../../components/custom";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema } from "../../../common";

const COMPONENT_ID = "field";
const REFERENCE_KEY = "timeline";
const LABEL = "label";
const ITEMS = [
	{
		label: "Item 1",
		children: "This is item 1",
	},
	{
		label: "Item 2",
		children: "This is item 2.",
	},
];

const renderComponent = (overrideField?: TOverrideField<ITimelineSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						referenceKey: REFERENCE_KEY,
						label: LABEL,
						items: ITEMS,
						...overrideField,
					},
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} />);
};

describe(REFERENCE_KEY, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the component", () => {
		renderComponent();
		const item1 = screen.getByText(ITEMS[0].label);
		const item2 = screen.getByText(ITEMS[1].label);

		expect(screen.getByText(LABEL)).toBeInTheDocument();
		expect(item1.compareDocumentPosition(item2)).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
	});

	it("should be able to render HTML string in the items", () => {
		renderComponent({
			items: [
				{
					label: "Item 1",
					children: "This is an item with <strong>bold</strong> text.",
				},
			],
		});

		expect(document.querySelector("strong")).toHaveTextContent("bold");
	});

	it("should be able to render from a schema", () => {
		renderComponent({
			items: [
				{
					label: "Item 1",
					children: {
						alert: {
							uiType: "alert",
							type: "info",
							children: "test",
						},
					},
				},
			],
		});

		expect(screen.getByText("test")).toBeInTheDocument();
	});
});
