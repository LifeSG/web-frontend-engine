"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Responsive columns (1 sm, 2 lg, 3 xl)",
					customOptions: {
						styleType: "toggle",
						layoutColumns: { sm: 1, lg: 2, xl: 3 },
					},
					options: [
						{ label: "Option A", value: "a" },
						{ label: "Option B", value: "b" },
						{ label: "Option C", value: "c" },
						{ label: "Option D", value: "d" },
						{ label: "Option E", value: "e" },
						{ label: "Option F", value: "f" },
					],
				},
			},
		},
	},
};

export default function RadioButtonToggleLayoutColumnsPage() {
	return <FrontendEngine data={SCHEMA} />;
}
