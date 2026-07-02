"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SECTION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				text: {
					uiType: "text-field",
					label: "Text Field 1",
				},
				text2: {
					uiType: "text-field",
					label: "Text Field 2",
				},
			},
		},
	},
};

export default function SectionDefaultPage() {
	return <FrontendEngine data={SECTION_SCHEMA} />;
}
