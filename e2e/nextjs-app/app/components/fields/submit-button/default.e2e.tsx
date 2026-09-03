"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SUBMIT_BUTTON_DEFAULT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				submit: {
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export default function SubmitButtonDefaultPage() {
	return <FrontendEngine data={SUBMIT_BUTTON_DEFAULT_SCHEMA} />;
}
