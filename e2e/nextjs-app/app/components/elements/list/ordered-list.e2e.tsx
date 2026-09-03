"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const ORDERED_LIST_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				list: {
					uiType: "ordered-list",
					children: [
						"Item 1",
						{
							listItem: {
								uiType: "list-item",
								children: {
									text: {
										uiType: "body-md",
										children: "Item 2",
									},
									nestedList: {
										uiType: "ordered-list",
										counterType: "lower-alpha",
										children: ["Nested item 1", "Nested item 2"],
									},
								},
							},
						},
					],
				},
			},
		},
	},
};

export default function OrderedListPage() {
	return <FrontendEngine data={ORDERED_LIST_SCHEMA} />;
}
