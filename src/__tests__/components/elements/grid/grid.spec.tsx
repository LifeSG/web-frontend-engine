import { render, screen } from "@testing-library/react";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, getField } from "../../../common";

const SUBMIT_FN = jest.fn();
const REFERENCE_KEY = "grid-layout";
const TEXTFIELD_LABEL = "Name";
const TEXTFIELD_LABEL_2 = "Name_2";

const renderComponent = () => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					group: {
						uiType: "grid",
						children: {
							box1: {
								uiType: "text-field",
								label: TEXTFIELD_LABEL,
								colProps: { desktopCols: 6 },
							},
							box2: {
								uiType: "text-field",
								label: TEXTFIELD_LABEL_2,
								colProps: { desktopCols: 6 },
							},
						},
					},
				},
			},
		},
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

	it("should be able to render grid and child fields", () => {
		renderComponent();
		expect(screen.getByTestId(TestHelper.generateId("group", "grid"))).toBeInTheDocument();
		const field = getField("textbox", TEXTFIELD_LABEL);
		expect(field).toBeInTheDocument();
		expect(screen.getByTestId(TestHelper.generateId("box1", "text-field"))).toBeInTheDocument();
		const field_1 = getField("textbox", TEXTFIELD_LABEL_2);
		expect(field_1).toBeInTheDocument();
		expect(screen.getByTestId(TestHelper.generateId("box2", "text-field"))).toBeInTheDocument();
		const field_2 = getField("textbox", TEXTFIELD_LABEL_2);
		expect(field_2).toBeInTheDocument();
	});

	it("Check style grid layout", () => {
		renderComponent();
		const layout = screen.getByTestId(TestHelper.generateId("group", "grid"));
		expect(getComputedStyle(layout).display).toBe("grid");
	});

	it("Check style descendants's grid layout", () => {
		renderComponent();
		const box1 = screen.getByTestId(TestHelper.generateId("box1", "grid_item"));
		expect(getComputedStyle(box1)["grid-column"]).toBe("auto / span 6");
	});
});
