"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "date-range-field",
					variant: "range",
					label: "Date",
				},
			},
		},
	},
};

export default function DateRangeFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
