"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ACCORDION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				accordion: {
					uiType: "accordion",
					title: "Editable Section",
					button: true,
					collapsible: false,
					children: {
						name: {
							uiType: "text-field",
							label: "Name",
						},
						email: {
							uiType: "text-field",
							label: "Email",
						},
					},
				},
			},
		},
	},
};

export default function AccordionButtonPage() {
	return <FrontendEngine data={ACCORDION_SCHEMA} />;
}
