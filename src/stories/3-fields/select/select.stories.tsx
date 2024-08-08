import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ISelectSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/Select",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Select</Title>
					<p>This component provides a set of options for user to select</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("select"),
		disabled: {
			description: "Specifies if the input should be disabled",
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
		options: {
			description: "A list of options that a user can choose from",
			table: {
				type: {
					summary: "{ label: string, value: string }[]",
				},
			},
			type: { name: "object", value: {} },
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<ISelectSchema>("select-default").bind({});
Default.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
};

export const DefaultValue = DefaultStoryTemplate<ISelectSchema>("select-default-value").bind({});
DefaultValue.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
	defaultValues: "apple",
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

export const LabelCustomisation = DefaultStoryTemplate<ISelectSchema>("select-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "select",
	label: {
		mainLabel: "Fruits <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
	options: [
		{ value: "Apple", label: "Apple" },
		{ value: "Berry", label: "Berry" },
		{ value: "Cherry", label: "Cherry" },
	],
};

export const Disabled = DefaultStoryTemplate<ISelectSchema>("select-disabled").bind({});
Disabled.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
	disabled: true,
};

export const Searchable = DefaultStoryTemplate<ISelectSchema>("select-searchable").bind({});
Searchable.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
	enableSearch: true,
};

export const Placeholder = DefaultStoryTemplate<ISelectSchema>("select-placeholder").bind({});
Placeholder.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
	placeholder: "Select your fruit",
};

export const WithValidation = DefaultStoryTemplate<ISelectSchema>("select-with-validation").bind({});
WithValidation.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<ISelectSchema>("select-with-warning").bind({});
Warning.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "apple" },
		{ label: "Berry", value: "berry" },
		{ label: "Cherry", value: "cherry" },
	],
};

export const Reset = ResetStoryTemplate<ISelectSchema>("select-reset").bind({});
Reset.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
};

export const ResetWithDefaultValues = ResetStoryTemplate<ISelectSchema>("select-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	defaultValues: "Apple",
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<ISelectSchema>("select-overrides").bind({});
Overrides.args = {
	uiType: "select",
	label: "Fruits",
	options: [
		{ label: "Apple", value: "Apple" },
		{ label: "Berry", value: "Berry" },
		{ label: "Cherry", value: "Cherry" },
	],
	overrides: {
		label: "Overridden",
		options: [{ label: "New field", value: "new" }],
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
