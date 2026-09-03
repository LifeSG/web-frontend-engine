"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const TEXTAREA_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "textarea",
					label: "Textarea",
				},
			},
		},
	},
};

export default createWarningPage({ schema: TEXTAREA_WARNING_SCHEMA });
