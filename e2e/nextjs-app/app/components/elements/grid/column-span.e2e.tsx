"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const GRID_SCHEMA: IFrontendEngineData = {
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
							columns: { xl: 2 },
						},
						block3: {
							uiType: "text-field",
							label: "Block 3",
							columns: { xl: 3 },
						},
						block4: {
							uiType: "text-field",
							label: "Block 4",
							columns: { xl: 8 },
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
