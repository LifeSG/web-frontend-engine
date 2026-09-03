"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "contact-field",
					label: "Contact Number",
				},
			},
		},
	},
};

export default function ContactFieldDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
