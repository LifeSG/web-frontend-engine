"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { ISectionSchema } from "@lifesg/web-frontend-engine/components/elements/section/types";

const SECTION_SCHEMA: IFrontendEngineData<undefined, ISectionSchema> = {
	sections: {
		section: {
			uiType: "section",
			layoutType: "contain",
			children: {
				text1: {
					uiType: "text-field",
					label: "Contained section text field",
				},
			},
		},
	},
};

export default function SectionContainedPage() {
	return <FrontendEngine data={SECTION_SCHEMA} />;
}
