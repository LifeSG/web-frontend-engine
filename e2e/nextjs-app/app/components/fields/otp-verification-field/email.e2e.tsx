"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "otp-verification-field",
					label: "Email Verification",
					type: "email",
					request: { endpoint: { url: "/api/otp/send" } },
					verification: {
						endpoint: { url: "/api/otp/verify" },
					},
				},
			},
		},
	},
};

export default function OtpEmailPage() {
	return <FrontendEngine data={SCHEMA} />;
}
