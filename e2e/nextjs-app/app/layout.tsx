import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "Frontend Engine E2E Demo",
	description: "Next.js runtime target for Playwright E2E",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<body>
				<main className="main">
					<div data-testid="story-layout">{children}</div>
				</main>
			</body>
		</html>
	);
}
