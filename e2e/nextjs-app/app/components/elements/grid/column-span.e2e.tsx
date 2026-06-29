"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { IGridSchema } from "@lifesg/web-frontend-engine/components/elements";

const GRID_SCHEMA: IFrontendEngineData<undefined, IGridSchema> = {
	sections: {
		section: {
			uiType: "section",
			children: {
				grid: {
					uiType: "grid",
					children: {
						block1: {
							uiType: "text-field",
							label: "Block 1",
							columns: { xl: 4 },
						},
					},
				},
			},
		},
	},
};

export default function GridColumnSpanPage() {
	return <FrontendEngine data={GRID_SCHEMA} />;
}
