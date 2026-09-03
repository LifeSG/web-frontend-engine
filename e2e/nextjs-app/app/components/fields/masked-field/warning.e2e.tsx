"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "masked-field",
					label: "Masked field",
					maskRange: [2, 5],
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
