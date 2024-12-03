import { LocalDate } from "@js-joda/core";
import { Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { FrontendEngine } from "../../../components";
import { TFrontendEngineFieldSchema } from "../../../components/frontend-engine";
import { SUBMIT_BUTTON_SCHEMA } from "../../common";

const meta: Meta = {
	title: "Form/Conditional Rendering/Rules/Dates",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Conditional Rendering for Dates</Title>
					<p>These rendering rules are for dates only.</p>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		intro: { table: { disable: true } },
		field1: { table: { disable: true } },
		field2: { table: { disable: true } },
		"submit-button": { table: { disable: true } },
	},
};
export default meta;

const Template: StoryFn<Record<string, TFrontendEngineFieldSchema>> = (args) => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						...args,
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
		}}
	/>
);

export const WithinDays = Template.bind({});
WithinDays.args = {
	intro: {
		uiType: "div",
		className: "margin-bottom-1",
		children: "Show field 2 as long as field 1 is within 5 days from today",
	},
	field1: {
		label: {
			mainLabel: "Field 1",
		},
		uiType: "date-field",
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [
			{
				field1: [{ filled: true }, { withinDays: { numberOfDays: 5 } }],
			},
		],
		validation: [{ required: true }],
	},
};

export const WithinDaysFromDate = Template.bind({});
WithinDaysFromDate.args = {
	intro: {
		uiType: "div",
		className: "margin-bottom-1",
		children: `Show field 2 as long as field 1 is within 5 days after ${LocalDate.now().minusMonths(1).toString()}`,
	},
	field1: {
		label: {
			mainLabel: "Field 1",
		},
		uiType: "date-field",
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [
			{
				field1: [
					{ filled: true },
					{ withinDays: { numberOfDays: 5, fromDate: LocalDate.now().minusMonths(1).toString() } },
				],
			},
		],
		validation: [{ required: true }],
	},
};

export const WithinDaysDateFormat = Template.bind({});
WithinDaysDateFormat.args = {
	intro: {
		uiType: "div",
		className: "margin-bottom-1",
		children: "Show field 2 as long as field 1 is within 5 days from today using custom date format",
	},
	field1: {
		label: {
			mainLabel: "Field 1",
			subLabel: "Current date format is set d/M/uuuu",
		},
		uiType: "date-field",
		dateFormat: "d/M/uuuu",
		validation: [{ required: true }],
	},
	field2: {
		label: {
			mainLabel: "Field 2",
			subLabel: "DateFormat in Field 2 need to be the same with Field 1",
		},
		uiType: "text-field",
		showIf: [
			{
				field1: [{ filled: true }, { withinDays: { numberOfDays: 5, dateFormat: "d/M/uuuu" } }],
			},
		],
		validation: [{ required: true }],
	},
};
WithinDaysDateFormat.storyName = "Within Days with Date Format";

export const BeyondDays = Template.bind({});
BeyondDays.args = {
	intro: {
		uiType: "div",
		className: "margin-bottom-1",
		children: "Show field 2 as long as field 1 is not within 5 days after today",
	},
	field1: {
		label: {
			mainLabel: "Field 1",
		},
		uiType: "date-field",
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [
			{
				field1: [{ filled: true }, { beyondDays: { numberOfDays: 5 } }],
			},
		],
		validation: [{ required: true }],
	},
};

export const BeyondDaysFromDate = Template.bind({});
BeyondDaysFromDate.args = {
	intro: {
		uiType: "div",
		className: "margin-bottom-1",
		children: `Show field 2 as long as field 1 is not within 5 days after ${LocalDate.now()
			.minusMonths(1)
			.toString()}`,
	},
	field1: {
		label: {
			mainLabel: "Field 1",
		},
		uiType: "date-field",
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [
			{
				field1: [
					{ filled: true },
					{ beyondDays: { numberOfDays: 5, fromDate: LocalDate.now().minusMonths(1).toString() } },
				],
			},
		],
		validation: [{ required: true }],
	},
};

export const BeyondDaysDateFormat = Template.bind({});
BeyondDaysDateFormat.args = {
	intro: {
		uiType: "div",
		className: "margin-bottom-1",
		children: "Show field 2 as long as field 1 is not within 5 days from today using custom date format",
	},
	field1: {
		label: {
			mainLabel: "Field 1",
			subLabel: "Current date format is set d/M/uuuu",
		},
		uiType: "date-field",
		dateFormat: "d/M/uuuu",
		validation: [{ required: true }],
	},
	field2: {
		label: {
			mainLabel: "Field 2",
			subLabel: "DateFormat in Field 2 need to be the same with Field 1",
		},
		uiType: "text-field",
		showIf: [
			{
				field1: [{ filled: true }, { beyondDays: { numberOfDays: 5, dateFormat: "d/M/uuuu" } }],
			},
		],
		validation: [{ required: true }],
	},
};
WithinDaysDateFormat.storyName = "Within Days with Date Format";
