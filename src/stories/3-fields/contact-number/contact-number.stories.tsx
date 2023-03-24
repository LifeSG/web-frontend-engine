import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IContactNumberSchema } from "../../../components/fields";
import { getCountries } from "../../../components/fields/contact-number/data";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, StyledForm, SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/ContactNumber",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ContactNumber</Title>
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
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("contact"),
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

const Template: Story<Record<string, IContactNumberSchema>> = (args) => (
	<StyledForm data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	"contact-default": {
		uiType: "contact",
		label: "Contact Number",
	},
};

export const DefaultCountry = Template.bind({});
DefaultCountry.args = {
	"contact-default-country": {
		uiType: "contact",
		label: "Contact Number",
		country: "Japan",
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			fields: {
				"contact-default-value": {
					uiType: "contact",
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
		uiType: "contact",
		label: "Contact Number",
		disabled: true,
	},
};

export const Placeholder = Template.bind({});
Placeholder.args = {
	"contact-placeholder": {
		uiType: "contact",
		label: "Contact Number",
		placeholder: "Enter your contact number",
	},
};

export const WithSearch = Template.bind({});
WithSearch.args = {
	"contact-with-search": {
		uiType: "contact",
		label: "Contact Number",
		enableSearch: true,
	},
};

export const SGNumberValidation = Template.bind({});
SGNumberValidation.args = {
	"contact-singapore-number": {
		uiType: "contact",
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
		uiType: "contact",
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
		uiType: "contact",
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
		uiType: "contact",
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
