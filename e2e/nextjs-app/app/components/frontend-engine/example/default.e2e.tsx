"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const EXAMPLE_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				email: {
					uiType: "email-field",
					label: "Email",
					placeholder: "Enter your email",
				},
			},
		},
	},
};

export default function FrontendEngineExamplePage() {
	return (
		<div className="panel" data-testid="frontend-engine-example-page">
			<h2>Frontend Engine Example</h2>
			<FrontendEngine
				data={EXAMPLE_SCHEMA}
				onValueChange={() => {
					// no-op
				}}
			/>
		</div>
	);
}
