"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const COLUMN_LAYOUT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			layoutType: "grid",
			children: {
				field1: {
					uiType: "text-field",
					label: "First name",
					columns: { xxs: 8, sm: 12, xl: 6 },
				},
				field2: {
					uiType: "text-field",
					label: "Last name",
					columns: { xxs: 8, sm: 12, xl: 6 },
				},
				field3: {
					uiType: "text-field",
					label: "Full width field",
					columns: { xxs: 8, sm: 12, xl: 12 },
				},
			},
		},
	},
};

export default function WrapperColumnLayoutPage() {
	return <FrontendEngine data={COLUMN_LAYOUT_SCHEMA} />;
}
