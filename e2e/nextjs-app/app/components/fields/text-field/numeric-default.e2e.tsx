"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "numeric-field",
					label: "Number",
				},
			},
		},
	},
};

export default function NumericFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
