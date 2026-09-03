"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const FILTER_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"wrapper-default": {
					referenceKey: "filter",
					label: "Filters Desktop",
					toggleFilterButtonLabel: "Filters Mobile",
					children: {
						filterItem1: {
							referenceKey: "filter-item",
							label: "Search",
							expanded: true,
							children: {
								name: {
									uiType: "text-field",
									label: "",
									placeholder: "Enter keyword",
								},
							},
						},
					},
				},
			},
		},
	},
};

export default function FilterDefaultPage() {
	return <FrontendEngine data={FILTER_SCHEMA} />;
}
