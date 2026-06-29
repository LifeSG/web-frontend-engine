"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { IIframeSchema } from "@lifesg/web-frontend-engine/components/custom";
import { useEffect, useState } from "react";

export default function IframeDefaultPage() {
	const [srcUrl, setSrcUrl] = useState("");

	useEffect(() => {
		const { protocol, host } = window.location;
		setSrcUrl(`${protocol}//${host}/components/custom/iframe/default-child`);
	}, []);

	if (!srcUrl) return null;

	const IFRAME_SCHEMA: IFrontendEngineData<undefined, IIframeSchema> = {
		sections: {
			section: {
				uiType: "section",
				children: {
					iframe: {
						referenceKey: "iframe",
						validationTimeout: -1,
						src: srcUrl,
						style: {
							minHeight: "300px",
						},
					},
				},
			},
		},
	};

	return <FrontendEngine data={IFRAME_SCHEMA} />;
}
