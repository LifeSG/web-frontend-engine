"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "checkbox",
					label: "Fruits",
					customOptions: {
						styleType: "toggle",
						layoutType: "vertical",
					},
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
				},
			},
		},
	},
};

export default function CheckboxPage() {
	return <FrontendEngine data={SCHEMA} />;
}
