"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const RESET_BUTTON_DEFAULT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				reset: {
					uiType: "reset",
					label: "Reset",
				},
			},
		},
	},
};

export default function ResetButtonDefaultPage() {
	return <FrontendEngine data={RESET_BUTTON_DEFAULT_SCHEMA} />;
}
