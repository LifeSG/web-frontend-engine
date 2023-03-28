import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IContactFieldSchema } from "../../../components/fields";
import { getCountries } from "../../../components/fields/contact-field/data";
import { CommonFieldStoryProps, StyledForm, SubmitButtonStorybook } from "../../common";

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

const Template: Story<Record<string, IContactFieldSchema>> = (args) => (
	<StyledForm
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SubmitButtonStorybook,
					},
				},
			},
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	"contact-default": {
		uiType: "contact-field",
		label: "Contact Number",
	},
};

export const DefaultCountry = Template.bind({});
DefaultCountry.args = {
	"contact-default-country": {
		uiType: "contact-field",
		label: "Contact Number",
		country: "Japan",
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						"contact-default-value": {
							uiType: "contact-field",
							label: "Contact Number",
							validation: [
								{
									required: true,
									errorMessage: "Enter mobile number",
								},
								{
									contactNumber: {
										singaporeNumber: "default",
									},
									errorMessage: "Invalid mobile number. Try again.",
								},
							],
						},
						...SubmitButtonStorybook,
					},
				},
			},
			defaultValues: {
				"contact-default-value": "91234567",
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const Disabled = Template.bind({});
Disabled.args = {
	"contact-disabled": {
		uiType: "contact-field",
		label: "Contact Number",
		disabled: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"contact-placeholder": {
		uiType: "contact-field",
		label: "Contact Number",
		placeholder: "Enter your contact number",
	},
};

export const WithSearch = Template.bind({});
WithSearch.args = {
	"contact-with-search": {
		uiType: "contact-field",
		label: "Contact Number",
		enableSearch: true,
	},
};

export const SGNumberValidation = Template.bind({});
SGNumberValidation.args = {
	"contact-singapore-number": {
		uiType: "contact-field",
		label: "Contact Number",
		validation: [
			{
				contactNumber: {
					singaporeNumber: "default",
				},
			},
		],
	},
};

export const SGHouseNumberValidation = Template.bind({});
SGHouseNumberValidation.args = {
	"contact-singapore-house-number": {
		uiType: "contact-field",
		label: "Contact Number",
		validation: [
			{
				contactNumber: {
					singaporeNumber: "house",
				},
			},
		],
	},
};

export const SGPhoneNumberValidation = Template.bind({});
SGPhoneNumberValidation.args = {
	"contact-singapore-mobile-number": {
		uiType: "contact-field",
		label: "Contact Number",
		validation: [
			{
				contactNumber: {
					singaporeNumber: "mobile",
				},
			},
		],
	},
};

export const InternationalNumberValidation = Template.bind({});
InternationalNumberValidation.args = {
	"contact-international-number": {
		uiType: "contact-field",
		label: "Contact Number",
		validation: [
			{
				contactNumber: {
					internationalNumber: true,
				},
			},
		],
	},
};
