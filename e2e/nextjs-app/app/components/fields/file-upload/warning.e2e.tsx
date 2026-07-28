"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "file-upload",
					label: "Upload documents",
					"data-testid": "file-upload",
					uploadOnAddingFile: {
						type: "base64",
						url: "/api/upload",
					},
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
