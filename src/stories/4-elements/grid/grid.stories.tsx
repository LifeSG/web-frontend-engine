import { ArgTypes, Stories, Title } from "@storybook/addon-docs/blocks";
import { Meta } from "@storybook/react-webpack5";
import { IGridSchema } from "../../../components/elements";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/Grid",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Grid</Title>
					<p>Renders components in grid layout.</p>
					<ArgTypes of={Default} />
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
			columns: { xl: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { xl: 8 },
		},
		block3: {
			uiType: "text-field",
			label: "Block 3",
			columns: { xl: 7 },
		},
		block4: {
			uiType: "text-field",
			label: "Block 4",
			columns: { xl: 5 },
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
			columns: { xl: 4, lg: 6, xxs: 8 },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { xl: 8, lg: 6, xxs: 4 },
		},
		block3: {
			uiType: "text-field",
			label: "Block 3",
			columns: { xl: 12, lg: 12, xxs: 4 },
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
			columns: { xl: [4, 8] },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { xl: [2, 5] },
		},
		block3: {
			uiType: "text-field",
			label: "Block 3",
			columns: { xl: [6, 8] },
		},
		block4: {
			uiType: "text-field",
			label: "Block 4",
			columns: { xl: [1, 12] },
		},
	},
};
