"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ALERT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				error: {
					uiType: "alert",
					type: "error",
					children: "This is an error message",
				},
			},
		},
	},
};

export default function AlertDefaultPage() {
	return <FrontendEngine data={ALERT_SCHEMA} />;
}
