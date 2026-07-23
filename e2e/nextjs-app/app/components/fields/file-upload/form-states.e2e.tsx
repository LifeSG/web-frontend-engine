"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"default-field": {
					uiType: "file-upload",
					label: "Default",
					"data-testid": "file-upload-default",
					uploadOnAddingFile: {
						type: "base64",
						url: "/api/upload",
					},
				},
			},
		},
	},
};

export default function FileUploadFormStatesPage() {
	return <FrontendEngine data={SCHEMA} />;
}
