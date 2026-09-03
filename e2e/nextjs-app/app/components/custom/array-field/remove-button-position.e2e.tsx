"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				left: {
					referenceKey: "array-field",
					fieldSchema: {
						input: {
							uiType: "text-field",
							label: "Input",
						},
					},
					removeButton: { alignment: "left" },
				},
				bottom: {
					referenceKey: "array-field",
					fieldSchema: {
						input: {
							uiType: "text-field",
							label: "Input",
						},
					},
					removeButton: { position: "bottom" },
				},
				bottomLeft: {
					referenceKey: "array-field",
					fieldSchema: {
						input: {
							uiType: "text-field",
							label: "Input",
						},
					},
					removeButton: { position: "bottom", alignment: "left" },
				},
			},
		},
	},
};

export default function ArrayFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
