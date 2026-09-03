"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "text-field",
					label: "Textfield",
					customOptions: {
						textTransform: "uppercase",
					},
				},
			},
		},
	},
};

export default function TextFieldPage() {
	return <FrontendEngine data={SCHEMA} />;
}
