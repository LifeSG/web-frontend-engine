"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "nested-multi-select",
					label: "Fruits",
					mode: "expand",
					options: [
						{
							label: "Fruits",
							key: "fruits-key",
							subItems: [
								{
									label: "Berries",
									key: "berries-key",
									subItems: [
										{ label: "Blueberry", value: "blueberry", key: "blueberry-key" },
										{ label: "Raspberry", value: "raspberry", key: "raspberry-key" },
									],
								},
								{
									label: "Melons",
									key: "melons-key",
									subItems: [
										{ label: "Watermelon", value: "watermelon", key: "watermelon-key" },
										{ label: "Honeydew", value: "honeydew", key: "honeydew-key" },
									],
								},
								{ label: "Durian", value: "durian", key: "durian-key" },
							],
						},
						{
							label: "Vegetables",
							key: "vegetable-key",
							subItems: [
								{ label: "Cabbage", value: "cabbage", key: "cabbage-key" },
								{ label: "Spinach", value: "spinach", key: "spinach-key" },
							],
						},
					],
				},
			},
		},
	},
};

export default function NestedMultiSelectDefaultPage() {
	return <FrontendEngine data={SCHEMA} />;
}
