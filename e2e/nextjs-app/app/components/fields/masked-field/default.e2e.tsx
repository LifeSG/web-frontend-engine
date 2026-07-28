"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				maskedField: {
					uiType: "masked-field",
					label: "Masked field",
					maskRange: [2, 5],
				},
			},
		},
	},
};

export default function MaskedFieldDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
