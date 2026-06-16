"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { IDividerSchema } from "@lifesg/web-frontend-engine/components/elements";

const DIVIDER_SCHEMA: IFrontendEngineData<undefined, IDividerSchema> = {
	sections: {
		section: {
			uiType: "section",
			children: {
				divider: {
					uiType: "divider",
				},
			},
		},
	},
};

export default function DividerDefaultPage() {
	return <FrontendEngine data={DIVIDER_SCHEMA} />;
}
