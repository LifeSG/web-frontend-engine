"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { IButtonSchema } from "@lifesg/web-frontend-engine/components/fields";

const BUTTON_SCHEMA: IFrontendEngineData<undefined, IButtonSchema> = {
	sections: {
		section: {
			uiType: "section",
			children: {
				button: {
					uiType: "button",
					label: "Default",
				},
			},
		},
	},
};

export default function ButtonDefaultPage() {
	return <FrontendEngine data={BUTTON_SCHEMA} />;
}
