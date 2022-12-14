import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import styled from "styled-components";
import { FrontendEngine } from "../../../components";
import { IImageUploadSchema } from "../../../components/fields";
import { CommonFieldStoryProps, ExcludeReactFormHookProps, SubmitButtonStorybook } from "../../common";
import { jpgDataURL } from "./image-data-url";

export default {
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
		...ExcludeReactFormHookProps,
		...CommonFieldStoryProps("image-upload"),
		upload: { table: { disable: true } },
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
		copies: {
			description: "Text for various UI elements in the field",
			defaultValue: { buttonAdd: "Add photos", dragHint: "Drop photos here", dropHint: "or drop them here" },
			table: {
				type: {
					summary: "object",
				},
			},
			type: { name: "object", value: {} },
		},
		"copies.buttonAdd": {
			description: "Text for upload button",
			defaultValue: "Add photos",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "Add photos" },
			},
			control: {
				type: null,
			},
		},
		"copies.dragHint": {
			description: "Text that will appear when dragging an image to the drop area",
			defaultValue: "Drop photos here",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "Drop photos here" },
			},
			control: {
				type: null,
			},
		},
		"copies.dropHint": {
			description: "Text that will appear beneath the upload button",
			defaultValue: "or drop them here",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "or drop them here" },
			},
			control: {
				type: null,
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
		uploadOnAdd: {
			type: { name: "object", value: {} },
			defaultValue: { url: "", method: "post" },
			description:
				"Whether upload to API on adding file / after editing image, this can be used to do AV scan of the added file.",
			table: {
				type: {
					summary: "object",
				},
				defaultValue: { summary: null },
			},
		},
		"uploadOnAddingFile.method": {
			type: { name: "string", required: false },
			defaultValue: null,
			description: "HTTP method.",
			table: {
				type: {
					summary: ["post", "get", "put", "patch"],
				},
				defaultValue: { summary: null },
			},
			control: {
				type: null,
			},
		},
		"uploadOnAddingFile.url": {
			type: { name: "string", required: false },
			defaultValue: null,
			description: "API endpoint to upload to.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: null },
			},
			control: {
				type: null,
			},
		},
	},
} as Meta;

const Template: Story<Record<string, IImageUploadSchema>> = (args) => (
	<StyledForm data={{ fields: { ...args, ...SubmitButtonStorybook } }} />
);

export const Default = Template.bind({});
Default.args = {
	upload: {
		label: "Provide images",
		fieldType: "image-upload",
	},
};

export const DefaultValue = () => (
	<StyledForm
		data={{
			fields: {
				"upload-default-value": {
					label: "Provide images",
					fieldType: "image-upload",
				},
				...SubmitButtonStorybook,
			},
			defaultValues: {
				"upload-default-value": [
					{
						fileName: "test.jpg",
						dataURL: jpgDataURL,
					},
				],
			},
		}}
	/>
);
DefaultValue.parameters = { controls: { hideNoControlsWarning: true } };

export const AcceptedFileTypes = Template.bind({});
AcceptedFileTypes.args = {
	"upload-file-type": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Accepts only png format",
		validation: [{ fileType: ["png"], errorMessage: "Accepts only png format" }],
	},
};

export const Compress = Template.bind({});
Compress.args = {
	"upload-compress": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Compress to 100kb",
		compress: true,
		validation: [{ maxSize: 100 }],
	},
};

export const Copies = Template.bind({});
Copies.args = {
	"upload-copies": {
		label: "This is the label",
		description: "This is the description",
		fieldType: "image-upload",
		copies: {
			buttonAdd: "Add",
			dragAndDropHint: "Drag and drop hint",
			inputHint: "Input hint",
		},
	},
};

export const Dimensions = Template.bind({});
Dimensions.args = {
	"upload-dimensions": {
		label: "Provide images",
		description: "Outputs image at 250x250, you can verify by inspecting the thumbnail generated or review modal",
		fieldType: "image-upload",
		editImage: true,
		compress: true,
		dimensions: { width: 250, height: 250 },
	},
};

export const EditImage = Template.bind({});
EditImage.args = {
	"upload-edit-image": {
		label: "Provide images",
		description: "Brings up the image review modal on selecting an image",
		fieldType: "image-upload",
		editImage: true,
	},
};

export const Length = Template.bind({});
Length.args = {
	"upload-length": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Must upload 2 images and you will not be able to upload beyond 2 images",
		validation: [{ length: 2, errorMessage: "Must have 2 images" }],
	},
};

export const MaxImages = Template.bind({});
MaxImages.args = {
	"upload-max-images": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Upload up to 2 images",
		validation: [{ max: 2, errorMessage: "Upload up to 2 images" }],
	},
};

export const MaxFileSize = Template.bind({});
MaxFileSize.args = {
	"upload-max-file-size": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Max 100kb",
		validation: [{ maxSize: 100, errorMessage: "Max 100kb" }],
	},
};

export const OutputType = Template.bind({});
OutputType.args = {
	"upload-output-type": {
		label: "Provide images",
		description: "Outputs in PNG format, you can verify by inspecting the thumbnail generated",
		fieldType: "image-upload",
		outputType: "png",
	},
};

export const UploadOnAdd = Template.bind({});
UploadOnAdd.args = {
	"upload-on-add": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Uploads image via API after adding image",
		uploadOnAdd: {
			method: "post",
			url: "https://jsonplaceholder.typicode.com/posts",
		},
	},
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	"upload-with-validation": {
		label: "Provide images",
		fieldType: "image-upload",
		description: "Required field",
		validation: [{ required: true }],
	},
};

const StyledForm = styled(FrontendEngine)`
	width: 500px;
	margin: 0 auto;
`;
