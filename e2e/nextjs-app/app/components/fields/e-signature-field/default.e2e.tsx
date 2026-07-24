"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "e-signature-field",
					label: "Signature",
				},
			},
		},
	},
};

export default function ESignatureDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
