import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IRadioButtonGroupSchema } from "../../../components/fields/radio-button/types";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Field/RadioButton/ImageButton",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Radio ImageButton Button</Title>
					<Description>
						This component provides a set of radio image-button buttons for user to select
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
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
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		customOptions: {
			description:
				"<div>A custom options on which styling to use for rendering the image-button group.</div><ul><li>`styleType` prop accept either `default` or `image-button` and also can be `undefined`.If set to `image-button` will render image-button button, else render default radio buttons.</li><li>`indicator` show/hide radio icon, `false` by default.</li><li>`border` show/hide border,`true` by default.</li></ul>",
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
} as Meta;

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
	)) as Story<IRadioButtonGroupSchema & { defaultValues?: string | undefined }>;

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
