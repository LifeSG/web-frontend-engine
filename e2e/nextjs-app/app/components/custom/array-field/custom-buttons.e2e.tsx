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
					addButton: { label: "Add entry", styleType: "primary", icon: "PencilIcon" },
					removeButton: { label: "Remove entry", styleType: "secondary", icon: "PencilIcon" },
				},
			},
		},
	},
};

export default function ArrayFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
