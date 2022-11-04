import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IContactNumberSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, StyledForm, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/ContactNumber",
	parameters: {
		docs: {
			// todo: update desc
			page: () => (
				<>
					<Title>ContactNumber</Title>
					<Description>This component provides a set of checkboxes for user to select</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("contact"),
		label: {
			description: "Specifies the label text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		country: {
			description: "Specifies a default country for the input field",
			table: {
				type: {
					summary: "TCountry",
				},
			},
			control: {
				type: "text",
			},
		},
		enableSearch: {
			description: "Specifies if the given list of country codes can be searched",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		disabled: {
			description: "Specifies if the input should be disabled",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
		allowInternationalNumbers: {
			description: "Specifies if the input should provide international number prefixes",
			table: {
				type: {
					summary: "boolean",
				},
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
			defaultValue: false,
		},
	},
} as Meta;

const Template: Story<Record<string, IContactNumberSchema>> = (args) => (
	<StyledForm data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"contact-default": {
		fieldType: "contact",
		label: "Contact Number",
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"contact-with-validation": {
		fieldType: "contact",
		label: "Contact Number",
		validation: [{ isInternationalNumber: true }],
	},
};
