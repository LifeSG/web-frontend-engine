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

export const Disabled = Template.bind({});
Disabled.args = {
	"contact-disabled": {
		fieldType: "contact",
		label: "Contact Number",
		disabled: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"contact-placeholder": {
		fieldType: "contact",
		label: "Contact Number",
		placeholder: "Enter your contact number",
	},
};

export const WithSearch = Template.bind({});
WithSearch.args = {
	"contact-with-search": {
		fieldType: "contact",
		label: "Contact Number",
		enableSearch: true,
	},
};

export const SGHouseNumberValidation = Template.bind({});
SGHouseNumberValidation.args = {
	"contact-with-singapore-house-number": {
		fieldType: "contact",
		label: "Contact Number",
		validation: [
			{
				isSingaporeNumber: {
					isHomeNumber: true,
				},
			},
		],
	},
};

export const SGPhoneNumberValidation = Template.bind({});
SGPhoneNumberValidation.args = {
	"contact-with-singapore-mobile-number": {
		fieldType: "contact",
		label: "Contact Number",
		validation: [
			{
				isSingaporeNumber: {
					isMobileNumber: true,
				},
			},
		],
	},
};

export const InternationalNumberValidation = Template.bind({});
InternationalNumberValidation.args = {
	"contact-with-international-number": {
		fieldType: "contact",
		label: "Contact Number",
		validation: [
			{
				isInternationalNumber: true,
			},
		],
	},
};
