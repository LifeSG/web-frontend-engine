"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const DIVIDER_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				wrapper: {
					uiType: "div",
					className: "story-column-container",
					children: {
						divider: {
							uiType: "divider",
						},
						dividerDashed: {
							uiType: "divider",
							lineStyle: "dashed",
						},
						dividerThick: {
							uiType: "divider",
							thickness: 3,
						},
					},
				},
			},
		},
	},
};

export default function DividerDefaultPage() {
	return <FrontendEngine data={DIVIDER_SCHEMA} />;
}
