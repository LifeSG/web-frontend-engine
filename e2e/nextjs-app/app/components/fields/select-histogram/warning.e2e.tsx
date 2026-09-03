"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "select-histogram",
					label: "Price of fruits",
					histogramSlider: {
						bins: [
							{ minValue: 0, count: 0 },
							{ minValue: 10, count: 35 },
							{ minValue: 20, count: 15 },
							{ minValue: 50, count: 20 },
							{ minValue: 70, count: 40 },
							{ minValue: 90, count: 50 },
						],
						interval: 10,
					},
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
