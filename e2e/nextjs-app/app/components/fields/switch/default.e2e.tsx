"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "switch",
					label: "Switch",
				},
			},
		},
	},
};

export default function SwitchPage() {
	return <FrontendEngine data={SCHEMA} />;
}
