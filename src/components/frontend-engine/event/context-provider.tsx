import { ReactElement, createContext, useEffect, useState } from "react";

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
	const [eventManager, setEventManager] = useState<Element>();

	useEffect(() => {
		setEventManager(document.createElement("div"));
	}, []);

	return <EventContext.Provider value={{ eventManager }}>{children}</EventContext.Provider>;
};
