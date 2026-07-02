"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const DIVIDER_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				divider: {
					uiType: "divider",
				},
			},
		},
	},
};

export default function DividerDefaultPage() {
	return <FrontendEngine data={DIVIDER_SCHEMA} />;
}
