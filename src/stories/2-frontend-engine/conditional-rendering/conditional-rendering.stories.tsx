import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { TFrontendEngineFieldSchema } from "../../../components/frontend-engine";
import { SUBMIT_BUTTON_SCHEMA } from "../../common";

export default {
	title: "Form/Conditional Rendering/Rules",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Conditional Rendering</Title>
					<Description>
						Show/hide fields according to rules provided via `showIf` key. Validation schema (if any)
						applies to fields as long as they are shown. When a field is hidden, its validation schema do
						not apply and the value is not submitted.
					</Description>
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

export const Filled = Template.bind({});
Filled.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is filled",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }] }],
		validation: [{ required: true }],
	},
};

export const Empty = Template.bind({});
Empty.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is empty",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ empty: true }] }],
		validation: [{ required: true }],
	},
};

export const Equals = Template.bind({});
Equals.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is Apple",
	},
	field1: {
		label: "Field 1",
		uiType: "select",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ equals: "Apple" }] }],
		validation: [{ required: true }],
	},
};

export const NotEquals = Template.bind({});
NotEquals.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 is not Apple",
	},
	field1: {
		label: "Field 1",
		uiType: "select",
		options: [
			{ label: "Apple", value: "Apple" },
			{ label: "Berry", value: "Berry" },
			{ label: "Cherry", value: "Cherry" },
		],
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { notEquals: "Apple" }] }],
		validation: [{ required: true }],
	},
	...SUBMIT_BUTTON_SCHEMA,
};

export const AndConditions = Template.bind({});
AndConditions.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 3 as long as field 1 AND 2 are filled",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field3: {
		label: "Field 3",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }], field2: [{ filled: true }] }],
		validation: [{ required: true }],
	},
};

export const OrConditions = Template.bind({});
OrConditions.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 3 as long as field 1 OR 2 is filled",
	},
	field1: {
		label: "Field 1",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		validation: [{ required: true }],
	},
	field3: {
		label: "Field 3",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }] }, { field2: [{ filled: true }] }],
		validation: [{ required: true }],
	},
};
