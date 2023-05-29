import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react/types-6-0";
import { IContactFieldSchema } from "../../../components/fields";
import { getCountries } from "../../../components/fields/contact-field/data";
import { CommonFieldStoryProps, DefaultStoryTemplate, ResetStoryTemplate } from "../../common";

export default {
	title: "Field/ContactField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ContactField</Title>
					<Description>
						This component provides the functionality for users to input their phone numbers
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("contact-field"),
		placeholder: {
			description: "Specifies the placeholder text",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		defaultCountry: {
			description:
				"Specifies a default country for the input field, not applicable if field has fixed country code. (Defined via validation config)",
			table: {
				type: {
					summary: "TCountry",
				},
			},
			control: {
				type: "select",
			},
			options: getCountries(),
		},
		enableSearch: {
			description:
				"Specifies if the given list of country codes can be searched, not applicable if field has fixed country code. (Defined via validation config)",
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
		disabled: {
			description: "Specifies if the input should be disabled",
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
	},
} as Meta;

export const Default = DefaultStoryTemplate<IContactFieldSchema>("contact-default").bind({});
Default.args = {
	uiType: "contact-field",
	label: "Contact Number",
};

export const DefaultCountry = DefaultStoryTemplate<IContactFieldSchema>("contact-default-country").bind({});
DefaultCountry.args = {
	uiType: "contact-field",
	label: "Contact Number",
	defaultCountry: "Japan",
};

export const DefaultValue = DefaultStoryTemplate<IContactFieldSchema>("contact-default-value").bind({});
DefaultValue.args = {
	uiType: "contact-field",
	label: "Contact Number",
	defaultValues: "91234567",
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

export const Disabled = DefaultStoryTemplate<IContactFieldSchema>("contact-disabled").bind({});
Disabled.args = {
	uiType: "contact-field",
	label: "Contact Number",
	disabled: true,
};

export const Placeholder = DefaultStoryTemplate<IContactFieldSchema>("contact-placeholder").bind({});
Placeholder.args = {
	uiType: "contact-field",
	label: "Contact Number",
	placeholder: "Enter your contact number",
};

export const WithSearch = DefaultStoryTemplate<IContactFieldSchema>("contact-with-search").bind({});
WithSearch.args = {
	uiType: "contact-field",
	label: "Contact Number",
	enableSearch: true,
};

export const FixedCountry = DefaultStoryTemplate<IContactFieldSchema>("contact-fixed-country").bind({});
FixedCountry.args = {
	uiType: "contact-field",
	label: "Contact Number",
	validation: [
		{
			contactNumber: {
				internationalNumber: "Ireland",
			},
		},
	],
};

export const SGNumberValidation = DefaultStoryTemplate<IContactFieldSchema>("contact-singapore-number").bind({});
SGNumberValidation.args = {
	uiType: "contact-field",
	label: "Contact Number",
	validation: [
		{
			contactNumber: {
				singaporeNumber: "default",
			},
		},
	],
};

export const SGHouseNumberValidation = DefaultStoryTemplate<IContactFieldSchema>("contact-singapore-house-number").bind(
	{}
);
SGHouseNumberValidation.args = {
	uiType: "contact-field",
	label: "Contact Number",
	validation: [
		{
			contactNumber: {
				singaporeNumber: "house",
			},
		},
	],
};

export const SGPhoneNumberValidation = DefaultStoryTemplate<IContactFieldSchema>(
	"contact-singapore-mobile-number"
).bind({});
SGPhoneNumberValidation.args = {
	uiType: "contact-field",
	label: "Contact Number",
	validation: [
		{
			contactNumber: {
				singaporeNumber: "mobile",
			},
		},
	],
};

export const InternationalNumberValidation = DefaultStoryTemplate<IContactFieldSchema>(
	"contact-international-number"
).bind({});
InternationalNumberValidation.args = {
	uiType: "contact-field",
	label: "Contact Number",
	validation: [
		{
			contactNumber: {
				internationalNumber: true,
			},
		},
	],
};

export const Reset = ResetStoryTemplate<IContactFieldSchema>("contact-reset").bind({});
Reset.args = {
	uiType: "contact-field",
	label: "Contact Number",
};

export const ResetWithDefaultValues = ResetStoryTemplate<IContactFieldSchema>("contact-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "contact-field",
	label: "Contact Number",
	defaultValues: "91234567",
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
