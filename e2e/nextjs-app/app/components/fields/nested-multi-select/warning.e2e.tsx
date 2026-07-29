"use client";

import { IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { createWarningPage } from "../../common";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "nested-multi-select",
					label: "Fruits",
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
								{ label: "Durian", value: "durian", key: "durian-key" },
							],
						},
					],
				},
			},
		},
	},
};

export default createWarningPage({ schema: SCHEMA });
