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
					<div className="nav">
						<Link href="/">Home</Link>
						<Link href="/components">Components</Link>
						<Link href="/fee">FEE</Link>
					</div>
					{children}
				</main>
			</body>
		</html>
	);
}
