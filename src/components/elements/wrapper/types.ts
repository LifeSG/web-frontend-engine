import { IFilterCheckboxSchema } from "../../custom/filter/filter-checkbox/types";
import { IFilterItemSchema } from "../../custom/filter/filter-item/types";
import { TComponentOmitProps, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { TRenderRules } from "../../frontend-engine/yup";

type MobileCol = 1 | 2 | 3 | 4;
type MobileColRange = MobileCol | 5;
type TabletCol = MobileCol | 5 | 6 | 7 | 8;
type TabletColRange = TabletCol | 9;
type DesktopCol = TabletCol | 9 | 10 | 11 | 12;
type DesktopColRange = DesktopCol | 13;
export interface ColDivProps extends React.HTMLAttributes<HTMLDivElement> {
	"data-testid"?: string | undefined;
	/**
	 * Specifies the number of columns to be span across in mobile viewports.
	 * If an array is specified, the format is as such [startCol, endCol].
	 * If `tabletCols` or `desktopCols` are not specified, this
	 * setting will be applied to tablet and desktop viewports.
	 *
	 * If all column props are not specified, the div will span across a single
	 * column.
	 */
	mobile?: MobileCol | [MobileColRange, MobileColRange] | undefined;
	/**
	 * Specifies the number of columns to be span across in tablet viewports.
	 * If an array is specified, the format is as such [startCol, endCol].
	 * If `desktopCols` are not specified, this setting will be
	 * applied to desktop viewports as well.
	 *
	 * If all column props are not specified, the div will span across a single
	 * column.
	 */
	tablet?: TabletCol | [TabletColRange, TabletColRange] | undefined;
	/**
	 * Specifies the number of columns to be span across in desktop viewports.
	 * If an array is specified, the format is as such [startCol, endCol].
	 *
	 * If all column props are not specified, the div will span across a single
	 * column.
	 */
	desktop?: DesktopCol | [DesktopColRange, DesktopColRange] | undefined;
}

export type TWrapperType = "div" | "span" | "header" | "footer" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface IWrapperSchema extends TComponentOmitProps<React.HTMLAttributes<HTMLElement>, "children"> {
	uiType: TWrapperType;
	showIf?: TRenderRules[] | undefined;
	children: Record<string, TFrontendEngineFieldSchema> | string;
	columns?: ColDivProps;
}

export interface IWrapperProps {
	id?: string | undefined;
	schema?: IWrapperSchema | undefined;
	/** only used internally by FrontendEngine */
	children?:
		| Record<string, TFrontendEngineFieldSchema>
		| Record<string, IFilterItemSchema | IFilterCheckboxSchema>
		| undefined;
	warnings?: Record<string, string> | undefined;
}
