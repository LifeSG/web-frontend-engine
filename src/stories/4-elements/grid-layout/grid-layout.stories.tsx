import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IGridSchema } from "../../../components/fields";
import { DefaultStoryTemplate } from "../../common";

const meta: Meta = {
	title: "Element/GridLayout",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>GridLayout</Title>
					<Description>Displays widgets under grid layout</Description>
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
		colProps: {
			description: "Determines a grid item’s location or item’s size",
			table: {
				type: {
					summary: `{desktopCols?: 1|2|...|12, tabletCols?:1|2|...|8, mobileCols?:1|2|3|4}`,
				},
			},
			defaultValue: { desktopCols: 12 },
			control: { type: "object" },
		},
		customOptions: {
			description:
				"<ul><li>`preventCopyAndPaste` prop accept `boolean` and also can be `undefined`. If value is true then it will prevent user from copy pasting.</li><li>`preventDragAndDrop` prop accept `boolean` and also can be `undefined`. If value is true then it will prevent user from drag and drop.</li></ul>",
			table: {
				type: {
					summary: `{preventCopyAndPaste?: boolean, preventCopyPaste?: boolean}`,
				},
			},
			defaultValue: { PreventCopyAndPaste: false, PreventDragAndDrop: false },
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
			label: "block1",
			colProps: { desktopCols: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 8 },
		},
	},
};

export const DesktopLayout = DefaultStoryTemplate<IGridSchema>("grid").bind({});
DesktopLayout.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "block1",
			colProps: { desktopCols: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 8 },
		},
		block3: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 12 },
		},
	},
};

export const TabletLayout = DefaultStoryTemplate<IGridSchema>("grid").bind({});
TabletLayout.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "block1",
			colProps: { desktopCols: 4, tabletCols: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 8, tabletCols: 4 },
		},
		block3: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 12, tabletCols: 8 },
		},
	},
};

export const MobileLayout = DefaultStoryTemplate<IGridSchema>("grid").bind({});
MobileLayout.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "block1",
			colProps: { desktopCols: 4, tabletCols: 4, mobileCols: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 8, tabletCols: 4, mobileCols: 2 },
		},
		block3: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: 12, tabletCols: 8, mobileCols: 2 },
		},
	},
};
export const CustomLayout = DefaultStoryTemplate<IGridSchema>("grid").bind({});
CustomLayout.args = {
	uiType: "grid",
	children: {
		block1: {
			uiType: "text-field",
			label: "block1",
			colProps: { desktopCols: [1, 5] },
		},
		block2: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: [3, 5] },
		},
		block3: {
			uiType: "text-field",
			label: "block2",
			colProps: { desktopCols: [2, 4] },
		},
	},
};
