import { PillProps } from "@lifesg/react-design-system/pill";
import { TimelineItemProps, TimelineProps } from "@lifesg/react-design-system/timeline";
import * as Icons from "@lifesg/react-icons";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";
import { ICustomElementJsonSchema } from "../types";
export interface ITimelineSchema<V = undefined, C = undefined> extends ICustomElementJsonSchema<"timeline">, Pick<TimelineProps, "className" | "data-base-indicator-testid" | "data-testid"> {
    items: ITimelineItemSchema<V, C>[];
    label: string;
}
interface ITimelineItemSchema<V = undefined, C = undefined> extends Omit<TimelineItemProps, "content" | "statuses" | "title"> {
    children: string | Record<string, TFrontendEngineFieldSchema<V, C>>;
    label: string;
    statuses?: [ITimelineStatusSchema] | [ITimelineStatusSchema, ITimelineStatusSchema] | undefined;
}
interface ITimelineStatusSchema extends Omit<PillProps, "content" | "icon"> {
    icon?: keyof typeof Icons | undefined;
    children: string;
}
export {};
