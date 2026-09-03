"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Radio Button",
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ value: "option1", label: "Lorem ipsum dolor sit amet" },
						{ value: "option2", label: "Consectetur adipiscing elit" },
						{ value: "option3", label: "Vivamus urna nisl" },
						{
							value: "option4",
							label: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
						},
						{ value: "option5", label: "Ut enim ad minim veniam" },
					],
				},
			},
		},
	},
};

export default function RadioButtonToggleOverflowPage() {
	return <FrontendEngine data={SCHEMA} />;
}
