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
						styleType: "image-button",
					},
					options: [
						{
							label: "Option 1",
							value: "option1",
							imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
						},
						{
							label: "Option 2",
							value: "option2",
							imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png",
						},
						{
							label: "Option 3",
							value: "option3",
							imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png",
						},
					],
				},
			},
		},
	},
};

export default function RadioButtonImageButtonPage() {
	return <FrontendEngine data={SCHEMA} />;
}
