"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Fixed item width (200px each)",
					customOptions: {
						styleType: "toggle",
						minItemWidth: 200,
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

export default function RadioButtonToggleMinItemWidthPage() {
	return <FrontendEngine data={SCHEMA} />;
}
