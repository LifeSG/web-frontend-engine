import { action } from "@storybook/addon-actions";
import { Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EImageStatus, IImage, IImageUploadSchema, IUpdateImageStatus } from "../../../components/fields";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
import DefaultImageUploadConfig from "./image-upload.stories";

const meta: Meta = {
	title: "Field/ImageUpload/Events",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Events for Image Upload field</Title>
					<p>Custom events unique to the image upload field, it allows adding of event listeners to it.</p>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
			source: {
				code: null,
			},
		},
	},
	argTypes: DefaultImageUploadConfig.argTypes,
};
export default meta;

/* eslint-disable react-hooks/rules-of-hooks */
const Template = (eventName: string) =>
	((args) => {
		const id = `image-upload-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleEvent = (e: unknown) => action(eventName)(e);
		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("image-upload", eventName as any, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener("image-upload", eventName as any, id, handleEvent);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);
		return (
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
		);
	}) as StoryFn<IImageUploadSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const Mount = Template("mount").bind({});
Mount.args = {
	label: "Provide images",
	description:
		"Listen for `mount` event<br>" +
		"Note: When served within webview, please use this event to request for camera permissions.",
	uiType: "image-upload",
};

export const ShowReviewModal = Template("show-review-modal").bind({});
ShowReviewModal.args = {
	label: "Provide images",
	description: "Listen for `show-review-modal` event",
	uiType: "image-upload",
	editImage: true,
};

export const HideReviewModal = Template("hide-review-modal").bind({});
HideReviewModal.args = {
	label: "Provide images",
	description: "Listen for `hide-review-modal` event",
	uiType: "image-upload",
	editImage: true,
};

export const FileDialog = Template("file-dialog").bind({});
FileDialog.args = {
	label: "Provide images",
	description: "Listen for `file-dialog` event",
	uiType: "image-upload",
	editImage: true,
};

export const Uploaded = Template("uploaded").bind({});
Uploaded.args = {
	label: "Provide images",
	description: "Listen for `uploaded` event",
	uiType: "image-upload",
	editImage: true,
};

/* eslint-disable react-hooks/rules-of-hooks */
const SaveReviewImagesTemplate = (eventName: string) =>
	((args) => {
		const id = `image-upload-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const [attemptCount, setAttemptCount] = useState(1);

		const handleSaveReviewImages = useCallback(
			async (event: CustomEvent) => {
				action(eventName)(event, attemptCount);
				// event can be prevented and retried
				if (attemptCount < 2) {
					event.preventDefault();
					setAttemptCount((v) => v + 1);
					await new Promise((resolve) => setTimeout(resolve, 1000));
					event.detail.retry();
				}
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[attemptCount]
		);

		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("image-upload", eventName as any, id, handleSaveReviewImages);
			return () =>
				currentFormRef.removeFieldEventListener("image-upload", eventName as any, handleSaveReviewImages);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [handleSaveReviewImages]);

		return (
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
		);
	}) as StoryFn<IImageUploadSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const SaveReviewImages = SaveReviewImagesTemplate("save-review-images").bind({});
SaveReviewImages.args = {
	label: "Provide images",
	description: "Listen for `save-review-images` event",
	uiType: "image-upload",
	editImage: true,
};

/* eslint-disable react-hooks/rules-of-hooks */
const ImageUploadReadyOrUploadedTemplate = (eventName: string, customMuted: boolean) =>
	((args) => {
		const id = `image-upload-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();

		useEffect(() => {
			const handleUploadReady = async (e: CustomEvent<{ imageData: IImage }>) => {
				action(eventName)(e);
				e.preventDefault();

				setTimeout(() => {
					currentFormRef.dispatchFieldEvent("image-upload", "update-image-status", id, {
						id: e.detail.imageData.id,
						updatedStatus: customMuted ? EImageStatus.ERROR_CUSTOM_MUTED : EImageStatus.ERROR_CUSTOM,
						errorMessage: customMuted ? "custom error muted message" : "custom error message",
					} as IUpdateImageStatus);
				}, 3000);
			};

			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("image-upload", eventName as any, handleUploadReady);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleUploadReady);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
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
		);
	}) as StoryFn<IImageUploadSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const ImageUploadReady = ImageUploadReadyOrUploadedTemplate("upload-ready", false).bind({});
ImageUploadReady.args = {
	label: "Provide images",
	description: "Listen for `upload-ready` event",
	uiType: "image-upload",
};

export const ImageUploadedWithMutedError = ImageUploadReadyOrUploadedTemplate("uploaded", true).bind({});
ImageUploadedWithMutedError.args = {
	label: "Provide images",
	description: "Listen for `uploaded` event",
	uiType: "image-upload",
	editImage: true,
};
