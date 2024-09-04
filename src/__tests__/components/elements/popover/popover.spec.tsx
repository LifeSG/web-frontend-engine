import { fireEvent, render, screen } from "@testing-library/react";
import { IPopoverSchema } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema } from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "popover";
const COMPONENT_TEST_ID = TestHelper.generateId(COMPONENT_ID, "popover");

const renderComponent = (overrideField?: TOverrideField<IPopoverSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						uiType: UI_TYPE,
						children: "Text",
						hint: { content: "Hint" },
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
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the text and hint", () => {
		renderComponent();

		expect(screen.getByText("Text")).toBeInTheDocument();
		expect(screen.queryByText("Hint")).not.toBeInTheDocument();

		fireEvent.click(screen.getByTestId("field__popover"));

		expect(screen.getByText("Hint")).toBeVisible();
	});

	it("should be able to render a HTML string", () => {
		renderComponent({ children: "<div>HTML text</div>", hint: { content: "<div>HTML hint</div>" } });

		fireEvent.click(screen.getByTestId("field__popover"));

		expect(screen.getByText("HTML text")).toBeInTheDocument();
		expect(screen.getByText("HTML hint")).toBeInTheDocument();
	});

	it("should be able to sanitize HTML string", () => {
		renderComponent({
			children: "<div>HTML text<script>console.log('hello world')</script></div>",
			hint: { content: "<div>HTML hint<script>console.log('hello world')</script></div>" },
		});

		fireEvent.click(screen.getByTestId("field__popover"));

		expect(screen.getByText("HTML text")).toBeInTheDocument();
		expect(screen.getByText("HTML hint")).toBeInTheDocument();
		expect(screen.queryByTestId(COMPONENT_TEST_ID).innerHTML.includes("script")).toBe(false);
		expect(screen.queryByTestId("popover").innerHTML.includes("script")).toBe(false);
	});
});
