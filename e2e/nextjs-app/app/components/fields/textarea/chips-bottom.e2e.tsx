"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				textarea: {
					uiType: "textarea",
					label: "Textarea with chips",
					chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
					chipPosition: "bottom",
				},
			},
		},
	},
};

export default function TextareaChipsBottomPage() {
	return <FrontendEngine data={SCHEMA} />;
}
