import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { IReviewSchema } from "../../../../components/custom";
import {
	FrontendEngine,
	IFrontendEngineData,
	IFrontendEngineProps,
	IFrontendEngineRef,
} from "../../../../components/frontend-engine";
import { FRONTEND_ENGINE_ID, getField } from "../../../common";

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

interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	eventType?: string;
	eventListener?: (this: Element, ev: Event) => any;
}

const FrontendEngineWithEventListener = (props: ICustomFrontendEngineProps) => {
	const { eventType, eventListener, ...otherProps } = props;
	const formRef = useRef<IFrontendEngineRef>();

	useEffect(() => {
		if (eventType && eventListener) {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventType, COMPONENT_ID, eventListener);
			return () => currentFormRef.removeFieldEventListener(eventType, COMPONENT_ID, eventListener);
		}
	}, [eventListener, eventType]);

	return <FrontendEngine {...otherProps} ref={formRef} />;
};

interface IRenderAndPerformActionsOptions {
	overrideField?: Partial<IReviewSchema>;
	eventType?: string;
	eventListener?: (this: Element, ev: Event) => any;
}

const renderComponent = (options: IRenderAndPerformActionsOptions) => {
	const { overrideField, eventType, eventListener } = options;

	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						referenceKey: REFERENCE_KEY,
						items: ITEMS,
						...overrideField,
					},
				},
			},
		},
	};
	return render(<FrontendEngineWithEventListener data={json} eventType={eventType} eventListener={eventListener} />);
};

describe(REFERENCE_KEY, () => {
	beforeEach(() => {
		jest.resetAllMocks();
		global.ResizeObserver = jest.fn().mockImplementation(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));
	});

	it("should be able to render the field", () => {
		renderComponent({ overrideField: { label: LABEL, description: DESCRIPTION } });

		expect(screen.getByText(LABEL)).toBeInTheDocument();
		expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
		expect(screen.getByText(ITEMS[0].label)).toBeInTheDocument();
		expect(screen.getByText(ITEMS[1].value)).toBeInTheDocument();
	});

	it("should be able to render the topSection and bottomSection", () => {
		renderComponent({
			overrideField: {
				label: LABEL,
				description: DESCRIPTION,
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
			},
		});

		expect(screen.getByText(ALERT_TOP)).toBeInTheDocument();
		expect(screen.getByText(ALERT_BOTTOM)).toBeInTheDocument();
	});

	describe("events", () => {
		it("button-click", async () => {
			const testFn = jest.fn();
			renderComponent({
				eventType: "button-click",
				eventListener: testFn,
				overrideField: { variant: "accodion" },
			});

			await waitFor(() => fireEvent.click(getField("button", "Edit", false)));
			expect(testFn).toBeCalled();
		});
	});
});
