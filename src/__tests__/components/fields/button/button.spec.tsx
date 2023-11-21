import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { FrontendEngine } from "../../../../components";
import { IButtonSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../../components/types";
import { FRONTEND_ENGINE_ID, getField } from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Button";

interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	eventType?: string | undefined;
	eventListener?: ((this: Element, ev: Event) => void) | undefined;
}

const FrontendEngineWithEventListener = (props: ICustomFrontendEngineProps) => {
	const { eventType, eventListener, ...otherProps } = props || {};
	const formRef = useRef<IFrontendEngineRef>();
	useEffect(() => {
		if (eventType && eventListener) {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventType, COMPONENT_ID, eventListener);
			return () => currentFormRef.removeFieldEventListener(eventType, COMPONENT_ID, eventListener);
		}
	}, [eventListener, eventType]);

	return <FrontendEngine {...otherProps} ref={formRef} onSubmit={SUBMIT_FN} />;
};
interface Props {
	overrideButton?: Partial<IButtonSchema> | undefined;
	eventType?: string | undefined;
	eventListener?: ((this: Element, ev: Event) => void) | undefined;
}
const renderComponent = (props?: Props) => {
	const { eventListener, eventType, overrideButton } = props || {};
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: COMPONENT_LABEL,
						uiType: "button",
						...overrideButton,
					},
				},
			},
		},
	};
	return render(<FrontendEngineWithEventListener data={json} eventType={eventType} eventListener={eventListener} />);
};

describe("button", () => {
	it("should not submit the form on click", () => {
		renderComponent();
		fireEvent.click(getField("button", COMPONENT_LABEL));

		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should render startIcon before button label", async () => {
		renderComponent({ overrideButton: { startIcon: "AlbumFillIcon" } });
		const label = screen.getByText(COMPONENT_LABEL);
		const startIcon = document.querySelector("svg");

		expect(label.childNodes.length).toEqual(2);
		expect(startIcon).toEqual(label.firstChild);
	});

	it("should render endIcon after button label", async () => {
		renderComponent({ overrideButton: { endIcon: "AlbumFillIcon" } });
		const label = screen.getByText(COMPONENT_LABEL);
		const endIcon = document.querySelector("svg");

		expect(label.childNodes.length).toEqual(2);
		expect(endIcon).toEqual(label.lastChild);
	});

	describe("events", () => {
		it("should fire click event", async () => {
			const handleClick = jest.fn();
			renderComponent({ eventType: "click", eventListener: handleClick });
			fireEvent.click(getField("button", COMPONENT_LABEL));

			expect(handleClick).toHaveBeenCalled();
		});
	});
});
