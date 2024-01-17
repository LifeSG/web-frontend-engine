import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { ITabSchema } from "../../../components/elements";
import {
	CommonFieldStoryProps,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
} from "../../common";

const meta: Meta = {
	title: "Element/Tab",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Tab</Title>
					<Description>Organises content across multiple panels</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("tab", true),
		children: {
			description: "The content of the tab component",
			table: {
				type: {
					summary: "Record<string, ITabItemSchema>",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
		currentActiveTabId: {
			description: "Specifies the id of the current active tab",
			table: {
				type: { summary: "string" },
			},
			type: { name: "string" },
		},
		tabItemUiType: {
			table: {
				category: "Tab-Item",
				type: {
					summary: "string",
				},
			},
			name: "uiType",
			description: "Use <code>tab-item</code> to show this field",
			type: { name: "string", required: true },
			control: { disable: true },
		},
		tabItemTitle: {
			table: {
				category: "Tab-Item",
				type: {
					summary: "string",
				},
			},
			name: "title",
			description: "Specifies the title of the tab item",
			type: { name: "string", required: true },
			control: { disable: true },
		},
		tabItemChildren: {
			table: {
				category: "Tab-Item",
				type: {
					summary: "Record<string, TFrontendEngineFieldSchema>",
				},
			},
			name: "children",
			description: "The content of the tab item",
			type: { name: "object", value: {}, required: true },
			control: { disable: true },
		},
	},
};
export default meta;

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
							...SUBMIT_BUTTON_SCHEMA,
						},
					},
				},
				defaultValues,
			}}
		/>
	)) as StoryFn<ITabSchema & { defaultValues?: Record<string, unknown> | undefined }>;

export const Default = Template("tab-default").bind({});
Default.args = {
	uiType: "tab",
	children: {
		tabItem1: {
			title: "Section A",
			uiType: "tab-item",
			children: {
				wrapper1: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						favouriteApple: {
							uiType: "text-field",
							label: "Favourite apple",
							validation: [{ required: true }],
						},
					},
				},
			},
		},
		tabItem2: {
			title: "Section B",
			uiType: "tab-item",
			children: {
				wrapper2: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						favouriteBerry: {
							uiType: "text-field",
							label: "Favourite berry",
							validation: [{ required: true }],
						},
					},
				},
			},
		},
	},
};

export const WithDefaultValues = Template("tab-default-values").bind({});
WithDefaultValues.args = {
	uiType: "tab",
	children: {
		tabItem1: {
			title: "Section A",
			uiType: "tab-item",
			children: {
				wrapper1: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						apple: {
							uiType: "text-field",
							label: "Favourite apple",
						},
					},
				},
			},
		},
		tabItem2: {
			title: "Section B",
			uiType: "tab-item",
			children: {
				wrapper2: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						berry: {
							uiType: "chips",
							label: "Favourite berry",
							options: [
								{ label: "Strawberry", value: "Strawberry" },
								{ label: "Blueberry", value: "Blueberry" },
							],
							textarea: { label: "Others" },
						},
					},
				},
			},
		},
	},
	defaultValues: {
		apple: "Fuji",
		berry: ["Strawberry", "Others"],
		"berry-textarea": "Raspberry",
	},
};

export const ActiveTab = Template("tab-active-tab").bind({});
ActiveTab.args = {
	uiType: "tab",
	currentActiveTabId: "bananaTab",
	children: {
		appleTab: {
			title: "Section A",
			uiType: "tab-item",
			children: {
				wrapper1: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						text1: {
							uiType: "text-body",
							children: "<p>Apples are delicious</p>",
						},
					},
				},
			},
		},
		bananaTab: {
			title: "Section B",
			uiType: "tab-item",
			children: {
				wrapper2: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						text2: {
							uiType: "text-body",
							children: "Bananas are delicious",
						},
					},
				},
			},
		},
		cherryTab: {
			title: "Section C",
			uiType: "tab-item",
			children: {
				wrapper2: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						text2: {
							uiType: "text-body",
							children: "Cherries are delicious",
						},
					},
				},
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<ITabSchema>("tab-overrides", false).bind({});
Overrides.args = {
	uiType: "tab",
	currentActiveTabId: "tabItem1",
	children: {
		tabItem1: {
			title: "Tab item",
			uiType: "tab-item",
			children: {
				wrapper: {
					uiType: "div",
					style: { marginTop: "1rem", marginBottom: "1rem" },
					children: {
						text: {
							uiType: "text-body",
							children: "This is tab item 1",
						},
					},
				},
			},
		},
	},
	overrides: {
		currentActiveTabId: "tabItem2",
		children: {
			tabItem1: {
				title: "Overridden item 1",
			},
			tabItem2: {
				title: "Overridden item 2",
				uiType: "tab-item",
				children: {
					wrapper: {
						uiType: "div",
						style: { marginTop: "1rem", marginBottom: "1rem" },
						children: {
							text: {
								uiType: "text-body",
								children: "This is tab item 2",
							},
						},
					},
				},
			},
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
