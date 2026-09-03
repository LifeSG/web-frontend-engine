"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SECTION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			layoutType: "grid",
			children: {
				text1: {
					uiType: "text-field",
					label: "Text Field 1",
					columns: { xxs: 3 },
				},
				text2: {
					uiType: "text-field",
					label: "Text Field 2",
					columns: { xxs: 3 },
				},
				text3: {
					uiType: "text-field",
					label: "Text Field 3",
					columns: { xxs: 3 },
				},
				text4: {
					uiType: "text-field",
					label: "Text Field 4",
					columns: { xxs: 3 },
				},
			},
		},
	},
};

export default function SectionGridPage() {
	return <FrontendEngine data={SECTION_SCHEMA} />;
}
