import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ISwitchSchema } from "../../../components/fields/switch/types";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/Switch",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Switch Toggle Button</Title>
					<p>This component provides a set of switch toggle buttons for user to select</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("switch"),
		disabled: {
			description: "Specifies if the switch buttons should be disabled",
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
			description: "<ul><li>`border` show/hide border,`true` by default.</li></ul>",
			table: {
				type: {
					summary: `{border?: boolean}`,
				},
			},
			type: { name: "object", value: {} },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<ISwitchSchema>("switch-default").bind({});
Default.args = {
	uiType: "switch",
	label: "Switch",
};

export const DefaultValue = DefaultStoryTemplate<ISwitchSchema, boolean>("switch-default-value").bind({});
DefaultValue.args = {
	uiType: "switch",
	label: "Switch",
	defaultValues: true,
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "boolean",
			},
		},
		control: {
			type: "boolean",
		},
	},
};

export const LabelCustomisation = DefaultStoryTemplate<ISwitchSchema>("switch-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "switch",
	label: {
		mainLabel: "Switch <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const Disabled = DefaultStoryTemplate<ISwitchSchema>("switch-disabled").bind({});
Disabled.args = {
	uiType: "switch",
	label: "Switch",
	disabled: true,
};

export const WithValidation = DefaultStoryTemplate<ISwitchSchema>("switch-with-validation").bind({});
WithValidation.args = {
	uiType: "switch",
	label: "Switch",
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<ISwitchSchema>("switch-with-warning").bind({});
Warning.args = {
	uiType: "switch",
	label: "Switch",
};

export const WithoutBorder = DefaultStoryTemplate<ISwitchSchema>("switch-without-border").bind({});
WithoutBorder.args = {
	uiType: "switch",
	label: "Switch",
	customOptions: {
		border: false,
	},
};

export const Reset = ResetStoryTemplate<ISwitchSchema>("switch-reset").bind({});
Reset.args = {
	uiType: "switch",
	label: "Switch",
};

export const ResetWithDefaultValues = ResetStoryTemplate<ISwitchSchema, boolean>("switch-reset-default-values").bind(
	{}
);
ResetWithDefaultValues.args = {
	uiType: "switch",
	label: "Switch",
	defaultValues: true,
};

export const Overrides = OverrideStoryTemplate<ISwitchSchema>("switch-overrides").bind({});
Overrides.args = {
	uiType: "switch",
	label: "Switch",
	overrides: {
		label: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
