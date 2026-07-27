"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "otp-verification-field",
					label: "Mobile Number Verification",
					type: "phone-number",
					request: { endpoint: { url: "/api/otp/send" } },
					verification: {
						endpoint: { url: "/api/otp/verify" },
					},
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
