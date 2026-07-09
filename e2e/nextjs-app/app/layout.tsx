import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import StyledComponentsRegistry from "./styled-components-registry";

import "./globals.css";
import "@lifesg/react-design-system/theme/styles/lifesg.css";

const CDN_STYLE_PATHS = ["/cdn/react-design-system/v4/css/main.css", "/cdn/react-design-system/v3/css/open-sans.css"];

export const metadata: Metadata = {
	title: "Frontend Engine E2E Demo",
	description: "Next.js runtime target for Playwright E2E",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const nonce = (await headers()).get("x-nonce");

	return (
		<html lang="en">
			<head>
				{CDN_STYLE_PATHS.map((href) => (
					<link key={href} rel="stylesheet" href={href} />
				))}
			</head>
			<body>
				<StyledComponentsRegistry nonce={nonce}>
					<main className="main">
						<div data-testid="story-layout">{children}</div>
					</main>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
