"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "file-upload",
					label: "Upload documents",
					"data-testid": "file-upload",
					uploadOnAddingFile: {
						type: "base64",
						url: "/api/upload",
					},
				},
			},
		},
	},
	defaultValues: {
		field: [
			{
				fileId: "pdf-1",
				fileName: "document.pdf",
				uploadResponse: {
					fileSize: 51200,
					mimeType: "application/pdf",
				},
			},
		],
	},
};

export default function FileUploadThumbnailPage() {
	return <FrontendEngine data={SCHEMA} />;
}
