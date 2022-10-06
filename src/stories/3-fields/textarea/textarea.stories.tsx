import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import React, { useState } from "react";
import { FrontendEngine, ITextareaProps, TextArea } from "../../..";
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

const Template: Story<ITextareaProps> = (args) => {
	return <TextArea schema={args} />;
};

export const Default = Template.bind({});
Default.args = {};

export const WithCounter = Template.bind({});
WithCounter.decorators = [
	() => {
		const [value, setValue] = useState("");

		return (
			<TextArea
				schema={{ id: "with-counter", maxLength: 100 }}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		);
	},
];

export const AllowResize = Template.bind({});
AllowResize.args = {
	resizable: true,
	rows: 3,
};

export const WithPills = Template.bind({});
WithPills.args = {
	chipTexts: ["Pill 1", "Pill 2", "Pill 3"],
	chipPosition: "top",
};

export const JSONSchema = Template.bind({});
JSONSchema.decorators = [
	() => (
		<FrontendEngine
			id="TextArea"
			validationMode="onSubmit"
			data={{
				fields: [
					{
						id: "example",
						title: "text-area-with-chips",
						type: "TEXTAREA",
						validation: ["required"],
						chipTexts: ["chip1", "chip2"],
						maxLength: 100,
						rows: 3,
						resizable: false,
						chipPosition: "top",
					},
				],
			}}
		/>
	),
];

JSONSchema.parameters = {
	docs: {
		description: { story: "Define through JSON schema" },
	},
};
