import { fireEvent, render } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { FrontendEngine } from "../../../../components";
import { IButtonSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../../components/types";
import { FRONTEND_ENGINE_ID, getField } from "../../../common";

const COMPONENT_ID = "field";

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
interface Props {
	overrideButton?: Partial<IButtonSchema> | undefined;
	defaultValues?: Record<string, any>;
	eventType?: string;
	eventListener?: (this: Element, ev: Event) => any;
}
const renderComponent = (props: Props) => {
	const { defaultValues, eventListener, eventType, overrideButton: overrideSubmit } = props;
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Button",
						uiType: "button",
						...overrideSubmit,
					},
				},
			},
		},
		defaultValues,
	};
	return render(<FrontendEngineWithEventListener data={json} eventType={eventType} eventListener={eventListener} />);
};

describe("button", () => {
	describe("events", () => {
		it("should fire onclick event", async () => {
			const handleClick = jest.fn();
			renderComponent({ eventType: "click", eventListener: handleClick });
			fireEvent.click(getField("button", "Button", false));
			expect(handleClick).toBeCalled();
		});
		it("start icon should render before label", async () => {
			const handleClick = jest.fn();
			renderComponent({
				eventType: "onclick",
				eventListener: handleClick,
				overrideButton: { startIcon: "AlbumFillIcon" },
			});
			const span = document.querySelector("span");
			const startIcon = document.querySelector(".start-icon");
			expect(span.childNodes.length).toEqual(2);
			expect(startIcon).toEqual(span.firstChild);
		});
		it("start icon should render before label", async () => {
			renderComponent({
				overrideButton: { startIcon: "AlbumFillIcon" },
			});
			const span = document.querySelector("span");
			const startIcon = document.querySelector(".start-icon");
			expect(span.childNodes.length).toEqual(2);
			expect(startIcon).toEqual(span.firstChild);
		});
		it("end icon should render after label", async () => {
			renderComponent({
				overrideButton: { endIcon: "AlbumFillIcon" },
			});
			const span = document.querySelector("span");
			const endIcon = document.querySelector(".end-icon");
			expect(span.childNodes.length).toEqual(2);
			expect(endIcon).toEqual(span.lastChild);
		});
	});
});
