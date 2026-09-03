"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "image-upload",
					label: "Provide images",
					multiple: true,
					validation: [{ max: 2, errorMessage: "Maximum 2 photos allowed" }],
				},
			},
		},
	},
};

export default function ImageUploadMaxFilesPage() {
	return <FrontendEngine data={SCHEMA} />;
}
