"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { IIframeSchema } from "@lifesg/web-frontend-engine/components/custom";
import { useEffect, useState } from "react";
import styles from "./iframe.module.css";

export default function IframeDefaultPage() {
	const [srcUrl, setSrcUrl] = useState("");

	useEffect(() => {
		setSrcUrl(`${window.location.origin}/components/custom/iframe/default-child`);
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
						className: styles.iframeStyle,
					},
				},
			},
		},
	};

	return <FrontendEngine data={IFRAME_SCHEMA} />;
}
