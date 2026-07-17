"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ACCORDION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				accordion: {
					uiType: "accordion",
					title: "Title",
					button: false,
					collapsible: true,
					expanded: true,
					children: {
						field1: {
							uiType: "text-field",
							label: "Label 1",
							validation: [{ required: true }],
						},
						field2: {
							uiType: "text-field",
							label: "Label 2",
							validation: [{ required: true }],
						},
					},
				},
			},
		},
	},
};

export default function AccordionDefaultPage() {
	return <FrontendEngine data={ACCORDION_SCHEMA} />;
}
