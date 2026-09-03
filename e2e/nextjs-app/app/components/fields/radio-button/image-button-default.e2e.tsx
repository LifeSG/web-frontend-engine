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
							imgSrc: "/image/177/95/160.png",
						},
						{
							label: "Option 2",
							value: "option2",
							imgSrc: "/image/85/115/5.png",
						},
						{
							label: "Option 3",
							value: "option3",
							imgSrc: "/image/44/23/208.png",
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
