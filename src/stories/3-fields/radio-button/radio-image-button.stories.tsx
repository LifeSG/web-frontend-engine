import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { TRadioButtonGroupSchema } from "../../../components/fields/radio-button/types";
import {
	CommonFieldStoryProps,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/RadioButton/ImageButton",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Radio ImageButton Button</Title>
					<p>This component provides a set of radio image-button buttons for user to select</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("radio"),
		disabled: {
			description: "Specifies if the radio buttons should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		customOptions: {
			description:
				"<div>A custom options on which styling to use for rendering the image-button group.</div><ul><li>`styleType` prop accept either `default` or `image-button` and also can be `undefined`.If set to `image-button` will render image-button button, else render default radio buttons.",
			table: {
				type: {
					summary: `{styleType: "image-button"}`,
				},
			},
			type: { name: "object", value: {} },
		},
		options: {
			description:
				"A list of options that a user can choose from. Component <code>disabled</code> will take precedence over option <code>disabled</code>. <code>imgSrc</code> should be a link to a valid image.",
			table: {
				type: {
					summary: "{ label: string, value: string, disabled?: boolean, imgSrc?: string }[]",
				},
			},
			type: { name: "object", value: {} },
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
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as StoryFn<TRadioButtonGroupSchema & { defaultValues?: string | undefined }>;

export const Default = Template("radio-default").bind({});
Default.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
};

export const DefaultValue = Template("radio-default-value").bind({});
DefaultValue.args = {
	uiType: "radio",
	label: "Fruits",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
	defaultValues: "Apple",
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const LabelCustomisation = Template("radio-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "radio",
	label: {
		mainLabel: "Fruits <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
};

export const DisabledOptions = Template("radio-disabled-options").bind({});
DisabledOptions.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{
			label: "Apple",
			value: "Apple",
			disabled: true,
			imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
		},
		{
			label: "Berry",
			value: "Berry",
			disabled: true,
			imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png",
		},
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
};

export const Disabled = Template("radio-disabled").bind({});
Disabled.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
	disabled: true,
};

export const WithValidation = Template("radio-with-validation").bind({});
WithValidation.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<TRadioButtonGroupSchema>("radio-with-warning").bind({});
Warning.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
};

export const Overrides = OverrideStoryTemplate<TRadioButtonGroupSchema>("radio-overrides").bind({});
Overrides.args = {
	uiType: "radio",
	label: "Radio Button",
	customOptions: {
		styleType: "image-button",
	},
	options: [
		{ label: "Apple", value: "Apple", imgSrc: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
		{ label: "Berry", value: "Berry", imgSrc: "https://cdn-icons-png.flaticon.com/128/2105/2105891.png" },
		{ label: "Cherry", value: "Cherry", imgSrc: "https://cdn-icons-png.flaticon.com/128/7254/7254245.png" },
	],
	overrides: {
		label: "Overridden",
		options: [
			{ label: "New field", value: "new", imgSrc: "https://cdn-icons-png.flaticon.com/512/891/891448.png" },
		],
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
