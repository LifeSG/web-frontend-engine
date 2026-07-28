"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				default: {
					uiType: "text-field",
					label: "Default",
				},
				custom: {
					uiType: "text-field",
					label: "Custom",
					customOptions: {
						preventDragAndDrop: true,
					},
				},
			},
		},
	},
};

export default function TextFieldPage() {
	return (
		<div>
			<a data-testid="drag-source" href="https://example.com">
				Drag this text
			</a>
			<FrontendEngine data={SCHEMA} />
		</div>
	);
}
