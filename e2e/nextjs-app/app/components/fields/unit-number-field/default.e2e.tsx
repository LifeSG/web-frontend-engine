"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "unit-number-field",
					label: "Unit Number",
				},
			},
		},
	},
};

export default function UnitNumberFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
