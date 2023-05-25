import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { IImageUploadSchema } from "../../../components/fields";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
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
		...CommonFieldStoryProps("image-upload"),
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
					summary: "{ method: post|get|put|patch, url: string }",
				},
				defaultValue: { summary: null },
			},
		},
	},
} as Meta;

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
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
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<IImageUploadSchema & { defaultValues?: unknown | undefined }>;

export const Default = Template("upload").bind({});
Default.args = {
	label: "Provide images",
	uiType: "image-upload",
};

export const DefaultValue = Template("upload-default-value").bind({});
DefaultValue.args = {
	label: "Provide images",
	uiType: "image-upload",
	defaultValues: {
		fileName: "test.jpg",
		dataURL: jpgDataURL,
	},
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "{ fileName: string; dataURL: string; }",
				value: {},
			},
		},
		control: {
			type: "object",
			value: {},
		},
	},
};

export const AcceptedFileTypes = Template("upload-file-type").bind({});
AcceptedFileTypes.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Accepts only png format",
	editImage: true,
	validation: [{ fileType: ["png"], errorMessage: "Accepts only png format" }],
};

export const ButtonLabel = Template("upload-button-label").bind({});
ButtonLabel.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Text for upload button",
	buttonLabel: "Okay",
};

export const HTMLDescription = Template("upload-compress").bind({});
HTMLDescription.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "<span>Testing<br>&#x2022; Testing<br>&#x2022; Testing</span>",
};

export const Dimensions = Template("upload-dimensions").bind({});
Dimensions.args = {
	label: "Provide images",
	description: "Outputs image at 250x250, you can verify by inspecting the thumbnail generated or review modal",
	uiType: "image-upload",
	editImage: true,
	compress: true,
	dimensions: { width: 250, height: 250 },
};

export const EditImage = Template("upload-edit-image").bind({});
EditImage.args = {
	label: "Provide images",
	description: "Brings up the image review modal on selecting an image",
	uiType: "image-upload",
	editImage: true,
};

export const Length = Template("upload-length").bind({});
Length.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Must upload 2 images and you will not be able to upload beyond 2 images",
	validation: [{ length: 2, errorMessage: "Must have 2 images" }],
};

export const MaxImages = Template("upload-max-images").bind({});
MaxImages.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Upload up to 2 images",
	validation: [{ max: 2, errorMessage: "Upload up to 2 images" }],
};

export const MaxFileSize = Template("upload-max-file-size").bind({});
MaxFileSize.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Max 100kb",
	validation: [{ maxSizeInKb: 100, errorMessage: "Max 100kb" }],
};

export const OutputType = Template("upload-output-type").bind({});
OutputType.args = {
	label: "Provide images",
	description: "Outputs in PNG format, you can verify by inspecting the thumbnail generated",
	uiType: "image-upload",
	outputType: "png",
};

export const UploadOnAdd = Template("upload-on-add").bind({});
UploadOnAdd.args = {
	label: "Provide images",
	uiType: "image-upload",
	description: "Uploads image via API after adding image",
	uploadOnAddingFile: {
		method: "post",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
};

export const WithValidation = Template("upload-with-validation").bind({});
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
