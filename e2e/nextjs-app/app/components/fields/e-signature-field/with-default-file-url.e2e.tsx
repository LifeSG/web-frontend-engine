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
	defaultValues: {
		field: {
			fileId: "signature-file-id",
			fileUrl: "/api/signature-image",
		},
	},
};

export default function ESignatureWithDefaultFileUrlPage() {
	return <FrontendEngine data={SCHEMA} />;
}
