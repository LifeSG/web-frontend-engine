"use client";

import { FrontendEngine, IFrontendEngineData, IFrontendEngineRef } from "@lifesg/web-frontend-engine";
import { useRef } from "react";

const FIELD_ID = "field";

const SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				[FIELD_ID]: {
					uiType: "file-upload",
					label: "Upload documents",
					"data-testid": "file-upload",
					uploadOnAddingFile: {
						type: "base64",
						url: "/api/upload",
					},
				},
			},
		},
	},
};

export default function FileUploadCustomErrorPage() {
	const formRef = useRef<IFrontendEngineRef | null>(null);

	const handleSetCustomErrors = () => {
		const values = formRef.current?.getValues();
		const files = (values?.[FIELD_ID] ?? []) as { fileId: string }[];

		formRef.current?.setErrors({
			[FIELD_ID]: {
				message: "Custom error message <strong>with bold text</strong>",
				...(files.length > 0 && {
					fileErrors: Object.fromEntries(
						files.map((file, index) => [file.fileId, `Custom error message per file (${index})`])
					),
				}),
			},
		});
	};

	return (
		<>
			<FrontendEngine ref={formRef} data={SCHEMA} />
			<button data-testid="set-custom-errors" onClick={handleSetCustomErrors} style={{ marginTop: "2rem" }}>
				Set custom errors
			</button>
		</>
	);
}
