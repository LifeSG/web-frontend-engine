import { Button } from "@lifesg/react-design-system/button";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useRef } from "react";
import { IFileUploadSchema, IFileUploadValue, TFileUploadErrorMessage } from "../../../components/fields/file-upload";
import { IFrontendEngineRef } from "../../../components/frontend-engine/types";
import {
	CommonFieldStoryProps,
	DefaultStoryTemplate,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
	WarningStoryTemplate,
} from "../../common";
import { jpgDataURL } from "../image-upload/image-data-url";

const meta: Meta = {
	title: "Field/FileUpload",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>FileUpload</Title>
					<p>This component allows users to upload files via drag & drop or file selection.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("file-upload"),
		label: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		capture: {
			description:
				"Whether to allow image to be taken by device and which camera to do so. Based on HTML capture attribute, for more info, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture",
			table: {
				type: {
					summary: "boolean | user | environment",
				},
			},
			options: [true, false, "user", "environment"],
			control: {
				type: "select",
			},
		},
		compressImages: {
			type: { name: "boolean", required: false },
			defaultValue: false,
			description:
				"Whether to compress image if file size exceeds `maxSizeInKb`. Supported image types: `png`, `jpg`, `gif`",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		description: {
			description: "Extra line of copy underneath label",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		disabled: {
			description: "Prevents adding and deleting files. Upload and delete buttons are disabled.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		hideThumbnail: {
			description: "For image files, hide the image preview thumbnail",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		readOnly: {
			description: "Prevents adding and deleting files. Upload and delete buttons are hidden.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "false" },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		styleType: {
			description: "Whether to render a border around the component",
			table: {
				type: {
					summary: "bordered | no-border",
				},
				defaultValue: { summary: "bordered" },
			},
			options: ["bordered", "no-border"],
			control: {
				type: "select",
			},
		},
		uploadOnAddingFile: {
			type: { name: "object", value: {} },
			description:
				"<div>API to POST to on adding file. This can be used to do AV scan and upload to server afterwards.<br><br></div><ul><li>type: upload as `base64` or `multipart` content-type. For multipart upload, API response should contain the url of the uploaded file `fileUrl`. The url will be submitted as part of the field values.</li><li>url: API endpoint to call.</li><li>headers (optional): Additional Axios headers.</li><li>sessionId: To indicate which session it belongs to.</li></ul><div><br><br>API response can optionally include additional file metadata, these values are particularly useful when prefilling default values without `dataURL` or `fileUrl`. The expected format is a JSON object containing the following keys:</div><ul><li>`mimeType`: MIME type of the file (e.g., 'image/jpeg'). Used for file type validation and display.</li><li>`ext`: File extension (e.g., 'jpg', 'png'). Used for file type identification.</li><li>`fileSize`: Size of the file in bytes. Used for file size validation and display.</li></ul><div>Alternatively, you may provide the JSON nested in a `data` object. See <a href='./?path=/story/field-fileupload--default-value-without-image'>DefaultValueWithoutImage example</a> and <a href='./?path=/story/field-fileupload--default-value-with-nested-response'>DefaultValueWithNestedResponse example</a>.</div>",
			table: {
				type: {
					summary:
						'{ type: base64|multipart, url: string, headers?: AxiosRequestConfig["headers"], sessionId?: string | undefined}',
				},
				defaultValue: { summary: null },
			},
		},
		warning: {
			description: "Copy that is rendered as `Alert` underneath the description",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
	},
};
export default meta;

const COMMON_STORY_ARGS: IFileUploadSchema = {
	label: "Upload",
	uiType: "file-upload",
	uploadOnAddingFile: {
		type: "base64",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const Default = DefaultStoryTemplate<IFileUploadSchema>("upload-default").bind({});
Default.args = {
	...COMMON_STORY_ARGS,
};

export const Customisation = DefaultStoryTemplate<IFileUploadSchema>("upload-customisation").bind({});
Customisation.args = {
	...COMMON_STORY_ARGS,
	label: "Label <strong>with bold text</strong>",
	description: "Description <strong>with bold text</strong>",
	styleType: "no-border",
	warning: "Warning <a href='#'>with link</a>",
};

export const MultipartUpload = DefaultStoryTemplate<IFileUploadSchema>("upload-multipart").bind({});
MultipartUpload.args = {
	...COMMON_STORY_ARGS,
	uploadOnAddingFile: {
		type: "multipart",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const DefaultValue = DefaultStoryTemplate<IFileUploadSchema, IFileUploadValue[]>("upload-default-value").bind(
	{}
);
DefaultValue.args = {
	...COMMON_STORY_ARGS,
	defaultValues: [
		{
			fileId: "file-1",
			fileName: "test.jpg",
			dataURL: jpgDataURL,
		},
	],
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary:
					"{ dataURL?: string; fileId?: string; fileName: string; fileUrl?: string; uploadResponse?: unknown }[]",
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const DefaultValueWithoutImage = DefaultStoryTemplate<IFileUploadSchema, IFileUploadValue[]>(
	"upload-default-value-without-image"
).bind({});
DefaultValueWithoutImage.args = {
	...COMMON_STORY_ARGS,
	description:
		"Prefilling without <code>fileUrl</code> and <code>dataURL</code>, the file size and mime type are derived from <code>uploadResponse</code>",
	uploadOnAddingFile: {
		type: "base64",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
	defaultValues: [
		{
			fileId: "0829ws801xcs9gkt5p3cnlg677ggwani9lldu22bv1xnfjd9jr1pja",
			fileName: "england-london-bridge.jpg",
			uploadResponse: {
				fileSize: 595705,
				mimeType: "image/jpeg",
			},
		},
	],
};
DefaultValueWithoutImage.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary:
					"{ dataURL?: string; fileId?: string; fileName: string; fileUrl?: string; uploadResponse?: unknown }[]",
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const DefaultValueWithNestedResponse = DefaultStoryTemplate<IFileUploadSchema, IFileUploadValue[]>(
	"upload-default-value-nested-response"
).bind({});
DefaultValueWithNestedResponse.args = {
	...COMMON_STORY_ARGS,
	description:
		"Prefilling without <code>fileUrl</code> and <code>dataURL</code>, the file size and mime type are derived from <code>uploadResponse.data</code>",
	uploadOnAddingFile: {
		type: "base64",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
	defaultValues: [
		{
			fileId: "nested-response-file-id",
			fileName: "document-with-nested-response.pdf",
			uploadResponse: {
				data: {
					fileSize: 2349231,
					mimeType: "application/pdf",
					ext: "pdf",
				},
			},
		},
	],
};
DefaultValueWithNestedResponse.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary:
					"{ dataURL?: string; fileId?: string; fileName: string; fileUrl?: string; uploadResponse?: { data?: { fileSize, mimeType, ext } } }[]",
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const WithValidation = DefaultStoryTemplate<IFileUploadSchema>("upload-with-validation").bind({});
WithValidation.args = {
	...COMMON_STORY_ARGS,
	description: "Required field",
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<IFileUploadSchema>("upload-with-warning").bind({});
Warning.args = {
	...COMMON_STORY_ARGS,
};

/* eslint-disable react-hooks/rules-of-hooks */
const CustomErrorTemplate = () =>
	((args) => {
		const id = `file-upload-with-custom-error`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleSetCustomErrors = () => {
			const error: TFileUploadErrorMessage = {
				message: "Custom error message <strong>with bold text</strong>",
			};
			const files = formRef.current.getValues()[id] as IFileUploadValue[];

			if (files && files.length > 0) {
				error.fileErrors = {};

				files.forEach((file, index) => {
					error.fileErrors[file.fileId] = `Custom error message per file (${index})`;
				});
			}

			formRef.current.setErrors({ [id]: error });
		};

		return (
			<>
				<FrontendEngine
					ref={formRef}
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[id]: args,
									...SUBMIT_BUTTON_SCHEMA,
								},
							},
						},
					}}
				/>
				<Button.Default onClick={handleSetCustomErrors} style={{ marginTop: "2rem" }}>
					Set custom errors
				</Button.Default>
			</>
		);
	}) as StoryFn<IFileUploadSchema>;

export const CustomError = CustomErrorTemplate().bind({});
CustomError.args = {
	...COMMON_STORY_ARGS,
	description: `
	Set custom error using <em>TFileUploadErrorMessage</em>
	<ul>
		<li>Using <em>string</em> - sets field main field error</li>
		<li>
			Using <em>TFileUploadErrorObject</em> - sets both main field error and individual file errors
			<ul>
				<li><em>message</em>: main field error</li>
				<li><em>fileErrors</em>: record of individual file errors (key = file ID)</li>
			</ul>
		</li>
	</ul>
	`,
};

export const AcceptedFileTypes = DefaultStoryTemplate<IFileUploadSchema>("upload-file-type").bind({});
AcceptedFileTypes.args = {
	...COMMON_STORY_ARGS,
	description: "Accepts only png format",
	validation: [{ fileType: ["png"], errorMessage: "Accepts only png format" }],
};

export const Length = DefaultStoryTemplate<IFileUploadSchema>("upload-length").bind({});
Length.args = {
	...COMMON_STORY_ARGS,
	description: "Must upload 2 images and you will not be able to upload beyond 2 images",
	validation: [{ length: 2, errorMessage: "Must have 2 images" }],
};

export const MaxImages = DefaultStoryTemplate<IFileUploadSchema>("upload-max-images").bind({});
MaxImages.args = {
	...COMMON_STORY_ARGS,
	description: "Upload up to 2 images",
	validation: [{ max: 2, errorMessage: "Upload up to 2 images" }],
};

export const MaxFileSize = DefaultStoryTemplate<IFileUploadSchema>("upload-max-file-size").bind({});
MaxFileSize.args = {
	...COMMON_STORY_ARGS,
	description: "Max 100kb",
	validation: [{ maxSizeInKb: 100, errorMessage: "Max 100kb" }],
	compressImages: true,
};

export const HideThumbnail = DefaultStoryTemplate<IFileUploadSchema>("upload-hide-thumbnail").bind({});
HideThumbnail.args = {
	...COMMON_STORY_ARGS,
	description: "For image files, hide the image preview thumbnail",
	hideThumbnail: true,
};

export const Reset = ResetStoryTemplate<IFileUploadSchema>("upload-reset").bind({});
Reset.args = {
	...COMMON_STORY_ARGS,
};

export const ResetWithDefaultValues = ResetStoryTemplate<IFileUploadSchema, IFileUploadValue[]>(
	"upload-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	...COMMON_STORY_ARGS,
	defaultValues: [
		{
			fileId: "file-1",
			fileName: "test.jpg",
			dataURL: jpgDataURL,
		},
	],
};
ResetWithDefaultValues.argTypes = Reset.argTypes;

export const Overrides = OverrideStoryTemplate<IFileUploadSchema>("upload-overrides").bind({});
Overrides.args = {
	...COMMON_STORY_ARGS,
	overrides: {
		label: "Overridden",
		description: "Overridden description",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
