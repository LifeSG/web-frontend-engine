import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { TFrontendEngineFieldSchema } from "../../../components/frontend-engine";
import { SubmitButtonStorybook } from "../../common";

export default {
	title: "Form/Conditional Rendering/Numbers",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Conditional Rendering for Numbers</Title>
					<Description>These rendering rules are for `numeric` type only.</Description>
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
} as Meta;

const Template: Story<Record<string, TFrontendEngineFieldSchema>> = (args) => (
	<FrontendEngine data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Min = Template.bind({});
Min.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is at least 5",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { min: 5 }] }],
		validation: [{ required: true }],
	},
};

export const Max = Template.bind({});
Max.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is at most 5",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { max: 5 }] }],
		validation: [{ required: true }],
	},
};

export const LessThan = Template.bind({});
LessThan.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is less than 5",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { lessThan: 5 }] }],
		validation: [{ required: true }],
	},
};

export const MoreThan = Template.bind({});
MoreThan.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is more than 5",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { moreThan: 5 }] }],
		validation: [{ required: true }],
	},
};

export const Positive = Template.bind({});
Positive.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is positive",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { positive: true }] }],
		validation: [{ required: true }],
	},
};

export const Negative = Template.bind({});
Negative.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is negative",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { negative: true }] }],
		validation: [{ required: true }],
	},
};

export const Integer = Template.bind({});
Integer.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is an integer",
	},
	field1: {
		label: "Field 1",
		uiType: "numeric-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { integer: true }] }],
		validation: [{ required: true }],
	},
};
