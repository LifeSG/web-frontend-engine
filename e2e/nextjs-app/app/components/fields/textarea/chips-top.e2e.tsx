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
				},
			},
		},
	},
};

export default function TextareaChipsTopPage() {
	return <FrontendEngine data={SCHEMA} />;
}
