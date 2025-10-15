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
			currentFormRef.addFieldEventListener("button", eventType as any, COMPONENT_ID, eventListener);
			return () =>
				currentFormRef.removeFieldEventListener("button", eventType as any, COMPONENT_ID, eventListener);
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

	describe("navigation", () => {
		const mockWindowOpen = jest.fn();
		let mockLocationHref = "";
		const originalOpen = window.open;
		const originalLocation = window.location;

		beforeEach(() => {
			window.open = mockWindowOpen;

			mockLocationHref = "";
			Object.defineProperty(window, "location", {
				value: {
					...originalLocation,
					get href() {
						return mockLocationHref;
					},
					set href(url: string) {
						mockLocationHref = url;
					},
				},
				writable: true,
				configurable: true,
			});
		});

		afterEach(() => {
			jest.clearAllMocks();
			window.open = originalOpen;
			Object.defineProperty(window, "location", {
				value: originalLocation,
				writable: true,
				configurable: true,
			});
		});

		it.each`
			scenario                                           | href
			${"should not navigate when href is not provided"} | ${undefined}
			${"should not navigate when href is invalid"}      | ${"invalid-url"}
		`("$scenario", ({ href }) => {
			renderComponent({ overrideButton: { ...(href && { href }) } });
			fireEvent.click(getField("button", COMPONENT_LABEL));

			expect(mockWindowOpen).not.toHaveBeenCalled();
			expect(window.location.href).toBe("");
		});

		it.each`
			scenario                                                                  | target       | expectedWindowOpen | expectedHref
			${"should navigate in same window when target is _self"}                  | ${"_self"}   | ${false}           | ${"https://example.com"}
			${"should navigate in same window when no target is specified (default)"} | ${undefined} | ${false}           | ${"https://example.com"}
			${"should open new tab when target is _blank"}                            | ${"_blank"}  | ${true}            | ${""}
		`("$scenario", ({ target, expectedWindowOpen, expectedHref }) => {
			renderComponent({
				overrideButton: {
					href: "https://example.com",
					...(target && { target }),
				},
			});
			fireEvent.click(getField("button", COMPONENT_LABEL));

			if (expectedWindowOpen) {
				expect(mockWindowOpen).toHaveBeenCalledWith("https://example.com", "_blank", "noopener noreferrer");
			} else {
				expect(mockWindowOpen).not.toHaveBeenCalled();
			}
			expect(window.location.href).toBe(expectedHref);
		});

		it.each`
			scenario                                                     | target       | windowProperty
			${"should navigate in parent window when target is _parent"} | ${"_parent"} | ${"parent"}
			${"should navigate in top window when target is _top"}       | ${"_top"}    | ${"top"}
		`("$scenario", ({ target, windowProperty }) => {
			const mockWindow = {
				location: { href: "" },
			};
			const originalWindow = (window as any)[windowProperty];
			Object.defineProperty(window, windowProperty, {
				value: mockWindow,
				writable: true,
				configurable: true,
			});

			renderComponent({
				overrideButton: {
					href: "https://example.com",
					target,
				},
			});
			fireEvent.click(getField("button", COMPONENT_LABEL));

			expect(mockWindow.location.href).toBe("https://example.com");
			expect(mockWindowOpen).not.toHaveBeenCalled();

			Object.defineProperty(window, windowProperty, {
				value: originalWindow,
				writable: true,
				configurable: true,
			});
		});

		it("should still fire click event when navigating", () => {
			const handleClick = jest.fn();
			renderComponent({
				overrideButton: {
					href: "https://example.com",
					target: "_blank",
				},
				eventType: "click",
				eventListener: handleClick,
			});
			fireEvent.click(getField("button", COMPONENT_LABEL));

			expect(handleClick).toHaveBeenCalled();
			expect(mockWindowOpen).toHaveBeenCalled();
		});
	});
});
