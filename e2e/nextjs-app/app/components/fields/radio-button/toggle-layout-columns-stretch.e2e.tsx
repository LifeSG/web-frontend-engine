"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Responsive columns with stretch (1 mobile, 2 tablet, 3 desktop)",
					customOptions: {
						styleType: "toggle",
						layoutColumns: { mobile: 1, tablet: 2, desktop: 3 },
						stretch: true,
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

export default function RadioButtonToggleLayoutColumnsStretchPage() {
	return <FrontendEngine data={SCHEMA} />;
}
