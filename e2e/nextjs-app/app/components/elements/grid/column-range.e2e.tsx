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
							columns: { xl: [4, 8] },
						},
						block2: {
							uiType: "text-field",
							label: "Block 2",
							columns: { xl: [2, 5] },
						},
						block3: {
							uiType: "text-field",
							label: "Block 3",
							columns: { xl: [6, 8] },
						},
						block4: {
							uiType: "text-field",
							label: "Block 4",
							columns: { xl: [1, 12] },
						},
					},
				},
			},
		},
	},
};

export default function GridColumnRangePage() {
	return <FrontendEngine data={GRID_SCHEMA} />;
}
