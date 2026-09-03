"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import styles from "./checkbox-group.module.css";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "checkbox",
					label: "Select a reason",
					customOptions: {
						styleType: "toggle",
						indicator: true,
						layoutType: "vertical",
					},
					options: [
						{
							label: "Others",
							value: "Others",
							children: {
								wrapper: {
									uiType: "div",
									className: styles["nested-field"],
									children: {
										otherInput: {
											uiType: "textarea",
											label: "Please specify",
										},
									},
								},
							},
						},
					],
				},
			},
		},
	},
	defaultValues: {
		field: ["Others"],
	},
};

export default function CheckboxPage() {
	return <FrontendEngine data={SCHEMA} />;
}
