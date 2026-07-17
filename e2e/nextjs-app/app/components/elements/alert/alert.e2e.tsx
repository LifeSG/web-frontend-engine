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
				error: {
					uiType: "alert",
					type: "error",
					children: "This is an error message",
				},
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
