"use client";

import { createWarningPage } from "@/app/components/common";
import { IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TEXT_FIELD_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "text-field",
					label: "Primary text field",
					placeholder: "Type in primary",
				},
				secondary: {
					uiType: "text-field",
					label: "Secondary text field",
					placeholder: "Type in secondary",
				},
			},
		},
	},
};

export default createWarningPage({ schema: TEXT_FIELD_WARNING_SCHEMA });
