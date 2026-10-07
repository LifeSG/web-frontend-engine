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
					// background is a disallowed declaration and should be stripped, padding/margin are layout and should apply
					imageReviewModalStyles: "background: red;padding-top: 50px; margin-right: 10px;",
				},
			},
		},
	},
};

export default function ImageUploadWithCustomStylesPage() {
	return <FrontendEngine data={SCHEMA} />;
}
