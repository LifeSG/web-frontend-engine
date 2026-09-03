"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Responsive min item width (120px sm, 160px md, 200px xl)",
					customOptions: {
						styleType: "toggle",
						minItemWidth: { sm: 120, md: 160, xl: 200 },
					},
					options: [
						{ label: "Option A", value: "a" },
						{ label: "Option B", value: "b" },
						{
							label: "Option C with a much longer label that should grow beyond the minimum width",
							value: "c",
						},
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
