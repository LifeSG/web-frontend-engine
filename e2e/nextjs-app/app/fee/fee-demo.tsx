"use client";

import { useState } from "react";
import { FrontendEngine } from "@lifesg/web-frontend-engine";

const FEE_SCHEMA = {
	validationMode: "onSubmit",
	revalidationMode: "onChange",
	sections: {
		section: {
			uiType: "section",
			children: {
				name: {
					id: "fee-name",
					uiType: "text-field",
					label: "Name",
					validation: [{ required: true }],
				},
				email: {
					id: "fee-email",
					uiType: "email-field",
					label: "Email",
					validation: [{ required: true }],
				},
				submit: {
					id: "fee-submit",
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export default function FeeDemo() {
	const [result, setResult] = useState("idle");

	return (
		<div className="panel" data-testid="fee-page">
			<h2>Frontend Engine Flow</h2>
			<p data-testid="fee-scope">Schema, validation, and submission lifecycle checks.</p>
			<FrontendEngine
				data={FEE_SCHEMA}
				onSubmit={(values) => {
					setResult(`success:${JSON.stringify(values)}`);
				}}
				onSubmitError={() => {
					setResult("error:validation");
				}}
			/>
			<div className="result" data-testid="fee-submit-result">
				{result}
			</div>
		</div>
	);
}
