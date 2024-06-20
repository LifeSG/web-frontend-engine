import { Button } from "@lifesg/react-design-system/button";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useRef } from "react";
import { IFrontendEngineRef } from "../../../components";
import { IImageUploadSchema } from "../../../components/fields";
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
import { jpgDataURL } from "./image-data-url";

const meta: Meta = {
	title: "Field/ImageUpload",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ImageUpload</Title>
					<Description>
						This component accepts images through drag &amp; drop / file select. It can optionally allow
						annotation and will submit as base64 image.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("image-upload"),
		label: {
			description: "A name/description of the purpose of the form element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		buttonLabel: {
			type: { name: "string", required: false },
			description: "Text for upload button",
			defaultValue: "Add photos",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		compress: {
			type: { name: "boolean", required: false },
			defaultValue: false,
			description: "Whether to compress image if file size exceeds `maxSizeInKb`.",
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
			description: "Extra line of copy underneath title",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		dimensions: {
			type: { name: "object", value: {} },
			defaultValue: { width: 1000, height: 1000 },
			description:
				"Desired image dimensions allowed. Will resize image up/down to its longest side acording to this value. Requires `compress=true`",
			table: {
				type: {
					summary: "object",
				},
				defaultValue: { summary: "{ width: 1000, height: 1000 }" },
			},
		},
		editImage: {
			type: { name: "boolean" },
			defaultValue: false,
			description: "Whether to bring up review modal to allow user to draw on image.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			control: {
				type: "boolean",
			},
		},
		outputType: {
			type: { name: "string", required: false },
			defaultValue: "jpg",
			description: "Image format to output as.",
			table: {
				type: {
					summary: ["jpg", "png"],
				},
				defaultValue: { summary: "jpg" },
			},
			options: ["jpg", "png"],
			control: {
				type: "select",
			},
		},
		uploadOnAddingFile: {
			type: { name: "object", value: {} },
			defaultValue: { url: "", method: "post" },
			description:
				"<div>Whether upload to API on adding file / after editing image, this can be used to do AV scan of the added file.</div><ul><li>method: HTTP method.</li><li>url: API endpoint to upload to.</li></ul>",
			table: {
				type: {
					summary: "{ method: post|put|patch, url: string }",
				},
				defaultValue: { summary: null },
			},
		},
		capture: {
			type: { name: "string", required: false },
			description:
				"Whether to open user-facing (user) or outward-facing (environment) camera when Add photos button is pressed",
			table: {
				type: {
					summary: ["user", "environment"],
				},
				defaultValue: { summary: null },
			},
			options: ["user", "environment"],
			control: {
				type: "select",
			},
		},
		multiple: {
			type: { name: "boolean" },
			defaultValue: false,
			description: "Whether to allow user upload multiple images at once.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			control: {
				type: "boolean",
			},
		},
	},
};
export default meta;

export const Default = DefaultStoryTemplate<IImageUploadSchema>("upload").bind({});
Default.args = {
	label: "Provide images",
	uiType: "image-upload",
};

export const DefaultValue = DefaultStoryTemplate<IImageUploadSchema, { fileName: string; dataURL: string }[]>(
	"upload-default-value"
).bind({});
DefaultValue.args = {
	label: "Provide images",
	uiType: "image-upload",
	defaultValues: [
		{
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
				summary: "{ fileName: string; dataURL: string; }[]",
				value: {},
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const AcceptedFileTypes = DefaultStoryTemplate<IImageUploadSchema>("upload-file-type").bind({});
AcceptedFileTypes.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Accepts only png format",
	editImage: true,
	validation: [{ fileType: ["png"], errorMessage: "Accepts only png format" }],
};

export const ButtonLabel = DefaultStoryTemplate<IImageUploadSchema>("upload-button-label").bind({});
ButtonLabel.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Text for upload button",
	buttonLabel: "Okay",
};

export const HTMLDescription = DefaultStoryTemplate<IImageUploadSchema>("upload-compress").bind({});
HTMLDescription.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Testing<ul><li>Testing</li><li>Testing</li></span>",
};

export const Dimensions = DefaultStoryTemplate<IImageUploadSchema>("upload-dimensions").bind({});
Dimensions.args = {
	label: "Provide images",
	description: "Outputs image at 250x250, you can verify by inspecting the thumbnail generated or review modal",
	uiType: "image-upload",
	editImage: true,
	compress: true,
	dimensions: { width: 250, height: 250 },
};

export const EditImage = DefaultStoryTemplate<IImageUploadSchema>("upload-edit-image").bind({});
EditImage.args = {
	label: "Provide images",
	description: "Brings up the image review modal on selecting an image",
	uiType: "image-upload",
	editImage: true,
};

export const Length = DefaultStoryTemplate<IImageUploadSchema>("upload-length").bind({});
Length.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Must upload 2 images and you will not be able to upload beyond 2 images",
	validation: [{ length: 2, errorMessage: "Must have 2 images" }],
};

export const MaxImages = DefaultStoryTemplate<IImageUploadSchema>("upload-max-images").bind({});
MaxImages.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Upload up to 2 images",
	validation: [{ max: 2, errorMessage: "Upload up to 2 images" }],
};

export const MaxFileSize = DefaultStoryTemplate<IImageUploadSchema>("upload-max-file-size").bind({});
MaxFileSize.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Max 100kb",
	validation: [{ maxSizeInKb: 100, errorMessage: "Max 100kb" }],
};

export const OutputType = DefaultStoryTemplate<IImageUploadSchema>("upload-output-type").bind({});
OutputType.args = {
	label: "Provide images",
	description: "Outputs in PNG format, you can verify by inspecting the thumbnail generated",
	uiType: "image-upload",
	outputType: "png",
};

export const UploadOnAdd = DefaultStoryTemplate<IImageUploadSchema>("upload-on-add").bind({});
UploadOnAdd.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Uploads image via API after adding image",
	uploadOnAddingFile: {
		method: "post",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const WithValidation = DefaultStoryTemplate<IImageUploadSchema>("upload-with-validation").bind({});
WithValidation.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Required field",
	validation: [{ required: true }],
};

WithValidation.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Required field",
	validation: [{ required: true }],
};

export const Warning = WarningStoryTemplate<IImageUploadSchema>("upload-with-warning").bind({});
Warning.args = {
	label: "Provide images",
	uiType: "image-upload",
};

export const Reset = ResetStoryTemplate<IImageUploadSchema>("upload-reset").bind({});
Reset.args = {
	label: "Provide images",
	uiType: "image-upload",
};

export const ResetWithDefaultValues = ResetStoryTemplate<IImageUploadSchema, { fileName: string; dataURL: string }[]>(
	"upload-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	label: "Provide images",
	uiType: "image-upload",
	defaultValues: [
		{
			fileName: "test.jpg",
			dataURL: jpgDataURL,
		},
	],
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "{ fileName: string; dataURL: string; }[]",
				value: {},
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const Overrides = OverrideStoryTemplate<IImageUploadSchema>("upload-overrides").bind({});
Overrides.args = {
	uiType: "image-upload",
	label: "Provide images",
	overrides: {
		label: "Overridden",
		description: "Overridden to output as png format",
		outputType: "png",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const CaptureType = DefaultStoryTemplate<IImageUploadSchema>("upload-with-capture").bind({});
CaptureType.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Opens user-facing camera, should be verified using a mobile device",
	capture: "user",
};

export const Multiple = DefaultStoryTemplate<IImageUploadSchema>("upload-multiple-images").bind({});
Multiple.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Upload multiple images at once",
	multiple: true,
	editImage: true,
};
