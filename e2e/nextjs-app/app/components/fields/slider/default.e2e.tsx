"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "slider",
					label: "Number of fruits",
				},
			},
		},
	},
};

export default function SliderPage() {
	return <FrontendEngine data={SCHEMA} />;
}
