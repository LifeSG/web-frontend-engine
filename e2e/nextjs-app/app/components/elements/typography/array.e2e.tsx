"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TYPOGRAPHY_ARRAY_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"text-array": {
					uiType: "body-bl",
					children: ["This", "is", "an", "array", "of", "text"],
				},
			},
		},
	},
};

export default function TypographyArrayOfTextPage() {
	return <FrontendEngine data={TYPOGRAPHY_ARRAY_SCHEMA} />;
}
