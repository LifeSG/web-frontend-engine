"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Radio Button",
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ label: "Option 1", value: "option1" },
						{ label: "Option 2", value: "option2" },
						{ label: "Option 3", value: "option3" },
					],
				},
			},
		},
	},
};

export default function RadioButtonTogglePage() {
	return <FrontendEngine data={SCHEMA} />;
}
