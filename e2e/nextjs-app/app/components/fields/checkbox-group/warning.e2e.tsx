"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const CHECKBOX_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "checkbox",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
				},
				secondary: {
					uiType: "checkbox",
					label: "Vegetables",
					options: [{ label: "Carrot", value: "Carrot" }],
				},
			},
		},
	},
};

export default createWarningPage({ schema: CHECKBOX_WARNING_SCHEMA });
