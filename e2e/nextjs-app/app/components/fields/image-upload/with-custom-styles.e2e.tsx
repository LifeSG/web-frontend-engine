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
					imageReviewModalStyles: "padding-top: 50px; margin-right: 10px;",
				},
			},
		},
	},
};

export default function ImageUploadWithCustomStylesPage() {
	return <FrontendEngine data={SCHEMA} />;
}
