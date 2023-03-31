import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { FrontendEngine } from "../../../components";
import { TFrontendEngineFieldSchema } from "../../../components/frontend-engine";
import { SubmitButtonStorybook } from "../../common";

export default {
	title: "Form/Conditional Rendering/Arrays",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Conditional Rendering for Arrays</Title>
					<Description>These rendering rules are for `array` type only.</Description>
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
						...SubmitButtonStorybook,
					},
				},
			},
		}}
	/>
);

export const Length = Template.bind({});
Length.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 has exactly 2 items selected",
	},
	field1: {
		uiType: "multi-select",
		label: "Field 1",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { length: 2 }] }],
		validation: [{ required: true }],
	},
};

export const MinItems = Template.bind({});
MinItems.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 has at least 2 items selected",
	},
	field1: {
		uiType: "multi-select",
		label: "Field 1",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { min: 2 }] }],
		validation: [{ required: true }],
	},
};

export const MaxItems = Template.bind({});
MaxItems.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 has at most 2 items selected",
	},
	field1: {
		uiType: "multi-select",
		label: "Field 1",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { max: 2 }] }],
		validation: [{ required: true }],
	},
};

export const Includes = Template.bind({});
Includes.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 includes `Apple` and `Berry`",
	},
	field1: {
		uiType: "multi-select",
		label: "Field 1",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { includes: ["Apple", "Berry"] }] }],
		validation: [{ required: true }],
	},
};

export const Excludes = Template.bind({});
Excludes.args = {
	intro: {
		uiType: "div",
		className: "margin--bottom",
		children: "Show field 2 as long as field 1 excludes `Apple` and `Berry`",
	},
	field1: {
		uiType: "multi-select",
		label: "Field 1",
		options: [
			{ value: "Apple", label: "Apple" },
			{ value: "Berry", label: "Berry" },
			{ value: "Cherry", label: "Cherry" },
		],
	},
	field2: {
		label: "Field 2",
		uiType: "text-field",
		showIf: [{ field1: [{ filled: true }, { excludes: ["Apple", "Berry"] }] }],
		validation: [{ required: true }],
	},
};
