import { ColProps, Layout } from "@lifesg/react-design-system/layout";
import React from "react";
import { TestHelper } from "../../../utils";
import { IColumns, TFrontendEngineFieldSchema } from "../../frontend-engine";
import { V2_Layout } from "@lifesg/react-design-system";

interface IProps {
	id: string;
	children: React.ReactNode;
	childSchema: TFrontendEngineFieldSchema;
}
const isV3ColType = (colums: IColumns | ColProps, colType: "v2" | "v3" | undefined): colums is ColProps =>
	colType === "v3";
/**
 * render as col when using grid layout
 */
export const ColWrapper = ({ id, children, childSchema }: IProps) => {
	if ("columns" in childSchema) {
		if ("colType" in childSchema && isV3ColType(childSchema.columns, childSchema.colType)) {
			return (
				<Layout.ColDiv data-testid={TestHelper.generateId(id, "grid_item")} {...childSchema.columns}>
					{children}
				</Layout.ColDiv>
			);
		}
		const { desktop, tablet, mobile, ...rest } = (childSchema.columns as IColumns) || {};
		return (
			<V2_Layout.ColDiv
				data-testid={TestHelper.generateId(id, "grid_item")}
				desktopCols={desktop ?? 12}
				tabletCols={tablet}
				mobileCols={mobile}
				{...rest}
			>
				{children}
			</V2_Layout.ColDiv>
		);
	}
	return <>{children}</>;
};
