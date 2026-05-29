import { Layout } from "@lifesg/react-design-system/layout";
import React from "react";
import { TestHelper } from "../../../utils";
import { IV3Columns, TFrontendEngineFieldSchema } from "../../frontend-engine";

interface IProps {
	id: string;
	children: React.ReactNode;
	childSchema: TFrontendEngineFieldSchema;
}

/**
 * render as col when using grid layout
 */
export const ColWrapper = ({ id, children, childSchema }: IProps) => {
	if ("columns" in childSchema && childSchema.columns) {
		const { xxs, xs, sm, md, lg, xl, xxl, ...rest } = (childSchema.columns as IV3Columns) || {};
		return (
			<Layout.ColDiv
				data-testid={TestHelper.generateId(id, "grid_item")}
				xlCols={xl}
				lgCols={lg}
				mdCols={md}
				smCols={sm}
				xsCols={xs}
				xxlCols={xxl}
				xxsCols={xxs}
				{...rest}
			>
				{children}
			</Layout.ColDiv>
		);
	}
	return <>{children}</>;
};
