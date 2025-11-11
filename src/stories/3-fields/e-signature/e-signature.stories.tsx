import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IESignatureFieldSchema, IESignatureValue } from "../../../components/fields/e-signature-field";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";
import { signatureDataURL } from "./signature-data-url";

const meta: Meta = {
	title: "Field/ESignatureField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ESignatureField</Title>
					<p>A field that brings up a modal for user to draw his/her signature.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("e-signature-field"),
		label: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		description: {
			description: "Extra line of copy underneath the signature area",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		upload: {
			type: { name: "object", value: {} },
			description:
				"<div>API to POST to on adding file. This can be used to do AV scan and upload to server afterwards.<br><br></div><ul><li>type: upload as `base64` or `multipart` content-type. For multipart upload, API response should contain the url of the uploaded file `fileUrl`. The url will be submitted as part of the field values.</li><li>url: API endpoint to call.</li><li>headers (optional): Additional Axios headers.</li><li>sessionId (optional): To indicate which session it belongs to.</li></ul>",
			table: {
				type: {
					summary:
						'{ type: "base64" | "multipart", url: string, headers?: AxiosRequestConfig["headers"], sessionId?: string }',
				},
				defaultValue: { summary: null },
			},
		},
	},
};
export default meta;

const COMMON_STORY_ARGS: IESignatureFieldSchema = {
	label: "Signature",
	uiType: "e-signature-field",
	upload: {
		type: "base64",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const Default = DefaultStoryTemplate<IESignatureFieldSchema>("e-signature").bind({});
Default.args = {
	...COMMON_STORY_ARGS,
};

export const DefaultValue = DefaultStoryTemplate<IESignatureFieldSchema, IESignatureValue>(
	"e-signature-default-value"
).bind({});
DefaultValue.args = {
	...COMMON_STORY_ARGS,
	defaultValues: { fileId: "fileId", dataURL: signatureDataURL },
	validation: [{ required: true }],
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary:
					"{ dataURL?: string | undefined; fileId: string; fileUrl: string; uploadResponse?: unknown | undefined }",
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const DefaultValueMultipart = DefaultStoryTemplate<IESignatureFieldSchema, IESignatureValue>(
	"e-signature-default-value-multipart"
).bind({});
DefaultValueMultipart.args = {
	...COMMON_STORY_ARGS,
	defaultValues: {
		fileId: "fileId",
		fileUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Autograph_of_Benjamin_Franklin.svg/330px-Autograph_of_Benjamin_Franklin.svg.png",
		uploadResponse: { field: "example" },
	},
	upload: {
		type: "multipart",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const LabelCustomisation = DefaultStoryTemplate<IESignatureFieldSchema>("e-signature-label-customisation").bind(
	{}
);
LabelCustomisation.args = {
	...COMMON_STORY_ARGS,
	label: {
		mainLabel: "Label with <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const MultipartUpload = DefaultStoryTemplate<IESignatureFieldSchema>("e-signature-multipart").bind({});
MultipartUpload.args = {
	...COMMON_STORY_ARGS,
	upload: {
		type: "multipart",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const WithValidation = DefaultStoryTemplate<IESignatureFieldSchema>("e-signature-with-validation").bind({});
WithValidation.args = {
	...COMMON_STORY_ARGS,
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<IESignatureFieldSchema>("e-signature-with-warning").bind({});
Warning.args = {
	...COMMON_STORY_ARGS,
};

export const Reset = ResetStoryTemplate<IESignatureFieldSchema>("e-signature-reset").bind({});
Reset.args = {
	...COMMON_STORY_ARGS,
};

export const ResetWithDefaultValues = ResetStoryTemplate<IESignatureFieldSchema, IESignatureValue>(
	"e-signature-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	...COMMON_STORY_ARGS,
	defaultValues: { fileId: "fileId", dataURL: signatureDataURL, fileUrl: "url" },
};
ResetWithDefaultValues.argTypes = DefaultValue.argTypes;

export const Overrides = OverrideStoryTemplate<IESignatureFieldSchema>("e-signature-overrides").bind({});
Overrides.args = {
	...COMMON_STORY_ARGS,
	overrides: {
		label: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
