import { DividerProps } from "@lifesg/react-design-system/divider";
import { TComponentOmitProps } from "../../frontend-engine";
import { IBaseElementSchema } from "../types";
export interface IDividerSchema extends IBaseElementSchema<"divider">, TComponentOmitProps<DividerProps, "layoutType" | "desktopCols" | "tabletCols" | "mobileCols"> {
    verticalMargin?: number | undefined;
}
