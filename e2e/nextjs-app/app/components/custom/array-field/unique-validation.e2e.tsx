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
					validation: [{ unique: [{ field: "input", errorMessage: "This value must be unique" }] }],
				},
				submit: {
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export default function ArrayFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
