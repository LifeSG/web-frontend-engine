import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
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
