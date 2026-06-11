import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const CDN_STYLE_PATHS = ["/cdn/react-design-system/v3/css/main.css", "/cdn/react-design-system/v3/css/open-sans.css"];

export const metadata: Metadata = {
	title: "Frontend Engine E2E Demo",
	description: "Next.js runtime target for Playwright E2E",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				{CDN_STYLE_PATHS.map((href) => (
					<link key={href} rel="stylesheet" href={href} />
				))}
			</head>
			<body>
				<main className="main">
					<div data-testid="story-layout">{children}</div>
				</main>
			</body>
		</html>
	);
}
