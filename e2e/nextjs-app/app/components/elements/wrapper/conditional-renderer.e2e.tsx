"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const CONDITIONAL_RENDERER_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				triggerField: {
					uiType: "text-field",
					label: "Trigger field",
					placeholder: "Type show to reveal more fields",
				},
				shownField: {
					uiType: "text-field",
					label: "Shown field",
					showIf: [{ triggerField: [{ filled: true }] }],
				},
				nestedShownField: {
					uiType: "text-field",
					label: "Nested shown field",
					showIf: [{ shownField: [{ shown: true }] }],
				},
			},
		},
	},
};

export default function WrapperConditionalRendererPage() {
	return <FrontendEngine data={CONDITIONAL_RENDERER_SCHEMA} />;
}
