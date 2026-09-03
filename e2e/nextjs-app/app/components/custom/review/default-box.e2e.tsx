"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const REVIEW_BOX_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				review: {
					referenceKey: "review",
					variant: "box",
					label: "Your personal information",
					description: "Retrieved on 27 Jun 2023",
					items: [
						{
							label: "Name (as in NRIC or passport)",
							value: "Tom Tan Li Ho",
							displayWidth: "half",
						},
						{
							label: "NRIC or FIN",
							value: "S••••534J",
							displayWidth: "half",
						},
						{
							label: "Date of birth",
							value: "6 November 1992",
							displayWidth: "half",
						},
						{
							label: "Ethnicity",
							value: "Chinese",
							displayWidth: "half",
						},
						{
							label: "Residential Address",
							value: "Block 287, #05-11, Tampines street 22, Singapore 534788",
						},
					],
				},
			},
		},
	},
};

export default function ReviewDefaultBoxPage() {
	return <FrontendEngine data={REVIEW_BOX_SCHEMA} />;
}
