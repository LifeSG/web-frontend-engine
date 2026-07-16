"use client";

import { FrontendEngine, IFrontendEngineData, IFrontendEngineRef } from "@lifesg/web-frontend-engine";
import { useEffect, useRef } from "react";

interface CreateWarningPageOptions {
	schema: IFrontendEngineData;
}

export const createWarningPage = ({ schema }: CreateWarningPageOptions) =>
	function WarningPage() {
		const formRef = useRef<IFrontendEngineRef | null>(null);

		useEffect(() => {
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
				<FrontendEngine ref={formRef} data={schema} />
			</div>
		);
	};
