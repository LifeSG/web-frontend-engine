"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TYPOGRAPHY_VARIANTS_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"heading-xxl": {
					uiType: "heading-xxl",
					children: "Text in heading-xxl",
				},
				"heading-xl": {
					uiType: "heading-xl",
					children: "Text in heading-xl",
				},
				"heading-lg": {
					uiType: "heading-lg",
					children: "Text in heading-lg",
				},
				"heading-md": {
					uiType: "heading-md",
					children: "Text in heading-md",
				},
				"heading-sm": {
					uiType: "heading-sm",
					children: "Text in heading-sm",
				},
				"heading-xs": {
					uiType: "heading-xs",
					children: "Text in heading-xs",
				},
				"body-bl": {
					uiType: "body-bl",
					children: "Text in body-bl",
				},
				"body-md": {
					uiType: "body-md",
					children: "Text in body-md",
				},
				"body-sm": {
					uiType: "body-sm",
					children: "Text in body-sm",
				},
				"body-xs": {
					uiType: "body-xs",
					children: "Text in body-xs",
				},
			},
		},
	},
};

export default function TypographyVariantsPage() {
	return <FrontendEngine data={TYPOGRAPHY_VARIANTS_SCHEMA} />;
}
