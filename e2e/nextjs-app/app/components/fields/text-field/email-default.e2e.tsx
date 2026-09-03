"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "email-field",
					label: "Email",
				},
			},
		},
	},
};

export default function EmailFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
