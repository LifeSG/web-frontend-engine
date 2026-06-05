"use client";

import { useState } from "react";
import { FrontendEngine, IFrontendEngineData, TFrontendEngineValues } from "@lifesg/web-frontend-engine";

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
					validation: [{ required: true }],
				},
			},
		},
	},
};

export default function FrontendEngineValidationPage() {
	const [validity, setValidity] = useState("idle");
	const [lastValues, setLastValues] = useState("{}");

	return (
		<div className="panel" data-testid="frontend-engine-validation-page">
			<h2>Frontend Engine On-Change Validation</h2>
			<p data-testid="validation-scope">Validation mode is onChange only.</p>
			<FrontendEngine
				data={VALIDATION_SCHEMA}
				onValueChange={(values: TFrontendEngineValues, isValid?: boolean) => {
					setValidity(String(Boolean(isValid)));
					setLastValues(JSON.stringify(values));
				}}
			/>
			<div className="result" data-testid="validation-validity">
				{validity}
			</div>
			<div className="result" data-testid="validation-values">
				{lastValues}
			</div>
		</div>
	);
}
