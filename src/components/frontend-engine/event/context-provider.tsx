import { createContext, ReactElement, useRef } from "react";

/**
 * events are added / removed / dispatched via the eventManager
 * the eventManager is just a div, the handling of events is purely through native event handlers
 */
interface IEventContext {
	eventManager: Element;
}

interface IProps {
	children: ReactElement;
}

export const EventContext = createContext<IEventContext>({
	eventManager: null,
});

export const EventProvider = ({ children }: IProps) => {
	const eventManager = useRef<Element>(document?.createElement("div"));

	return <EventContext.Provider value={{ eventManager: eventManager.current }}>{children}</EventContext.Provider>;
};
