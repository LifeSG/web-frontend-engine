"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "date-field",
					label: "Date",
				},
			},
		},
	},
};

export default function DateFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
