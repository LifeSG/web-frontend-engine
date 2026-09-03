"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "range-select",
					label: "Range Select",
					options: {
						from: [
							{ label: "Option 1", value: "Option 1" },
							{ label: "Option 2", value: "Option 2" },
						],
						to: [
							{ label: "Option 1", value: "Option 1" },
							{ label: "Option 2", value: "Option 2" },
						],
					},
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
