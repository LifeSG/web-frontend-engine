import { Description, Stories, Title } from "@storybook/addon-docs";
import { useState } from "@storybook/addons";
import { Meta } from "@storybook/react/types-6-0";
import { ForwardedRef, forwardRef, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { FrontendEngine } from "../../../components";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { SubmitButtonStorybook } from "../../common";

export default {
	title: "Field/ImageUpload/Events",
	component: null,
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
	argTypes: {
		type: {
			table: { disable: true },
		},
	},
} as Meta;

export const Mount = () => {
	const formRef = useRef<IFrontendEngineRef>();
	const handleMount = () => console.log("mount");

	useEffect(() => {
		const currentFormRef = formRef.current;
		currentFormRef.addFieldEventListener("mount", "mount-field", handleMount);
		return () => currentFormRef.removeFieldEventListener("mount", "mount-field", handleMount);
	}, []);

	return <EventComponent id="mount-field" ref={formRef} />;
};
Mount.parameters = { controls: { hideNoControlsWarning: true } };

export const ShowReviewModal = () => {
	const formRef = useRef<IFrontendEngineRef>();
	const handleShowReviewModal = () => console.log("show review modal");

	useEffect(() => {
		const currentFormRef = formRef.current;
		currentFormRef.addFieldEventListener("show-review-modal", "show-review-modal-field", handleShowReviewModal);
		return () =>
			currentFormRef.removeFieldEventListener(
				"show-review-modal",
				"show-review-modal-field",
				handleShowReviewModal
			);
	}, []);

	return <EventComponent id="show-review-modal-field" ref={formRef} />;
};
ShowReviewModal.parameters = { controls: { hideNoControlsWarning: true } };

export const HideReviewModal = () => {
	const formRef = useRef<IFrontendEngineRef>();
	const handleHideReviewModal = () => console.log("hide review modal");

	useEffect(() => {
		const currentFormRef = formRef.current;
		currentFormRef.addFieldEventListener("hide-review-modal", "hide-review-modal-field", handleHideReviewModal);
		return () =>
			currentFormRef.removeFieldEventListener(
				"hide-review-modal",
				"hide-review-modal-field",
				handleHideReviewModal
			);
	}, []);

	return <EventComponent id="hide-review-modal-field" ref={formRef} />;
};
HideReviewModal.parameters = { controls: { hideNoControlsWarning: true } };

export const FileDialog = () => {
	const formRef = useRef<IFrontendEngineRef>();
	const handleFileDialog = () => console.log("file dialog");

	useEffect(() => {
		const currentFormRef = formRef.current;
		currentFormRef.addFieldEventListener("file-dialog", "file-dialog-field", handleFileDialog);
		return () => currentFormRef.removeFieldEventListener("file-dialog", "file-dialog-field", handleFileDialog);
	}, []);

	return <EventComponent id="file-dialog-field" ref={formRef} />;
};
FileDialog.parameters = { controls: { hideNoControlsWarning: true } };

export const SaveReviewImages = () => {
	const formRef = useRef<IFrontendEngineRef>();
	const [attemptCount, setAttemptCount] = useState(1);
	const handleSaveReviewImages = useCallback(
		async (event: CustomEvent) => {
			console.log("save review images attempt", attemptCount, event.detail.images);
			// event can be prevented and retried
			if (attemptCount < 2) {
				event.preventDefault();
				setAttemptCount((v) => v + 1);
				await new Promise((resolve) => setTimeout(resolve, 1000));
				event.detail.retry();
			}
		},
		[attemptCount]
	);

	useEffect(() => {
		const currentFormRef = formRef.current;
		currentFormRef.addFieldEventListener("save-review-images", "save-review-images-field", handleSaveReviewImages);
		return () =>
			currentFormRef.removeFieldEventListener(
				"save-review-images",
				"save-review-images-field",
				handleSaveReviewImages
			);
	}, [handleSaveReviewImages]);

	return <EventComponent id="save-review-images-field" ref={formRef} />;
};
SaveReviewImages.parameters = { controls: { hideNoControlsWarning: true } };

interface IProps {
	id: string;
	ref: IFrontendEngineRef;
}
const EventComponent = forwardRef((props: IProps, ref: ForwardedRef<IFrontendEngineRef>) => {
	const { id } = props;

	return (
		<StyledForm
			ref={ref}
			data={{
				fields: {
					[id]: {
						label: "Provide images",
						fieldType: "image-upload",
						editImage: true,
					},
					...SubmitButtonStorybook,
				},
			}}
		/>
	);
});
const StyledForm = styled(FrontendEngine)`
	width: 500px;
	margin: 0 auto;
`;
