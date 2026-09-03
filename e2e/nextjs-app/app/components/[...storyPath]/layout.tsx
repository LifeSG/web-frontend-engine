"use client";

import { ThemeProvider } from "@lifesg/react-design-system/theme";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ThemeProvider>{children}</ThemeProvider>;
}
