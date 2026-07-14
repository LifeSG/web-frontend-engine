"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				chips: {
					uiType: "chips",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
					textarea: { label: "Durian", rows: 1 },
				},
			},
		},
	},
};

export default function ChipsWithTextareaPage() {
	return <FrontendEngine data={SCHEMA} />;
}
