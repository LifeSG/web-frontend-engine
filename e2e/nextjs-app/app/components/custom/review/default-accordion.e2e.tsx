"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const REVIEW_ACCORDION_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				review: {
					referenceKey: "review",
					variant: "accordion",
					label: "Your personal information",
					items: [
						{
							label: "Name (as in NRIC or passport)",
							value: "Tom Tan Li Ho",
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
							label: "Spoken Language",
							value: "English, Mandarin, French",
							displayWidth: "half",
						},
						{
							label: "Residential Address",
							value: "Block 287, #05-11, Tampines street 22, Singapore 534788",
							displayWidth: "full",
						},
					],
				},
			},
		},
	},
};

export default function ReviewDefaultAccordionPage() {
	return <FrontendEngine data={REVIEW_ACCORDION_SCHEMA} />;
}
