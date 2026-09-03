"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "histogram-slider",
					label: "Price of fruits",
					bins: [
						{ minValue: 0, count: 0 },
						{ minValue: 10, count: 2 },
						{ minValue: 20, count: 3 },
						{ minValue: 90, count: 8 },
					],
					interval: 10,
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
