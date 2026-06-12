"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";

const VALIDATION_SCHEMA: IFrontendEngineData = {
	validationMode: "onChange",
	revalidationMode: "onChange",
	sections: {
		section: {
			uiType: "section",
			children: {
				email: {
					uiType: "email-field",
					label: "Email",
					placeholder: "Enter your email",
					validation: [{ required: true }],
				},
			},
		},
	},
};

export default function FrontendEngineValidationPage() {
	return (
		<div className="panel" data-testid="frontend-engine-validation-page">
			<h2>Frontend Engine On-Change Validation</h2>
			<p data-testid="validation-scope">Validation mode is onChange only.</p>
			<FrontendEngine
				data={VALIDATION_SCHEMA}
				onValueChange={() => {
					// no-op
				}}
			/>
		</div>
	);
}
