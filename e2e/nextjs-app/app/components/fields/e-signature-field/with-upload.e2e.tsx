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
					upload: {
						type: "base64",
						url: "/api/upload",
					},
				},
			},
		},
	},
};

export default function ESignatureWithUploadPage() {
	return <FrontendEngine data={SCHEMA} />;
}
