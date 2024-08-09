import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { ISectionSchema } from "../../../components/elements/section";
import { CommonFieldStoryProps, FrontendEngine } from "../../common";

const meta: Meta = {
	title: "Element/Section",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Section</Title>
					<p>Wrapping component that must be rendered as a direct descendant of `sections` uiType.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("section", true),
		children: {
			description: "Elements that are the descendant of this component",
			table: {
				type: { summary: "TFrontendEngineFieldSchema" },
			},
			type: { name: "object", value: {}, required: true },
		},
		layoutType: {
			description:
				"<div>Determines how the presentation of the children is structured and displayed.<ul><li><strong>default:</strong> Does not modify the layout.</li><li><strong>grid</strong>: Render children in <a href='https://designsystem.life.gov.sg/react/index.html?path=/story/getting-started-layout--grid-layout' target='_blank' rel='noopener noreferrer'>grid layout</a>.</li><li><strong>contain</strong>: Render children within <a href='https://designsystem.life.gov.sg/react/index.html?path=/docs/getting-started-layout--general-usage' target='_blank' rel='noopener noreferrer' >Layout.Content</a> within 1320px in block display.</li></ul></div>",
			table: {
				type: {
					summary: "default | grid | contain",
				},
				defaultValue: { summary: "default" },
			},
			options: ["default", "grid", "contain"],
			control: {
				type: "select",
			},
		},
	},
};
export default meta;

const Template = (id: string) =>
	((args) => (
		<FrontendEngine
			data={{
				sections: {
					[id]: args,
				},
			}}
		/>
	)) as StoryFn<ISectionSchema>;

export const Default = Template("section-default").bind({});
Default.args = {
	uiType: "section",
	children: {
		text: {
			uiType: "text-field",
			label: "Text",
		},
		text2: {
			uiType: "text-field",
			label: "Text 2",
		},
	},
};

export const Grid = Template("section-grid").bind({});
Grid.args = {
	uiType: "section",
	layoutType: "grid",
	children: {
		text1: {
			uiType: "text-field",
			label: "Text",
			columns: { desktop: 6 },
		},
		text2: {
			uiType: "text-field",
			label: "Text 2",
			columns: { desktop: 6 },
		},
		text3: {
			uiType: "text-field",
			label: "Text 3",
			columns: { desktop: 6 },
		},
		text4: {
			uiType: "text-field",
			label: "Text 4",
			columns: { desktop: 6 },
		},
	},
};

export const Contained = Template("section-contain").bind({});
Contained.args = {
	uiType: "section",
	layoutType: "contain",
	children: {
		text1: {
			uiType: "text-field",
			label: "Contained within 1320px",
		},
		text2: {
			uiType: "text-field",
			label: "Contained within 1320px",
		},
	},
};
