import * as Icons from "@lifesg/react-icons";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IMaskedFieldSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/MaskedField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>MaskedField</Title>
					<Description>A form element that supports masking of input</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
						attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("masked-field"),
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		disabled: {
			description: "Specifies if the masked field is interactable",
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
		maskChar: {
			description: "The character to mask with",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "•" },
			},
			control: {
				type: "text",
			},
		},
		maskRange: {
			description: "The range of characters to mask",
			table: {
				type: {
					summary: "number[]",
				},
			},
		},
		unmaskRange: {
			description: "The range of characters to NOT mask.",
			table: {
				type: {
					summary: "number[]",
				},
			},
			control: {
				type: "object",
			},
		},
		maskRegex: {
			description: "The matching group of characters will be replaced with the mask character",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		iconActiveColor: {
			description: "The color of the icon when it is active",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		iconInactiveColor: {
			description: "The color of icon when it is inactive",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		iconMask: {
			description:
				"The icon to mask the field, based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page' target='_blank' rel='noopener noreferrer'>React Icons</a>",
			table: {
				type: {
					summary: "Refer to React Icons",
				},
			},
			control: {
				type: "select",
			},
			options: Object.keys(Icons),
		},
		iconUnmask: {
			description:
				"The icon to unmask the field, based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page' target='_blank' rel='noopener noreferrer'>React Icons</a>",
			table: {
				type: {
					summary: "Refer to React Icons",
				},
			},
			control: {
				type: "select",
			},
			options: Object.keys(Icons),
		},
		transformInput: {
			description: "Specifies whether the input value is to be transformed into uppercase or lowercase format",
			table: {
				type: {
					summary: "uppercase | lowercase",
				},
			},
			control: {
				type: "select",
			},
			options: ["uppercase", "lowercase"],
		},
	},
};
export default meta;

const COMMON_STORY_ARGS: IMaskedFieldSchema = {
	label: "Masked field",
	uiType: "masked-field",
	maskRange: [2, 5],
};

export const Default = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-default").bind({});
Default.args = {
	...COMMON_STORY_ARGS,
};

export const DefaultValue = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-default-value").bind({});
DefaultValue.args = {
	...COMMON_STORY_ARGS,
	defaultValues: "This is the default value",
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

export const LabelCustomisation = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-label-customisation").bind({});
LabelCustomisation.args = {
	...COMMON_STORY_ARGS,
	label: {
		mainLabel: "Masked field <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const Disabled = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-disabled").bind({});
Disabled.args = {
	...COMMON_STORY_ARGS,
	disabled: true,
};

export const MaxLength = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-maxlength").bind({});
MaxLength.args = {
	...COMMON_STORY_ARGS,
	validation: [{ max: 5 }],
};

export const Placeholder = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-placeholder").bind({});
Placeholder.args = {
	...COMMON_STORY_ARGS,
	placeholder: "Enter text here",
};

export const WithValidation = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-with-validation").bind({});
WithValidation.args = {
	...COMMON_STORY_ARGS,
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<IMaskedFieldSchema>("masked-field-with-warning").bind({});
Warning.args = {
	...COMMON_STORY_ARGS,
};

export const CustomMaskIcon = DefaultStoryTemplate<IMaskedFieldSchema>("masked-field-custom-icon").bind({});
CustomMaskIcon.args = {
	...COMMON_STORY_ARGS,
	iconMask: "CloudTickIcon",
	iconUnmask: "CloudIcon",
	iconActiveColor: "red",
	iconInactiveColor: "blue",
};

export const Reset = ResetStoryTemplate<IMaskedFieldSchema>("masked-field-reset").bind({});
Reset.args = {
	...COMMON_STORY_ARGS,
};

export const ResetWithDefaultValues = ResetStoryTemplate<IMaskedFieldSchema>("masked-field-reset-default-values").bind(
	{}
);
ResetWithDefaultValues.args = {
	...COMMON_STORY_ARGS,
	defaultValues: "This is the default value",
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

export const Overrides = OverrideStoryTemplate<IMaskedFieldSchema>("masked-field-overrides").bind({});
Overrides.args = {
	...COMMON_STORY_ARGS,
	overrides: {
		label: "Overridden",
		placeholder: "Overridden",
		maskRange: null,
		unmaskRange: [3, 10],
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
