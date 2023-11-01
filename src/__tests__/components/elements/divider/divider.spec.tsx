import { render, screen } from "@testing-library/react";
import { IDividerSchema } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema } from "../../../common";

const COMPONENT_ID = "field";
const UI_TYPE = "divider";
const COMPONENT_TEST_ID = TestHelper.generateId(COMPONENT_ID, "divider");

const renderComponent = (overrideField?: TOverrideField<IDividerSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						uiType: UI_TYPE,
						...overrideField,
					},
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} />);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the element", () => {
		renderComponent();

		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
	});
});
