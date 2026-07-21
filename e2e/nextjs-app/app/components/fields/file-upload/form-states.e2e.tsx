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
				"disabled-field": {
					uiType: "file-upload",
					label: "Disabled",
					disabled: true,
					"data-testid": "file-upload-disabled",
					uploadOnAddingFile: {
						type: "base64",
						url: "/api/upload",
					},
				},
				"readonly-field": {
					uiType: "file-upload",
					label: "Read only",
					readOnly: true,
					"data-testid": "file-upload-readonly",
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
