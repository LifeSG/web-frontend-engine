"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TYPOGRAPHY_INLINE_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"text-start": {
					uiType: "body-bl",
					children: "This is ",
					inline: true,
				},
				"text-body": {
					uiType: "body-bl",
					children: "an inline ",
					inline: true,
				},
				"text-end": {
					uiType: "body-bl",
					children: "text",
					inline: true,
				},
			},
		},
	},
};

export default function TypographyInlinePage() {
	return <FrontendEngine data={TYPOGRAPHY_INLINE_SCHEMA} />;
}
