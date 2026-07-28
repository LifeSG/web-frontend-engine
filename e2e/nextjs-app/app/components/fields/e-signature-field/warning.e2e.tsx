"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "e-signature-field",
					label: "Signature",
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
