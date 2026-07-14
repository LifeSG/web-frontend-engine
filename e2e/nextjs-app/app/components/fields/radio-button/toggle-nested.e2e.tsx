"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import styles from "./radio-button.module.css";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field: {
					uiType: "radio",
					label: "Select a reason",
					customOptions: {
						styleType: "toggle",
						indicator: true,
						layoutType: "vertical",
					},
					options: [
						{ label: "Option 1", value: "option1" },
						{ label: "Option 2", value: "option2" },
						{
							label: "Others",
							value: "Others",
							children: {
								wrapper: {
									uiType: "div",
									className: styles["nested-field"],
									showIf: [{ field: [{ equals: "Others" }] }],
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
		field: "Others",
	},
};

export default function RadioButtonToggleNestedPage() {
	return <FrontendEngine data={SCHEMA} />;
}
