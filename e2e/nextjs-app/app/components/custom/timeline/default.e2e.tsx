"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TIMELINE_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				timeline: {
					referenceKey: "timeline",
					label: "What's next",
					items: [
						{
							label: "Item 1",
							children: "Content for Item 1",
						},
						{
							label: "Item 2",
							children: "Content for Item 2",
						},
						{
							label: "Item 3",
							children: {
								alert: {
									children: "Content for Item 3",
									type: "info",
									uiType: "alert",
								},
							},
						},
						{
							label: "Item 4",
							children: "Content for Item 4 (error variant)",
							variant: "error",
						},
					],
				},
			},
		},
	},
};

export default function TimelineDefaultPage() {
	return <FrontendEngine data={TIMELINE_SCHEMA} />;
}
