"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TYPOGRAPHY_VIEW_MORE_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"long-text": {
					uiType: "body-bl",
					children: ["This", "is", "a", "long", "text"],
					maxLines: 3,
				},
			},
		},
	},
};

export default function TypographyViewMorePage() {
	return <FrontendEngine data={TYPOGRAPHY_VIEW_MORE_SCHEMA} />;
}
