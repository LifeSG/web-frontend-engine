"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ALERT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				warning: {
					uiType: "alert",
					type: "warning",
					children: "This is a warning message",
				},
			},
		},
	},
};

export default function AlertDefaultPage() {
	return <FrontendEngine data={ALERT_SCHEMA} />;
}
