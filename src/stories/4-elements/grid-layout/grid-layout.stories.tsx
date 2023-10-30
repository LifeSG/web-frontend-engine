import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { DefaultStoryTemplate } from "../../common";
import { IGridSchema } from "../../../components/elements";

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
		columns: {
			description: "Determines a grid item’s location or item’s size",
			table: {
				type: {
					summary: `{desktop?: 1|2|...|12, tablet?:1|2|...|8, mobile?:1|2|3|4}`,
				},
			},
			defaultValue: { desktop: 12 },
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
			label: "Block 1",
			columns: { desktop: 4 },
		},
		block2: {
			uiType: "text-field",
			label: "Block 2",
			columns: { desktop: 8 },
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
