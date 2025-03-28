import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";
import "../../../../../jest/mocks/match-media";
import { ITextFieldSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema, getField, getSubmitButtonProps } from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const REFERENCE_KEY = "filter-item";
const TEXTFIELD_LABEL = "Name";

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
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	describe("desktop", () => {
		beforeEach(() => {
			mocked(window.matchMedia).mockImplementation(() => {
				return {
					matches: false,
					addListener: jest.fn(),
					removeListener: jest.fn(),
				} as Partial<MediaQueryList> as MediaQueryList;
			});
		});

		it("should be able to render child filter items and child fields", async () => {
			renderComponent();
			await waitFor(() => expect(screen.getByText("Filters")).toBeInTheDocument());
			expect(screen.getByLabelText(TEXTFIELD_LABEL)).toBeInTheDocument();
		});

		it("should clear form when when clicked on clear button", async () => {
			renderComponent();
			expect(screen.getByTestId("filterItem1__filter-item")).toBeInTheDocument();
			const [clearBtn] = screen.queryAllByText("Clear");
			const textfield = getField("textbox", TEXTFIELD_LABEL);
			await waitFor(() => fireEvent.change(textfield, { target: { value: "something value" } }));
			expect(screen.getAllByDisplayValue("something value")[0]).toBeInTheDocument();
			await waitFor(() => fireEvent.click(clearBtn));
			expect(screen.queryAllByDisplayValue("something value")).toHaveLength(0);
		});
	});

	describe("mobile", () => {
		beforeEach(() => {
			mocked(window.matchMedia).mockImplementation(() => {
				return {
					matches: true,
					addListener: jest.fn(),
					removeListener: jest.fn(),
				} as Partial<MediaQueryList> as MediaQueryList;
			});
		});

		it("should render modal with Done button when clicked on filters button", async () => {
			renderComponent();
			expect(screen.getByTestId("filterItem1__filter-item")).toBeInTheDocument();
			const filterBtn = screen.queryByRole("button", { name: "Filters" });
			expect(filterBtn).toBeInTheDocument();
			await waitFor(() => fireEvent.click(filterBtn));
			expect(screen.getByText("Done")).toBeVisible();
		});

		it("should be able to close the rendered modal with close button.", async () => {
			renderComponent();
			expect(screen.getByTestId("filterItem1__filter-item")).toBeInTheDocument();
			const filterBtn = screen.queryByRole("button", { name: "Filters" });
			expect(filterBtn).toBeInTheDocument();
			await waitFor(() => fireEvent.click(filterBtn));
			expect(screen.getByText("Done")).toBeVisible();
			const closeBtn = screen.getByLabelText("Dismiss");
			await waitFor(() => fireEvent.click(closeBtn));
			expect(screen.getByText("Done")).not.toBeVisible();
		});
	});
});
