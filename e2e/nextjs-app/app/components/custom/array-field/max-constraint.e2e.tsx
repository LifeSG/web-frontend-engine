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
					fieldSchema: {
						input: {
							uiType: "text-field",
							label: "Input",
						},
					},
					validation: [{ max: 2 }],
				},
			},
		},
	},
	defaultValues: {
		field: [{ input: "Apple" }, { input: "Berry" }],
	},
};

export default function ArrayFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
