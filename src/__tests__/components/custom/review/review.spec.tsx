import { render, screen } from "@testing-library/react";
import { IReviewSchema } from "../../../../components/custom";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { FRONTEND_ENGINE_ID, TOverrideField } from "../../../common";

const COMPONENT_ID = "field";
const REFERENCE_KEY = "review";
const LABEL = "label";
const DESCRIPTION = "description";
const ITEMS = [
	{ label: "Label 1", value: "Value 1" },
	{ label: "Label 2", value: "Value 2" },
];
const ALERT_TOP = "test top alert";
const ALERT_BOTTOM = "test bottom alert";

const renderComponent = (overrideField?: TOverrideField<IReviewSchema>) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						referenceKey: REFERENCE_KEY,
						label: LABEL,
						description: DESCRIPTION,
						items: ITEMS,
						...overrideField,
					},
				},
			},
		},
	};
	return render(<FrontendEngine data={json} />);
};

describe(REFERENCE_KEY, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByText(LABEL)).toBeInTheDocument();
		expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
		expect(screen.getByText(ITEMS[0].label)).toBeInTheDocument();
		expect(screen.getByText(ITEMS[1].value)).toBeInTheDocument();
	});

	it("should be able to render the topSection and bottomSection", () => {
		renderComponent({
			topSection: {
				alertTop: {
					uiType: "alert",
					type: "warning",
					children: ALERT_TOP,
				},
			},
			bottomSection: {
				alertBottom: {
					uiType: "alert",
					type: "warning",
					children: ALERT_BOTTOM,
				},
			},
		});

		expect(screen.getByText(ALERT_TOP)).toBeInTheDocument();
		expect(screen.getByText(ALERT_BOTTOM)).toBeInTheDocument();
	});
});
