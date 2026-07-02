"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SECTION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			layoutType: "contain",
			children: {
				text1: {
					uiType: "text-field",
					label: "Contained section text field",
				},
			},
		},
	},
};

export default function SectionContainedPage() {
	return <FrontendEngine data={SECTION_SCHEMA} />;
}
