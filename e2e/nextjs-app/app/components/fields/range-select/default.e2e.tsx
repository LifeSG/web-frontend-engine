"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "range-select",
					label: "Range Select",
					options: {
						from: [
							{ label: "Option 1", value: "Option 1" },
							{ label: "Option 2", value: "Option 2" },
						],
						to: [
							{ label: "Option 1", value: "Option 1" },
							{ label: "Option 2", value: "Option 2" },
						],
					},
				},
			},
		},
	},
};

export default function RangeSelectDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
