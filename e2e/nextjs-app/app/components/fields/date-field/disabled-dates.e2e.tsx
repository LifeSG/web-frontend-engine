"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "date-field",
					label: "Date with disabled dates",
					allowDisabledSelection: true,
					validation: [
						{
							excludedDates: ["2026-04-07", "2026-04-09"],
						},
					],
				},
			},
		},
	},
};

export default function DateFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
