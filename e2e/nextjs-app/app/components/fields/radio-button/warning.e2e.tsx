"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const RADIO_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "radio",
					label: "Radio Button",
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

export default createWarningPage({ schema: RADIO_WARNING_SCHEMA });
