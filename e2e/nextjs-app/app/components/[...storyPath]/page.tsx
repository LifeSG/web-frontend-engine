import dynamic from "next/dynamic";

export default async function Page({
	params,
}: Readonly<{
	params: Promise<{ storyPath: string[] }>;
}>) {
	const { storyPath } = await params;

	if (!Array.isArray(storyPath) || storyPath.length < 2) {
		throw new Error("Invalid story path.");
	}

	const story = storyPath.at(-1) as string;
	const componentPath = storyPath.slice(0, -1).join("/");
	const Story = dynamic(() => import(`@/app/components/${componentPath}/${story}.e2e`));

	return <Story />;
}
