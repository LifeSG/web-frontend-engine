import { action } from "@storybook/addon-actions";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EImageStatus, IImage, IImageUploadSchema, IUpdateImageValidation } from "../../../components/fields";
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
					<Description>
						Custom events unique to the image upload field, it allows adding of event listeners to it.
					</Description>
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
			currentFormRef.addFieldEventListener(eventName, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleEvent);
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
	description: "Listen for `mount` event",
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
			currentFormRef.addFieldEventListener(eventName, id, handleSaveReviewImages);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleSaveReviewImages);
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
const ImageUploadReadyTemplate = (eventName: string) =>
	((args) => {
		const id = `image-upload-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();

		useEffect(() => {
			const handleUploadReady = async (e: CustomEvent<{ imageData: IImage }>) => {
				action(eventName)(e);
				e.preventDefault();

				setTimeout(() => {
					currentFormRef.dispatchFieldEvent("update-file-validation", id, {
						id: e.detail.imageData.id,
						updatedStatus: EImageStatus.ERROR_CUSTOM,
						errorMessage: "custom error message",
					} as IUpdateImageValidation);
				}, 3000);
			};

			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventName, id, handleUploadReady);
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

export const ImageUploadReady = ImageUploadReadyTemplate("upload-ready").bind({});
ImageUploadReady.args = {
	label: "Provide images",
	description: "Listen for `upload-ready` event",
	uiType: "image-upload",
};
