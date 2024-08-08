import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IDividerSchema } from "../../../components/elements";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/Divider",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Divider</Title>
					<p>An element that separates or delineates contents through a single horizontal line.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("divider", true),
		color: {
			type: {
				name: "string",
				required: true,
			},
			description:
				'The colour for the `Divider` line. Supports all formats (e.g. `keywords`, `hexadecimal`, `rgb`, `hsl`) that the css color rule can support. For more information, refer to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank" rel="noreferrer noopener">this documentation</a>.',
			table: {
				type: {
					summary: "string",
				},
			},
		},
		lineStyle: {
			description: "The visual appearance for the `Divider` line",
			table: {
				type: {
					summary: "solid | dashed",
				},
				defaultValue: { summary: "solid" },
			},
		},
		thickness: {
			description: "The thickness/height of the `Divider` in px",
			table: {
				type: {
					summary: "number",
				},
				defaultValue: { summary: "1" },
			},
		},
		verticalMargin: {
			description: "The spacing above and below the `Divider` in rem",
			table: {
				type: {
					summary: "number",
				},
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
					section: {
						uiType: "section",
						children: {
							[id]: args,
						},
					},
				},
			}}
		/>
	)) as StoryFn<IDividerSchema>;

export const Default = Template("divider-default").bind({});
Default.args = {
	uiType: "divider",
};

export const Color = Template("divider-color").bind({});
Color.args = {
	uiType: "divider",
	color: "#F00",
};

export const DashedLine = Template("divider-line-style").bind({});
DashedLine.args = {
	uiType: "divider",
	lineStyle: "dashed",
};

export const Thickness = Template("divider-thickness").bind({});
Thickness.args = {
	uiType: "divider",
	thickness: 3,
};

export const Overrides = OverrideStoryTemplate<IDividerSchema>("divider-overrides", false).bind({});
Overrides.args = {
	uiType: "divider",
	color: "red",
	overrides: {
		color: "blue",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
