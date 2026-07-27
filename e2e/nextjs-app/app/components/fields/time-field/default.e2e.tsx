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
				},
			},
		},
	},
};

export default function TimeFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
