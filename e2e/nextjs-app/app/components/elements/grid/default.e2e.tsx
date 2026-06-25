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
						block2: {
							uiType: "text-field",
							label: "Block 2",
							columns: { xl: 8 },
						},
						block3: {
							uiType: "text-field",
							label: "Block 3",
							columns: { xl: 7 },
						},
						block4: {
							uiType: "text-field",
							label: "Block 4",
							columns: { xl: 5 },
						},
					},
				},
			},
		},
	},
};

export default function GridDefaultPage() {
	return <FrontendEngine data={GRID_SCHEMA} />;
}
