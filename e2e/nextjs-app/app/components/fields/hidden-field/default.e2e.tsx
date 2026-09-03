"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const HIDDEN_FIELD_DEFAULT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				"hidden-field": {
					uiType: "hidden-field",
				},
				submit: {
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export default function HiddenFieldDefaultPage() {
	return <FrontendEngine data={HIDDEN_FIELD_DEFAULT_SCHEMA} />;
}
