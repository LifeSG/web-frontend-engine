"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "select",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "apple" },
						{ label: "Berry", value: "berry" },
						{ label: "Cherry", value: "cherry" },
					],
				},
			},
		},
	},
};

export default function SelectDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
