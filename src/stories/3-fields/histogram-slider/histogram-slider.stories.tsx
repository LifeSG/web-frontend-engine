import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IHistogramSliderSchema, IHistogramSliderValue } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/HistogramSlider",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>HistogramSlider</Title>
					<Description>
						This component allows users to select a lower limit and upper limit from a bin of numeric data
						values.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("histogram-slider"),
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
		bins: {
			description: "A list of histogram bins grouped by their lower limit",
		},
		interval: {
			description: "The upper limit of each bin",
		},
		customOptions: {
			description:
				"<ul><li>`showRangeLabels` specifies if max and min labels are displayed.</li><br/><li>Use `rangeLabelPrefix` and `rangeLabelSuffix` to customise the labels</li></ul>",
			table: {
				type: {
					summary: `{ showRangeLabels?: boolean; rangeLabelPrefix?: string; rangeLabelSuffix?: string; }`,
				},
			},
			type: { name: "object", value: {} },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<IHistogramSliderSchema>("histogram-slider-default").bind({});
Default.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
};

export const DefaultValue = DefaultStoryTemplate<IHistogramSliderSchema, IHistogramSliderValue>(
	"histogram-slider-default-value"
).bind({});
DefaultValue.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
	defaultValues: { from: 0, to: 30 },
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "number",
			},
		},
	},
};

export const Disabled = DefaultStoryTemplate<IHistogramSliderSchema>("histogram-slider-disabled").bind({});
Disabled.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
	disabled: true,
};

export const Labels = DefaultStoryTemplate<IHistogramSliderSchema>("histogram-slider-with-labels").bind({});
Labels.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
	customOptions: {
		showRangeLabels: true,
		rangeLabelPrefix: "$",
		rangeLabelSuffix: ".00",
	},
};

export const WithValidation = DefaultStoryTemplate<IHistogramSliderSchema>("histogram-slider-with-validation").bind({});
WithValidation.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
	validation: [{ required: true }],
};

export const Reset = ResetStoryTemplate<IHistogramSliderSchema>("histogram-slider-reset").bind({});
Reset.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
};

export const ResetWithDefaultValues = ResetStoryTemplate<IHistogramSliderSchema, IHistogramSliderValue>(
	"histogram-slider-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
	defaultValues: { from: 0, to: 30 },
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

export const Overrides = OverrideStoryTemplate<IHistogramSliderSchema>("histogram-slider-overrides").bind({});
Overrides.args = {
	uiType: "histogram-slider",
	label: "Price of fruits",
	bins: [
		{ minValue: 0, count: 0 },
		{ minValue: 10, count: 2 },
		{ minValue: 20, count: 3 },
		{ minValue: 90, count: 8 },
	],
	interval: 10,
	overrides: {
		label: "Overridden",
		bins: [
			{ minValue: 0, count: 0 },
			{ minValue: 10, count: 2 },
			{ minValue: 20, count: 3 },
			{ minValue: 90, count: 8 },
		],
		interval: 5,
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
