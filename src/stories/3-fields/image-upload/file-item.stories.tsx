import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { FileItem } from "../../../components/fields/image-upload/image-input/file-item";
import { EImageStatus, IImage, TImageUploadAcceptedFileType } from "../../../components/fields/image-upload/types";
import { jpgDataURL } from "./image-data-url";

const STORY_STATUS_MAP = {
	"Custom muted error": EImageStatus.ERROR_CUSTOM_MUTED,
	"Custom error": EImageStatus.ERROR_CUSTOM,
	Uploaded: EImageStatus.UPLOADED,
	Uploading: EImageStatus.UPLOADING,
} as const;

interface IFileItemStoryProps {
	accepts: TImageUploadAcceptedFileType[];
	errorMessage: string;
	fileName: string;
	maxSizeInKb: number;
	status: keyof typeof STORY_STATUS_MAP;
	uploadProgress: number;
}

const meta: Meta = {
	title: "Field/ImageUpload/FileItem",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ImageUpload FileItem</Title>
					<p>
						Standalone preview of a single <code>FileItem</code>. To show an inline item error message, use{" "}
						<code>status = ERROR_CUSTOM</code> or <code>ERROR_CUSTOM_MUTED</code> together with{" "}
						<code>customErrorMessage</code>.
					</p>
					<ArgTypes of={MutedCustomError} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		fileName: {
			description: "File name shown in the item",
			control: { type: "text" },
			table: { type: { summary: "string" } },
		},
		errorMessage: {
			description: "Mapped to `fileItem.customErrorMessage`",
			control: { type: "text" },
			table: { type: { summary: "string" } },
		},
		status: {
			description: "Visual state used to render the file item",
			options: Object.keys(STORY_STATUS_MAP),
			control: { type: "select" },
			table: {
				type: {
					summary: Object.keys(STORY_STATUS_MAP).join(" | "),
				},
			},
		},
		uploadProgress: {
			description: "Progress value when status is `Uploading`",
			control: { type: "range", min: 0, max: 100, step: 1 },
			table: { type: { summary: "number" } },
		},
		maxSizeInKb: {
			description: "Passed through to the component for size-related messages",
			control: { type: "number" },
			table: { type: { summary: "number" } },
		},
		accepts: {
			description: "Accepted file extensions",
			control: { type: "object" },
			table: { type: { summary: "TImageUploadAcceptedFileType[]" } },
		},
	},
};

export default meta;

const Template = () =>
	(({ accepts, errorMessage, fileName, maxSizeInKb, status, uploadProgress }) => {
		const fileItem: IImage = {
			id: "storybook-image-upload-file-item",
			file: new File(["storybook-image"], fileName, { type: "image/jpeg" }),
			name: fileName,
			type: "image/jpeg",
			dimensions: { width: 400, height: 300 },
			dataURL: jpgDataURL,
			status: STORY_STATUS_MAP[status],
			uploadProgress,
			slot: 0,
			customErrorMessage: errorMessage,
		};

		return (
			<div style={{}}>
				<FileItem
					index={0}
					fileItem={fileItem}
					maxSizeInKb={maxSizeInKb}
					accepts={accepts}
					validation={[]}
					onDelete={() => () => undefined}
				/>
			</div>
		);
	}) as StoryFn<IFileItemStoryProps>;

export const MutedCustomError = Template().bind({});
MutedCustomError.args = {
	fileName: "image.jpg",
	errorMessage: "Photo is not taken within 250 metres of the reported location.",
	status: "Custom muted error",
	uploadProgress: 0,
	maxSizeInKb: 5000,
	accepts: ["jpg", "png"],
};
