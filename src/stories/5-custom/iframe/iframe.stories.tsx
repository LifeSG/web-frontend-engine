import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryObj } from "@storybook/react";
import { IIframeSchema } from "../../../components/custom/iframe/types";
import {
	CommonCustomStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
} from "../../common";
import { ChildDefault, ChildResize, ChildValidateSubmission, ChildValidation } from "./doc-elements";

const meta: Meta = {
	title: "Custom/Iframe",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Iframe</Title>
					<p>Serves external content through an iframe.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Example" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryProps("iframe"),
		label: { table: { disable: true } },
		validationTimeout: {
			description:
				"Max. duration in seconds before a validation attempt is considered invalid. Use -1 to skip validation.",
			table: {
				type: {
					summary: "number",
				},
				defaultValue: { summary: "2000" },
			},
		},
		src: {
			description: "URL of the page to serve in the component.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: null },
			},
		},
	},
};
export default meta;

const host = `${window.location.protocol}//${window.location.host}`;

export const Default = DefaultStoryTemplate<IIframeSchema>("iframe-default").bind({});
Default.args = {
	referenceKey: "iframe",
	validationTimeout: -1,
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--default-child`,
};
export const DefaultChild: StoryObj = {
	render: () => <ChildDefault />,
	tags: ["!autodocs", "!dev"],
};

export const Validation = DefaultStoryTemplate<IIframeSchema>("iframe-validation").bind({});
Validation.args = {
	referenceKey: "iframe",
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--validation-child`,
};
Validation.tags = ["!autodocs"];
export const ValidationChild: StoryObj = {
	render: () => <ChildValidation />,
	tags: ["!autodocs", "!dev"],
};

export const Resize = DefaultStoryTemplate<IIframeSchema>("iframe-resize", true).bind({});
Resize.args = {
	referenceKey: "iframe",
	validationTimeout: -1,
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--resize-child`,
};
Resize.tags = ["!autodocs"];
export const ResizeChild: StoryObj = {
	render: () => <ChildResize />,
	tags: ["!autodocs", "!dev"],
};

export const DetectSubmission = DefaultStoryTemplate<IIframeSchema>("iframe-submission").bind({});
DetectSubmission.args = {
	referenceKey: "iframe",
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--detect-submission-child`,
};
DetectSubmission.tags = ["!autodocs"];
export const DetectSubmissionChild: StoryObj = {
	render: () => <ChildValidateSubmission />,
	tags: ["!autodocs", "!dev"],
};

export const DefaultValue = DefaultStoryTemplate<IIframeSchema>("iframe-default-value").bind({});
DefaultValue.args = {
	referenceKey: "iframe",
	validationTimeout: -1,
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--default-child`,
	defaultValues: "hello world",
};
DefaultValue.tags = ["!autodocs"];

export const Reset = ResetStoryTemplate<IIframeSchema>("iframe-reset").bind({});
Reset.args = {
	referenceKey: "iframe",
	validationTimeout: -1,
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--default-child`,
};
Reset.tags = ["!autodocs"];

export const ResetWithDefaultValues = ResetStoryTemplate<IIframeSchema>("iframe-reset").bind({});
ResetWithDefaultValues.args = {
	referenceKey: "iframe",
	validationTimeout: -1,
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--default-child`,
	defaultValues: "hello world",
};
ResetWithDefaultValues.tags = ["!autodocs"];

export const Overrides = OverrideStoryTemplate<IIframeSchema>("iframe-overrides").bind({});
Overrides.args = {
	referenceKey: "iframe",
	validationTimeout: -1,
	style: { border: "1px solid blue" },
	src: `${host}/iframe.html?viewMode=story&id=custom-iframe--default-child`,
	overrides: {
		style: { border: "1px solid red" },
	},
};
Overrides.tags = ["!autodocs"];
Overrides.argTypes = OVERRIDES_ARG_TYPE;
