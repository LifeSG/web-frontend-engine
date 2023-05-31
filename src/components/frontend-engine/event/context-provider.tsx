import { ReactElement, createContext, useEffect, useRef } from "react";

/**
 * events are added / removed / dispatched via the eventManager
 * the eventManager is just a div, the handling of events is purely through native event handlers
 */
interface IEventContext {
	eventManagerRef: React.RefObject<Element>;
}

interface IProps {
	children: ReactElement;
}

export const EventContext = createContext<IEventContext>({
	eventManagerRef: { current: null },
});

export const EventProvider = ({ children }: IProps) => {
	const eventManagerRef = useRef<Element>();

	useEffect(() => {
		eventManagerRef.current = document.createElement("div");
	}, []);

	return <EventContext.Provider value={{ eventManagerRef }}>{children}</EventContext.Provider>;
};
