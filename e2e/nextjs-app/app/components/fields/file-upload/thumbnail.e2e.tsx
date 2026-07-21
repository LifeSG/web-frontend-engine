"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

// 8x8 pixel PNG
const SAMPLE_IMG_DATAURL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=";

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
				fileId: "image-1",
				fileName: "image.png",
				dataURL: SAMPLE_IMG_DATAURL,
			},
		],
	},
};

export default function FileUploadThumbnailPage() {
	return <FrontendEngine data={SCHEMA} />;
}
