"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TYPOGRAPHY_PARAGRAPH_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"text-paragraph-one": {
					uiType: "body-bl",
					children: "This is the first paragraph",
					paragraph: true,
				},
				"text-paragraph-two": {
					uiType: "body-bl",
					children: "This is the second paragraph",
					paragraph: true,
				},
				"text-paragraph-three": {
					uiType: "body-bl",
					children: "This is the third paragraph",
					paragraph: true,
				},
			},
		},
	},
};

export default function TypographyParagraphPage() {
	return <FrontendEngine data={TYPOGRAPHY_PARAGRAPH_SCHEMA} />;
}
