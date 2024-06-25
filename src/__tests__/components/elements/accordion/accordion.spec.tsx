import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { FrontendEngine, IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../../components";
import { IAccordionSchema } from "../../../../components/elements";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideField, getField } from "../../../common";

const COMPONENT_ID = "field";
const UI_TYPE = "accordion";
const COMPONENT_TEST_ID = TestHelper.generateId(COMPONENT_ID, UI_TYPE);
const CUSTOM_LABEL = "Custom Label";
const ACCORDION_TITLE = "Title";

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
	eventType?: string;
	eventListener?: (this: Element, ev: Event) => any;
}

const renderComponent = (
	options: IRenderAndPerformActionsOptions,
	overrideField?: TOverrideField<IAccordionSchema>
) => {
	const {
		eventType = "empty-event",
		eventListener = () => {
			return undefined;
		},
	} = options;

	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						uiType: UI_TYPE,
						children: {
							text: {
								uiType: "text-field",
								label: "Text",
							},
							text2: {
								uiType: "text-field",
								label: "Text 2",
							},
						},
						"data-testid": COMPONENT_TEST_ID,
						button: {
							label: CUSTOM_LABEL,
						},
						collapsible: true,
						expanded: true,
						title: ACCORDION_TITLE,
						...overrideField,
					},
				},
			},
		},
	};
	return render(<FrontendEngineWithEventListener data={json} eventType={eventType} eventListener={eventListener} />);
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent({});
		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
	});

	it("should render the button if a label is passed in", () => {
		renderComponent({});
		expect(screen.getByText(CUSTOM_LABEL)).toBeInTheDocument();
	});

	it("should render the title correctly", () => {
		renderComponent({});
		expect(screen.getByText(ACCORDION_TITLE)).toBeInTheDocument();
	});

	it("should render the default button if button is true", () => {
		renderComponent(
			{},
			{
				button: true,
			}
		);
		expect(screen.getByText("Edit")).toBeInTheDocument();

		const element = screen.queryByText(CUSTOM_LABEL);
		expect(element).toBeNull();
	});

	it("should not render the button if button is false", () => {
		renderComponent(
			{},
			{
				button: false,
			}
		);

		const element = screen.queryByText(CUSTOM_LABEL);
		expect(element).toBeNull();
	});

	it("should not render the button if button is undefined", () => {
		renderComponent(
			{},
			{
				button: undefined,
			}
		);

		const element = screen.queryByText(CUSTOM_LABEL);
		expect(element).toBeNull();
	});

	it("should fire edit event when the button is clicked", async () => {
		const editEventHandler = jest.fn();
		await renderComponent({
			eventType: "edit",
			eventListener: editEventHandler,
		});
		await waitFor(() => fireEvent.click(getField("button", CUSTOM_LABEL, false)));

		expect(editEventHandler).toHaveBeenCalled();
	});

	it("should be expanded when expanded is true", () => {
		renderComponent({});
		//This is checking expandable-container height
		const element = screen.getByTestId("expandable-container");
		expect(window.getComputedStyle(element).height).not.toBe("0px");
	});

	it("should be collapsed when override expanded is false", () => {
		renderComponent(
			{},
			{
				expanded: false,
			}
		);

		//This is checking expandable-container height
		const element = screen.getByTestId("expandable-container");
		expect(window.getComputedStyle(element).height).toBe("0px");
	});
});
