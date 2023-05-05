import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ITextFieldSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema, getSubmitButtonProps, getField } from "../../../common";
const { ResizeObserver } = window;

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const REFERENCE_KEY = "filter-item";
const TEXTFIELD_LABEL = "Name";
const clearCallback = jest.fn();
const renderComponent = (overrideField?: TOverrideField<ITextFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					filter: {
						referenceKey: "filter",
						label: "Filters",
						children: {
							filterItem1: {
								referenceKey: REFERENCE_KEY,
								label: "Filter Item",
								children: {
									[COMPONENT_ID]: {
										uiType: "text-field",
										label: TEXTFIELD_LABEL,
										...overrideField,
									},
								},
							},
							...getSubmitButtonProps(),
						},
					},
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

// TODO: Add more tests
describe(REFERENCE_KEY, () => {
	beforeEach(() => {
		jest.resetAllMocks();
		delete window.ResizeObserver;
		window.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
	});

	afterEach(() => {
		window.ResizeObserver = ResizeObserver;
		jest.restoreAllMocks();
	});

	it("should be able to render child filter items and child fields", () => {
		renderComponent();
		expect(screen.getByRole("heading", { name: "Filters" })).toBeInTheDocument();
	});

	it("should render modal with Done button when clicked on filters button", async () => {
		renderComponent();
		expect(screen.getAllByTestId("filterItem1__filter-item")).toHaveLength(2);
		const [filterBtn] = screen.queryAllByText("Filters");
		expect(filterBtn).toBeInTheDocument();
		await waitFor(() => fireEvent.click(filterBtn));
		expect(screen.getByText("Done")).toBeVisible();
	});

	it("should clear form when when clicked on clear button", async () => {
		renderComponent();
		expect(screen.getAllByTestId("filterItem1__filter-item")).toHaveLength(2);
		const [clearBtn] = screen.queryAllByText("Clear");
		const textfield = getField("textbox", TEXTFIELD_LABEL);
		await waitFor(() => fireEvent.change(textfield, { target: { value: "something value" } }));
		expect(screen.getAllByDisplayValue("something value")[0]).toBeInTheDocument();
		await waitFor(() => fireEvent.click(clearBtn));
		expect(screen.queryAllByDisplayValue("something value")).toHaveLength(0);
	});

	it("should be able to close the rendered modal with close button.", async () => {
		renderComponent();
		expect(screen.getAllByTestId("filterItem1__filter-item")).toHaveLength(2);
		const [filterBtn] = screen.queryAllByText("Filters");
		expect(filterBtn).toBeInTheDocument();
		await waitFor(() => fireEvent.click(filterBtn));
		expect(screen.getByText("Done")).toBeVisible();
		const closeBtn = screen.getByLabelText("Dismiss");
		await waitFor(() => fireEvent.click(closeBtn));
		expect(screen.getByText("Done")).not.toBeVisible();
	});
});
