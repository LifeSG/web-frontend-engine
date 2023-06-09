import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine, IFrontendEngineData } from "../../../../components";
import { ILocationInputSchema } from "../../../../components/fields";
import {
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getResetButtonProps,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "location-input";
const renderComponent = (overrideField?: TOverrideField<ILocationInputSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Location input",
						uiType: UI_TYPE,
						...overrideField,
					},
					...getSubmitButtonProps(),
					...getResetButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

describe("location-input-group", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	// what should see
	// double
	// single
	describe("rendering", () => {
		it("should be able to render the location input field and open the modal", async () => {
			await renderComponent();

			expect(screen.getByTestId("field")).toBeInTheDocument();
			expect(screen.getByLabelText("Location input")).toBeInTheDocument();
		});
	});

	// what should do
	// error
});
