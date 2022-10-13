import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React, { useState } from "react";
import { FrontendEngine, ITextareaSchema, TextArea } from "../../..";
import { ExcludeReactFormHookProps } from "../../common";

export default {
	title: "Field/TextArea",
	component: TextArea,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>TextArea</Title>
					<Description>
						A form element that renders a multi-line textarea component with optional suggestion pills
					</Description>
					<Heading>Props</Heading>
					<Description>
						This component also inherits the
						[HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)
						attributes.
					</Description>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...ExcludeReactFormHookProps,
		schema: {
			description: "Defined JSON schema props",
			table: {
				type: {
					summary: "ITextareaProps",
					required: true,
					detail: `
{
	id: string;
	maxLength?: number;
	chipTexts?: string[];
	chipPosition?: "top" | "bottom";
	resizable?: boolean;
	rows?: number;
}`,
				},
			},
		},
	},
} as Meta;

const Template: Story<ITextareaSchema> = (args) => (
	<FrontendEngine
		id="frontendEngine"
		validationMode="onSubmit"
		data={{
			fields: [args],
		}}
	/>
);

export const Default = Template.bind({});
Default.args = {
	type: "TEXTAREA",
	id: "textarea-default",
	title: "Textarea",
};

export const WithCounter = Template.bind({});
WithCounter.args = {
	type: "TEXTAREA",
	id: "textarea-with-counter",
	title: "Textarea with counter",
	maxLength: 5,
};

export const AllowResize = Template.bind({});
AllowResize.args = {
	type: "TEXTAREA",
	id: "textarea-allow-resize",
	title: "Resizable textarea",
	resizable: true,
	rows: 3,
};

export const WithPills = Template.bind({});
WithPills.args = {
	type: "TEXTAREA",
	id: "textarea-with-pills",
	title: "Textarea with pills",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
};

export const WithPillsBottom = Template.bind({});
WithPillsBottom.storyName = "With Pills (Bottom)";
WithPillsBottom.args = {
	type: "TEXTAREA",
	id: "textarea-with-pills-bottom",
	title: "Textarea with pills at the bottom",
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
	chipPosition: "bottom",
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	type: "TEXTAREA",
	id: "textarea-with-validation",
	title: "Textarea with validation",
	validation: [{ required: true }, { min: 3, errorMessage: "Min. 3 characters" }],
};
