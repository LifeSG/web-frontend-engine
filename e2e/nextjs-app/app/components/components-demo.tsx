"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const COMPONENT_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				name: {
					label: "What is your name",
					uiType: "text-field",
					validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
				},
			},
		},
	},
};

export default function ComponentsDemo() {
	return (
		<div className="panel" data-testid="components-page">
			<h2>Components and Customization</h2>
			<p data-testid="components-scope">Minimal behavior plus customization coverage.</p>
			<FrontendEngine data={COMPONENT_SCHEMA} />
		</div>
	);
}
