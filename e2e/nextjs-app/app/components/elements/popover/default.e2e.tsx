"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const DEFAULT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"popover-default": {
					uiType: "popover",
					children: "More info",
					hint: { content: "Sample hint" },
				},
			},
		},
	},
};

export default function PopoverVariantsPage() {
	return <FrontendEngine data={DEFAULT_SCHEMA} />;
}
