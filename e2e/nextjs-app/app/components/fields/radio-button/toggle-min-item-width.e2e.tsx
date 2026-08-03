"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Responsive min item width (120px mobile, 160px tablet, 200px desktop)",
					customOptions: {
						styleType: "toggle",
						minItemWidth: { mobile: 120, tablet: 160, desktop: 200 },
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
