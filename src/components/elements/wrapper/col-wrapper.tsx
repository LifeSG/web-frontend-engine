import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import React from "react";
import { TestHelper } from "../../../utils";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";

interface IProps {
	id: string;
	children: React.ReactNode;
	childSchema: TFrontendEngineFieldSchema;
}
/**
 * render as col when using grid layout
 */
export const ColWrapper = ({ id, children, childSchema }: IProps) => {
	if ("columns" in childSchema) {
		const { desktop, tablet, mobile, ...rest } = childSchema.columns || {};
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
