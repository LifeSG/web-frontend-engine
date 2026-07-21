"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TYPOGRAPHY_WEIGHTS_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				default: {
					uiType: "body-bl",
					children: "Text with default weight",
				},
				bold: {
					uiType: "body-bl",
					children: "Text with bold weight",
					weight: "bold",
				},
				semibold: {
					uiType: "body-bl",
					children: "Text with semibold weight",
					weight: "semibold",
				},
				light: {
					uiType: "body-bl",
					children: "Text with light weight",
					weight: "light",
				},
			},
		},
	},
};

export default function TypographyWeightsPage() {
	return <FrontendEngine data={TYPOGRAPHY_WEIGHTS_SCHEMA} />;
}
