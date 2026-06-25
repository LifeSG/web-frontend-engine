"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const EXAMPLE_WITH_NAME_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				email: {
					uiType: "email-field",
					label: "Email",
					placeholder: "Enter your email",
				},
				name: {
					uiType: "text-field",
					label: "Name",
					placeholder: "Enter your name",
				},
			},
		},
	},
};

export default function FrontendEngineExampleWithNamePage() {
	return (
		<div className="panel" data-testid="frontend-engine-example-page">
			<h2>Frontend Engine Example</h2>
			<FrontendEngine data={EXAMPLE_WITH_NAME_SCHEMA} />
		</div>
	);
}
