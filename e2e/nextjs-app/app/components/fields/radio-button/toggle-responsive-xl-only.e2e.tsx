"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		withStretch: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Columns and min width only at xl (3 columns, 200px min, stretch)",
					customOptions: {
						styleType: "toggle",
						stretch: true,
						layoutColumns: { xl: 3 },
						minItemWidth: { xl: 200 },
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
		withoutStretch: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Columns and min width only at xl (3 columns, 200px min)",
					customOptions: {
						styleType: "toggle",
						stretch: false,
						layoutColumns: { xl: 3 },
						minItemWidth: { xl: 200 },
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

export default function RadioButtonToggleLayoutColumnsXlOnlyPage() {
	return <FrontendEngine data={SCHEMA} />;
}
