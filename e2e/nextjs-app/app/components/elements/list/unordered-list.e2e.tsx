"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const BASIC_LIST_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				list: {
					uiType: "unordered-list",
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
										uiType: "unordered-list",
										children: ["Nested item 1"],
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

export default function BasicListPage() {
	return <FrontendEngine data={BASIC_LIST_SCHEMA} />;
}
