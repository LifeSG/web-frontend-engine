"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const MULTI_SELECT_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "multi-select",
					label: "Multi-Select",
					options: [
						{ label: "Option 1", value: "Option 1" },
						{ label: "Option 2", value: "Option 2" },
						{ label: "Option 3", value: "Option 3" },
					],
				},
			},
		},
	},
};

export default createWarningPage({ schema: MULTI_SELECT_WARNING_SCHEMA });
