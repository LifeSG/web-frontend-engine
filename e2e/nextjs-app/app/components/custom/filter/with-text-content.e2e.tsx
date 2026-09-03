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
							label: "About",
							expanded: true,
							children: {
								content: {
									uiType: "body-md",
									children: "This is a filter item with plain text content.",
								},
							},
						},
					},
				},
			},
		},
	},
};

export default function FilterWithTextContentPage() {
	return <FrontendEngine data={SCHEMA} />;
}
