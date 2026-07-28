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
					defaultCountry: "Japan",
					validation: [
						{
							contactNumber: {
								internationalNumber: true,
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

export default function ContactFieldInternationalNumberPage() {
	return <FrontendEngine data={SCHEMA} />;
}
