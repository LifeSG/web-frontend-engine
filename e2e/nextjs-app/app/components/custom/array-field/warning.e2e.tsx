"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					referenceKey: "array-field",
					sectionTitle: "Entry",
					fieldSchema: {
						input: {
							uiType: "text-field",
							label: "Input",
						},
					},
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
