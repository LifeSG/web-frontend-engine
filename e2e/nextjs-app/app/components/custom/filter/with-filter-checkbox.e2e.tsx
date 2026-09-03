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
						filterCheckbox: {
							referenceKey: "filter-checkbox",
							label: "Colours",
							expanded: true,
							options: [
								{ label: "Red", value: "red" },
								{ label: "Blue", value: "blue" },
								{ label: "Green", value: "green" },
							],
						},
					},
				},
			},
		},
	},
};

export default function FilterWithCheckboxPage() {
	return <FrontendEngine data={SCHEMA} />;
}
