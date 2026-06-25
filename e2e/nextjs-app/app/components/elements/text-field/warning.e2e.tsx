"use client";

import { useEffect, useRef } from "react";
import { FrontendEngine, IFrontendEngineData, IFrontendEngineRef } from "@lifesg/web-frontend-engine";

const TEXT_FIELD_WARNING_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				primary: {
					uiType: "text-field",
					label: "Primary text field",
					placeholder: "Type in primary",
				},
				secondary: {
					uiType: "text-field",
					label: "Secondary text field",
					placeholder: "Type in secondary",
				},
			},
		},
	},
};

export default function TextFieldWarningPage() {
	const formRef = useRef<IFrontendEngineRef | null>(null);

	useEffect(() => {
		// Defer warning application to ensure fields are registered first.
		const timerId = globalThis.setTimeout(() => {
			formRef.current?.setWarnings({
				primary: "Primary warning message",
			});
		}, 0);

		return () => {
			globalThis.clearTimeout(timerId);
		};
	}, []);

	return (
		<div>
			<FrontendEngine ref={formRef} data={TEXT_FIELD_WARNING_SCHEMA} />
		</div>
	);
}
