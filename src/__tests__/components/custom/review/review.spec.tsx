import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
						label: LABEL,
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

	describe("box variant", () => {
		it("should be able to render the field", () => {
			renderComponent({ overrideField: { variant: "box", description: DESCRIPTION } });

			expect(screen.getByText(LABEL)).toBeInTheDocument();
			expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
			expect(screen.getByText(ITEMS[0].label)).toBeInTheDocument();
			expect(screen.getByText(ITEMS[1].value)).toBeInTheDocument();
		});

		it("should be able to render the topSection and bottomSection", () => {
			renderComponent({
				overrideField: {
					variant: "box",
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
	});

	describe("accordion variant", () => {
		it("should be able to render the field", () => {
			renderComponent({ overrideField: { variant: "accordion" } });

			expect(screen.getByText(LABEL)).toBeInTheDocument();
			expect(getField("button", "Edit")).toBeInTheDocument();
			expect(screen.getByText(ITEMS[0].label)).toBeInTheDocument();
			expect(screen.getByText(ITEMS[1].value)).toBeInTheDocument();
		});

		it("should render eye icon and be able to mask / unmask uinfin if mask = uinfin", async () => {
			renderComponent({
				overrideField: { variant: "accordion", items: [{ label: "NRIC", value: "S1234567D", mask: "uinfin" }] },
			});

			expect(screen.getByText("S••••567D")).toBeInTheDocument();
			expect(screen.getByTestId(`${COMPONENT_ID}__eye`)).toBeInTheDocument();

			act(() => {
				fireEvent.click(screen.getByTestId(`${COMPONENT_ID}__eye`));
			});

			expect(screen.getByText("S1234567D")).toBeInTheDocument();
		});

		it("should render eye icon and be able to mask / unmask entire value if mask = whole", async () => {
			const value = "John Doe";
			renderComponent({
				overrideField: { variant: "accordion", items: [{ label: "Name", value, mask: "whole" }] },
			});

			expect(screen.getByText("•".repeat(value.length))).toBeInTheDocument();
			expect(screen.getByTestId(`${COMPONENT_ID}__eye`)).toBeInTheDocument();

			act(() => {
				fireEvent.click(screen.getByTestId(`${COMPONENT_ID}__eye`));
			});

			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		it("should be able to customise button label", () => {
			const buttonLabel = "Modify";
			renderComponent({ overrideField: { variant: "accordion", button: { label: buttonLabel } } });

			expect(getField("button", buttonLabel)).toBeInTheDocument();
		});

		it("should be able to hide button", () => {
			renderComponent({ overrideField: { variant: "accordion", button: false } });

			expect(getField("button", "Edit", true)).not.toBeInTheDocument();
		});

		describe("events", () => {
			it("should fire mount event on mount", () => {
				const testFn = jest.fn();
				renderComponent({
					eventType: "mount",
					eventListener: testFn,
					overrideField: { variant: "accordion" },
				});

				expect(testFn).toHaveBeenCalled();
			});

			it("should fire edit event on clicking edit button", async () => {
				const testFn = jest.fn();
				renderComponent({
					eventType: "edit",
					eventListener: testFn,
					overrideField: { variant: "accordion" },
				});

				await waitFor(() => fireEvent.click(getField("button", "Edit")));
				expect(testFn).toHaveBeenCalled();
			});
		});
	});
});
