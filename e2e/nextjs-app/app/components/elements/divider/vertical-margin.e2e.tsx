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
							verticalMargin: 2,
						},
						dividerThick: {
							uiType: "divider",
							verticalMargin: 3,
						},
					},
				},
			},
		},
	},
};

export default function DividerVerticalMarginPage() {
	return <FrontendEngine data={DIVIDER_SCHEMA} />;
}
