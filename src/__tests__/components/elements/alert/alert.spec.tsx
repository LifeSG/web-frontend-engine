import { render, screen } from "@testing-library/react";
import { IAlertSchema } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const uiType = "alert";
const componentTestId = TestHelper.generateId(componentId, "alert");

const renderComponent = (overrideField?: TOverrideField<IAlertSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				uiType,
				children: "Alert",
				type: "success",
				...overrideField,
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

describe(uiType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
	});

	it("should be able to render a ReactNode children", () => {
		renderComponent({ children: <div>This is a react node</div> });

		expect(screen.getByText("This is a react node")).toBeInTheDocument();
	});

	it("should be able to render a HTML string", () => {
		renderComponent({ children: "<div>This is a HTML string</div>" });

		expect(screen.getByText("This is a HTML string")).toBeInTheDocument();
	});

	it("should be able to sanitize HTML string", () => {
		const consoleSpy = jest.spyOn(console, "log");
		renderComponent({
			children: "<div>This is a sanitized string<script>console.log('hello world')</script></div>",
		});

		expect(screen.getByText("This is a sanitized string")).toBeInTheDocument();
		expect(consoleSpy).not.toBeCalled();
	});
});
