"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "contact-field",
					label: "Contact Number",
					validation: [
						{
							contactNumber: {
								singaporeNumber: "default",
							},
						},
					],
				},
				submit: {
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export default function ContactFieldSingaporeNumberPage() {
	return <FrontendEngine data={SCHEMA} />;
}
