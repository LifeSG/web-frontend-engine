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
				},
			},
		},
	},
};

export default function ImageUploadDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
