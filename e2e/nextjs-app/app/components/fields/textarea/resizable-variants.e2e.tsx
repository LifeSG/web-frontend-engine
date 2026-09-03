"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				fixedTextarea: {
					uiType: "textarea",
					label: "Fixed textarea",
					rows: 2,
				},
				resizableTextarea: {
					uiType: "textarea",
					label: "Resizable textarea",
					rows: 5,
					resizable: true,
				},
			},
		},
	},
};

export default function TextareaResizableVariantsPage() {
	return <FrontendEngine data={SCHEMA} />;
}
