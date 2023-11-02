import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IGridSchema } from "../../../components/elements";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/Grid",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Grid</Title>
					<Description>Renders components in grid layout</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLDivElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement) attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("grid", true),
		children: {
			type: {
				name: "string",
				required: true,
			},
			description: "The content of the grid component",
			table: {
				type: {
					summary: "TFrontendEngineFieldSchema",
				},
			},
			control: {
				type: "object",
			},
		},
		columns: {
			description:
				"Specifies the number of columns to be span across in desktop / tablet / mobile viewports. If an array is specified, the format is as such `[startCol, endCol]`.<br><br>Permitted values<br>Desktop: `1 - 12` and `1 - 13` if specifying a range.<br>Mobile: `1 - 4` and `1 - 5` if specifying a range.<br><br>Settings are applied by similar to how `@max-width` works: if `desktop` is not specified, `tablet` will be used for desktop and tablet, if `tablet` is also not specified, `mobile` will be used for all screen sizes.<br><br>If all column settings are not specified, element will span across a single column.",
			table: {
				type: {
					summary: `{desktop?: number, tablet?: number, mobile?: number}`,
				},
			},
			defaultValue: { desktop: 12 },
			control: { type: "object" },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<IGridSchema>("grid").bind({});
Default.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "Block 1",
			columns: { desktop: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { desktop: 8 },
		},
		block3: {
			uiType: "text-field",
			label: "Block 3",
			columns: { desktop: 7 },
		},
		block4: {
			uiType: "text-field",
			label: "Block 4",
			columns: { desktop: 5 },
		},
	},
};

export const ResponsiveLayout = DefaultStoryTemplate<IGridSchema>("grid").bind({});
ResponsiveLayout.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "Block 1",
			columns: { desktop: 4, tablet: 4, mobile: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { desktop: 8, tablet: 4, mobile: 2 },
		},
		block3: {
			uiType: "text-field",
			label: "Block 3",
			columns: { desktop: 12, tablet: 8, mobile: 2 },
		},
	},
};

export const CustomLayout = DefaultStoryTemplate<IGridSchema>("grid").bind({});
CustomLayout.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "Block 1",
			columns: { desktop: [4, 8] },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { desktop: [2, 5] },
		},
		block3: {
			uiType: "text-field",
			label: "Block 3",
			columns: { desktop: [6, 8] },
		},
		block4: {
			uiType: "text-field",
			label: "Block 4",
			columns: { desktop: [1, 12] },
		},
	},
};
