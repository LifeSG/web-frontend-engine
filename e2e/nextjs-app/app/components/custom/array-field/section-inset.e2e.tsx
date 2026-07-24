"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				wrapper: {
					uiType: "div",
					className: "story-column-container",
					children: {
						numericInset: {
							referenceKey: "array-field",
							sectionTitle: "Numeric",
							sectionInset: 16,
							fieldSchema: {
								input: {
									uiType: "text-field",
									label: "Input",
								},
							},
						},
						stringInset: {
							referenceKey: "array-field",
							sectionTitle: "String",
							sectionInset: "1.5rem",
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
		},
	},
	defaultValues: {
		numericInset: [{ input: "Apple" }, { input: "Berry" }],
		stringInset: [{ input: "Apple" }, { input: "Berry" }],
	},
};

export default function ArrayFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
