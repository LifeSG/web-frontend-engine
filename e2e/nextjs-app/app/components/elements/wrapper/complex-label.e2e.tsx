"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const COMPLEX_LABEL_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field1: {
					uiType: "text-field",
					label: {
						mainLabel: "Full name",
						subLabel: "As shown on your NRIC or passport",
						hint: { content: "Please enter your full legal name" },
					},
				},
				field2: {
					uiType: "text-field",
					label: "Simple label field",
				},
			},
		},
	},
};

export default function WrapperComplexLabelPage() {
	return <FrontendEngine data={COMPLEX_LABEL_SCHEMA} />;
}
