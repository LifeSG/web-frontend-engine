import { ArgTypes, Heading, Stories, Title } from "@storybook/addon-docs";
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
					<p>
						This component allows to show a lower limit and upper limit from a bin of numeric data values in
						a dropdown list.
					</p>
					<Heading>Props</Heading>
					<ArgTypes of={Default} />
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
		histogramSlider: {
			description:
				"Use `bins` and `interval` to initialize histogram slider<br><ul><li>`bins`: A list of histogram bins grouped by their lower limit</li><li>`interval`: The upper limit of each bin</li></ul>",
			table: {
				type: {
					summary: `{bins: HistogramBinProps[], interval: number}`,
				},
			},
			type: { name: "object", value: {} },
		},
		customOptions: {
			description: "<ul><li>Use `rangeLabelPrefix` and `rangeLabelSuffix` to customize the labels</li></ul>",
			table: {
				type: {
					summary: `{  rangeLabelPrefix?: string; rangeLabelSuffix?: string; }`,
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
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
};

export const DefaultValue = DefaultStoryTemplate<ISelectHistogramSchema, IHistogramSliderValue>(
	"select-histogram-default-value"
).bind({});
DefaultValue.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
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
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
	disabled: true,
};

export const Labels = DefaultStoryTemplate<ISelectHistogramSchema>("select-histogram-with-labels").bind({});
Labels.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
	customOptions: {
		rangeLabelPrefix: "$",
		rangeLabelSuffix: ".00",
	},
};

export const WithValidation = DefaultStoryTemplate<ISelectHistogramSchema>("select-histogram-with-validation").bind({});
WithValidation.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<ISelectHistogramSchema>("select-histogram-with-warning").bind({});
Warning.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
};

export const Reset = ResetStoryTemplate<ISelectHistogramSchema>("select-histogram-reset").bind({});
Reset.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
};

export const ResetWithDefaultValues = ResetStoryTemplate<ISelectHistogramSchema, IHistogramSliderValue>(
	"select-histogram-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	uiType: "select-histogram",
	label: "Price of fruits",
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
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
	histogramSlider: {
		bins: BINS_DATA,
		interval: 10,
	},
	overrides: {
		label: "Overridden",
		histogramSlider: {
			bins: BINS_DATA,
			interval: 5,
		},
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
