"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const TAB_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				tab: {
					uiType: "tab",
					children: {
						tabItem1: {
							title: "Section A",
							uiType: "tab-item",
							children: {
								text1: {
									uiType: "body-md",
									children: "<p>Content for Section A</p>",
								},
							},
						},
						tabItem2: {
							title: "Section B",
							uiType: "tab-item",
							children: {
								text2: {
									uiType: "body-md",
									children: "<p>Content for Section B</p>",
								},
							},
						},
					},
				},
			},
		},
	},
};

export default function TabDefaultPage() {
	return <FrontendEngine data={TAB_SCHEMA} />;
}
