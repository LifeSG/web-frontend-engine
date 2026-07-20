"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					referenceKey: "array-field",
					sectionTitle: "Entry",
					showDivider: false,
					fieldSchema: {
						input: {
							uiType: "text-field",
							label: "Input",
						},
					},
				},
			},
		},
	},
	defaultValues: {
		field: [{ input: "Apple" }, { input: "Berry" }, { input: "Cherry" }],
	},
};

export default function ArrayFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
