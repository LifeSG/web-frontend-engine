import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IHistogramSliderValue, ISelectHistogramSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/SelectHistogram",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>SelectHistogram</Title>
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
		...CommonFieldStoryProps("select-histogram"),
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

const BINS_DATA = [
	{ minValue: 0, count: 0 },
	{ minValue: 10, count: 35 },
	{ minValue: 20, count: 15 },
	{ minValue: 50, count: 20 },
	{ minValue: 70, count: 40 },
	{ minValue: 90, count: 50 },
];

export const Default = DefaultStoryTemplate<ISelectHistogramSchema>("select-histogram-default").bind({});
Default.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
};

export const DefaultValue = DefaultStoryTemplate<ISelectHistogramSchema, IHistogramSliderValue>(
	"select-histogram-default-value"
).bind({});
DefaultValue.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
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

export const Disabled = DefaultStoryTemplate<ISelectHistogramSchema>("select-histogram-disabled").bind({});
Disabled.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
	disabled: true,
};

export const Labels = DefaultStoryTemplate<ISelectHistogramSchema>("select-histogram-with-labels").bind({});
Labels.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
	customOptions: {
		rangeLabelPrefix: "$",
		rangeLabelSuffix: ".00",
	},
};

export const WithValidation = DefaultStoryTemplate<ISelectHistogramSchema>("select-histogram-with-validation").bind({});
WithValidation.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<ISelectHistogramSchema>("select-histogram-with-warning").bind({});
Warning.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
};

export const Reset = ResetStoryTemplate<ISelectHistogramSchema>("select-histogram-reset").bind({});
Reset.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
};

export const ResetWithDefaultValues = ResetStoryTemplate<ISelectHistogramSchema, IHistogramSliderValue>(
	"select-histogram-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
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

export const Overrides = OverrideStoryTemplate<ISelectHistogramSchema>("select-histogram-overrides").bind({});
Overrides.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	bins: BINS_DATA,
	interval: 10,
	overrides: {
		label: "Overridden",
		bins: BINS_DATA,
		interval: 5,
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
