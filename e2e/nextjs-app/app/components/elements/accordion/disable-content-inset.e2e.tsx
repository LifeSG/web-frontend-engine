"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ACCORDION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				withoutInset: {
					uiType: "accordion",
					title: "Without Content Inset",
					button: false,
					collapsible: false,
					disableContentInset: true,
					children: {
						field1: {
							uiType: "text-field",
							label: "Field 1",
						},
						field2: {
							uiType: "text-field",
							label: "Field 2",
						},
					},
				},
			},
		},
	},
};

export default function AccordionDisableContentInsetPage() {
	return <FrontendEngine data={ACCORDION_SCHEMA} />;
}
