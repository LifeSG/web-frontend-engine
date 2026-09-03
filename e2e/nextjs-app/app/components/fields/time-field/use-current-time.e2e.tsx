"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "time-field",
					label: "Time",
					useCurrentTime: true,
				},
			},
		},
	},
};

export default function TimeFieldUseCurrentTimePage() {
	return <FrontendEngine data={SCHEMA} />;
}
