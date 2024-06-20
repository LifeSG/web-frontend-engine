import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ISliderSchema } from "../../../components/fields";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Field/Slider",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Slider</Title>
					<Description>This component allows users to select a value from a numeric range</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("slider"),
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
		customOptions: {
			description:
				"<ul><li>`showSliderLabels` specifies if max and min labels are displayed.</li><br/><li>Use `sliderLabelPrefix` and `sliderLabelSuffix` to customise the labels</li><br /> <li> `showIndicatorLabel` specifies if indicator will be displayed </li> <br/> <li> Use `indicatorLabelPrefix` and `indicatorLabelSuffix` to customise the indicator. </li> <br/> </ul>",
			table: {
				type: {
					summary: `{ showSliderLabels?: boolean; sliderLabelPrefix?: string; sliderLabelSuffix?: string; showIndicatorLabel?: boolean; indicatorLabelPrefix?: string; indicatorLabelSuffix?: string;  }`,
				},
			},
			type: { name: "object", value: {} },
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<ISliderSchema>("slider-default").bind({});
Default.args = {
	uiType: "slider",
	label: "Number of fruits",
};

export const DefaultValue = DefaultStoryTemplate<ISliderSchema, number>("slider-default-value").bind({});
DefaultValue.args = {
	uiType: "slider",
	label: "Number of fruits",
	defaultValues: 50,
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

export const Disabled = DefaultStoryTemplate<ISliderSchema>("slider-disabled").bind({});
Disabled.args = {
	uiType: "slider",
	label: "Number of fruits",
	disabled: true,
};

export const Labels = DefaultStoryTemplate<ISliderSchema>("slider-with-labels").bind({});
Labels.args = {
	uiType: "slider",
	label: "Price of fruits",
	customOptions: {
		showSliderLabels: true,
		sliderLabelPrefix: "$",
		sliderLabelSuffix: ".00",
		showIndicatorLabel: true,
		indicatorLabelPrefix: "Within $",
		indicatorLabelSuffix: ".00",
	},
};

export const RangeAndStep = DefaultStoryTemplate<ISliderSchema>("slider-with-range-and-step").bind({});
RangeAndStep.args = {
	uiType: "slider",
	label: "Number of fruits",
	validation: [{ min: 1 }, { max: 10 }, { increment: 0.5 }],
};

export const WithValidation = DefaultStoryTemplate<ISliderSchema>("slider-with-validation").bind({});
WithValidation.args = {
	uiType: "slider",
	label: "Number of fruits",
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<ISliderSchema>("slider-with-warning").bind({});
Warning.args = {
	uiType: "slider",
	label: "Number of fruits",
};

export const Reset = ResetStoryTemplate<ISliderSchema>("slider-reset").bind({});
Reset.args = {
	uiType: "slider",
	label: "Number of fruits",
};

export const ResetWithDefaultValues = ResetStoryTemplate<ISliderSchema, number>("slider-reset-default-values").bind({});
ResetWithDefaultValues.args = {
	uiType: "slider",
	label: "Number of fruits",
	defaultValues: 50,
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

export const Overrides = OverrideStoryTemplate<ISliderSchema>("slider-overrides").bind({});
Overrides.args = {
	uiType: "slider",
	label: "Number of fruits",
	overrides: {
		label: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
