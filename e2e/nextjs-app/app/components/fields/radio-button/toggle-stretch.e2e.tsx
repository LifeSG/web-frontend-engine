"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Stretch to fill row",
					customOptions: {
						styleType: "toggle",
						stretch: true,
					},
					options: [
						{ label: "Option A", value: "a" },
						{ label: "Option B", value: "b" },
						{ label: "Option C", value: "c" },
						{ label: "Option D", value: "d" },
					],
				},
			},
		},
	},
};

export default function RadioButtonToggleStretchPage() {
	return <FrontendEngine data={SCHEMA} />;
}
