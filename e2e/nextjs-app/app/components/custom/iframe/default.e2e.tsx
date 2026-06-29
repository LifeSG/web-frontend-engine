"use client";

import { FrontendEngine, IFrontendEngineData } from "@lifesg/web-frontend-engine";
import { IIframeSchema } from "@lifesg/web-frontend-engine/components/custom";

export default function IframeDefaultPage() {
	const IFRAME_SCHEMA: IFrontendEngineData<undefined, IIframeSchema> = {
		sections: {
			section: {
				uiType: "section",
				children: {
					iframe: {
						referenceKey: "iframe",
						validationTimeout: -1,
						src: `${window.location.protocol}//${window.location.host}/components/custom/iframe/default-child`,
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
