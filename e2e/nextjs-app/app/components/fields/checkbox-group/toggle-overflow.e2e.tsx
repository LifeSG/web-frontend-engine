"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "checkbox",
					label: "Fruits",
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ value: "Apple", label: "Lorem ipsum dolor sit amet" },
						{ value: "Berry", label: "Consectetur adipiscing elit" },
						{ value: "Cherry", label: "Vivamus urna nisl" },
						{ value: "Durian", label: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" },
						{ value: "Elderberry", label: "Ut enim ad minim veniam" },
					],
				},
			},
		},
	},
};

export default function CheckboxPage() {
	return <FrontendEngine data={SCHEMA} />;
}
