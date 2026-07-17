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
				dividerDashed: {
					uiType: "divider",
					lineStyle: "dashed",
					verticalMargin: 2,
				},
				dividerThick: {
					uiType: "divider",
					thickness: 3,
					verticalMargin: 2,
				},
			},
		},
	},
};

export default function DividerDefaultPage() {
	return <FrontendEngine data={DIVIDER_SCHEMA} />;
}
