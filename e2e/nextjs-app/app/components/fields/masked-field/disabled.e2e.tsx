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
					disabled: true,
					placeholder: "Cannot type here",
					maskRange: [2, 5],
				},
			},
		},
	},
};

export default function MaskedFieldDisabledPage() {
	return <FrontendEngine data={SCHEMA} />;
}
