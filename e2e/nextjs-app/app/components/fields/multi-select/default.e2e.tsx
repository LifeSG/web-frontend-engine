"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "multi-select",
					label: "Multi-Select",
					options: [
						{ label: "Option 1", value: "Option 1" },
						{ label: "Option 2", value: "Option 2" },
						{ label: "Option 3", value: "Option 3" },
					],
				},
			},
		},
	},
};

export default function MultiSelectDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
