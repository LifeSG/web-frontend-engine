import { ReactElement } from "react";
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
export declare const EventContext: import("react").Context<IEventContext>;
export declare const EventProvider: ({ children }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
