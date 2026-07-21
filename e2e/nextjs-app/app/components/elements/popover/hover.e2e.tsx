"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const HOVER_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"popover-hover": {
					uiType: "popover",
					children: "More info",
					trigger: "hover",
					hint: { content: "Sample hint" },
				},
			},
		},
	},
};

export default function PopoverHoverPage() {
	return <FrontendEngine data={HOVER_SCHEMA} />;
}
