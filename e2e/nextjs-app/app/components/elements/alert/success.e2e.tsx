"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ALERT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				success: {
					uiType: "alert",
					type: "success",
					children: "This is a success message",
				},
			},
		},
	},
};

export default function AlertDefaultPage() {
	return <FrontendEngine data={ALERT_SCHEMA} />;
}
