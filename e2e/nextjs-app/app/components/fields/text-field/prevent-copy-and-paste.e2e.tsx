"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				default: {
					uiType: "text-field",
					label: "Default",
				},
				custom: {
					uiType: "text-field",
					label: "Custom",
					customOptions: {
						preventCopyAndPaste: true,
					},
				},
			},
		},
	},
};

export default function TextFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
