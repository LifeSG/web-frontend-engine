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
					editImage: true,
					multiple: true,
				},
				"submit-button": {
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export default function ImageUploadEditImagePage() {
	return <FrontendEngine data={SCHEMA} />;
}
