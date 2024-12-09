import { Button } from "@lifesg/react-design-system/button";
import { action } from "@storybook/addon-actions";
import { Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef } from "react";
import { IFileUploadSchema, IFileUploadValue } from "../../../components/fields";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
import DefaultFileUploadConfig from "./file-upload.stories";

const meta: Meta = {
	title: "Field/FileUpload/Events",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Events for File Upload field</Title>
					<p>Custom events unique to the file upload field, it allows adding of event listeners to it.</p>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
			source: {
				code: null,
			},
		},
	},
	argTypes: DefaultFileUploadConfig.argTypes,
};
export default meta;

/* eslint-disable react-hooks/rules-of-hooks */
const Template = (eventName: string) =>
	((args) => {
		const id = `file-upload-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleEvent = (e: unknown) => action(eventName)(e);
		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("file-upload", eventName as any, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener("file-upload", eventName as any, id, handleEvent);
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
	}) as StoryFn<IFileUploadSchema>;

export const Mount = Template("mount").bind({});
Mount.args = {
	label: "Upload",
	description: "Listen for `mount` event<br>",
	uiType: "file-upload",
};

export const UploadError = Template("upload-error").bind({});
UploadError.args = {
	label: "Upload",
	description: "Listen for `upload-error` event",
	uiType: "file-upload",
	uploadOnAddingFile: {
		url: "/not-found",
		type: "base64",
	},
};

/* eslint-disable react-hooks/rules-of-hooks */
const SetFileErrorTemplate = () =>
	((args) => {
		const id = `file-upload-set-file-error`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleSetFileError = () => {
			const files = formRef.current.getValues()[id] as IFileUploadValue[];

			if (!files || files.length === 0) return;

			formRef.current.dispatchFieldEvent("file-upload", "set-file-error", id, {
				fileId: files[0].fileId,
				errorMessage: "Custom file error",
			});
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
				<Button.Default onClick={handleSetFileError} style={{ marginTop: "2rem" }}>
					Set file error
				</Button.Default>
			</>
		);
	}) as StoryFn<IFileUploadSchema>;

export const SetFileError = SetFileErrorTemplate().bind({});
SetFileError.args = {
	label: "Upload",
	description: "Set file error with `set-file-error` trigger (upload 1 file first)",
	uiType: "file-upload",
	uploadOnAddingFile: {
		type: "base64",
		url: "https://jsonplaceholder.typicode.com/posts",
	},
	validation: [{ length: 1 }],
};
