"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				filter: {
					referenceKey: "filter",
					label: "Filters",
					toggleFilterButtonLabel: "Filters",
					children: {
						filterItem: {
							referenceKey: "filter-item",
							label: {
								mainLabel: "About",
								hint: { content: "A helpful tip about this filter." },
							},
							expanded: true,
							children: {
								content: {
									uiType: "body-md",
									children: "This is a filter item.",
								},
							},
						},
					},
				},
			},
		},
	},
};

export default function FilterWithTooltipPage() {
	return <FrontendEngine data={SCHEMA} />;
}
