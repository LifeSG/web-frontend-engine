import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IContactFieldSchema } from "../../../components/fields";
import { getCountries } from "../../../components/fields/contact-field/data";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

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
				type: "select",
			},
			options: getCountries(),
		},
		enableSearch: {
			description: "Specifies if the given list of country codes can be searched",
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

const Template = (id: string) =>
	(({ defaultValues, ...args }) => {
		return (
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
		);
	}) as Story<IContactFieldSchema & { defaultValues?: string | undefined }>;

export const Default = Template("contact-default").bind({});
Default.args = {
	uiType: "contact-field",
	label: "Contact Number",
};

export const DefaultCountry = Template("contact-default-country").bind({});
DefaultCountry.args = {
	uiType: "contact-field",
	label: "Contact Number",
	country: "Japan",
};

export const DefaultValue = Template("contact-default-value").bind({});
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
		control: {
			type: "text",
		},
	},
};

export const Disabled = Template("contact-disabled").bind({});
Disabled.args = {
	uiType: "contact-field",
	label: "Contact Number",
	disabled: true,
};

export const Placeholder = Template("contact-placeholder").bind({});
Placeholder.args = {
	uiType: "contact-field",
	label: "Contact Number",
	placeholder: "Enter your contact number",
};

export const WithSearch = Template("contact-with-search").bind({});
WithSearch.args = {
	uiType: "contact-field",
	label: "Contact Number",
	enableSearch: true,
};

export const SGNumberValidation = Template("contact-singapore-number").bind({});
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

export const SGHouseNumberValidation = Template("contact-singapore-house-number").bind({});
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

export const SGPhoneNumberValidation = Template("contact-singapore-mobile-number").bind({});
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

export const FixedCountry = Template("contact-fixed-country").bind({});
FixedCountry.args = {
	uiType: "contact-field",
	label: "Contact Number",
	fixedCountry: true,
	validation: [
		{
			contactNumber: {
				internationalNumber: "Netherlands",
			},
		},
	],
};

export const InternationalNumberValidation = Template("contact-international-number").bind({});
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
