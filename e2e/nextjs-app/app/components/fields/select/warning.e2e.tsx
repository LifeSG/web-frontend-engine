"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SELECT_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "select",
					label: "Fruits",
					options: [
						{ label: "Apple", value: "apple" },
						{ label: "Berry", value: "berry" },
						{ label: "Cherry", value: "cherry" },
					],
				},
			},
		},
	},
};

export default createWarningPage({ schema: SELECT_WARNING_SCHEMA });
