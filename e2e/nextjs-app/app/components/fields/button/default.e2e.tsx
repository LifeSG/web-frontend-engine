"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const BUTTON_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				button: {
					uiType: "button",
					label: "Default",
				},
			},
		},
	},
};

export default function ButtonDefaultPage() {
	return <FrontendEngine data={BUTTON_SCHEMA} />;
}
