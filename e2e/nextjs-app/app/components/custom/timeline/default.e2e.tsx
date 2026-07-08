"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { ITimelineSchema } from "@lifesg/web-frontend-engine/components/custom";

const TIMELINE_SCHEMA: IFrontendEngineData<undefined, ITimelineSchema> = {
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
