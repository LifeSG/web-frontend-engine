import React, { createRef, useContext, useEffect, useState } from "react";
import { TestHelper } from "../../../../utils";
import { usePrevious } from "../../../../utils/hooks";
import { DragUpload, ERROR_MESSAGES, IDragUploadRef, TFileCapture } from "../../../shared";
import { ImageContext } from "../image-context";
import { ImageUploadHelper } from "../image-upload-helper";
import { EImageStatus, IImage, IImageUploadValidationRule, TImageUploadAcceptedFileType } from "../types";
import { FileItem } from "./file-item";
import {
	AddButton,
	AlertContainer,
	Content,
	DropThemHereText,
	Subtitle,
	UploadWrapper,
	Wrapper,
} from "./image-input.styles";

interface IProps {
	accepts: TImageUploadAcceptedFileType[];
	buttonAdd?: string;
	capture?: TFileCapture;
	description: string;
	dimensions: { width: number; height: number };
	inputHint?: string;
	dragAndDropHint?: string;
	errorMessage?: string;
	id?: string | undefined;
	maxFiles: number;
	maxSizeInKb: number;
	title: string;
	validation: IImageUploadValidationRule[];
}

/**
 * handles adding of image(s) through drag & drop or file dialog
 */
export const ImageInput = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		accepts,
		buttonAdd = "Add photos",
		capture,
		description,
		dimensions,
		inputHint = "or drop them here",
		errorMessage,
		dragAndDropHint,
		id = "image-input",
		maxFiles,
		maxSizeInKb,
		title,
		validation,
	} = props;
	const { images: files, setImages: setFiles, setErrorCount } = useContext(ImageContext);
	const dragUploadRef = createRef<IDragUploadRef>();
	const [remainingPhotos, setRemainingPhotos] = useState<number>(0);
	const [exceededFiles, setExceedError] = useState<boolean>();
	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (maxFiles > 0) setRemainingPhotos(maxFiles - files.length);
	}, [maxFiles, files.length]);

	const previousExceededFiles = usePrevious(exceededFiles);
	useEffect(() => {
		if (previousExceededFiles && !exceededFiles) {
			setErrorCount((prev) => Math.max(0, prev - 1));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exceededFiles]);
	// ===========================================================================
	// EVENT HANDLERS
	// ===========================================================================
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
		event?.preventDefault();
		dragUploadRef?.current?.fileDialog();
	};

	const handleDeleteFile = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setFiles((prev) => prev.filter((f, i) => i !== index));
		setExceedError(false);
	};

	const handleInput = (inputFiles: File[]): void => {
		if (!inputFiles || !inputFiles.length) return;
		if (!maxFiles || inputFiles.length + files.length <= maxFiles) {
			setFiles([
				...files,
				...inputFiles.map(
					(inputFile) =>
						({
							file: inputFile,
							name: inputFile.name,
							dimensions,
							status: EImageStatus.NONE,
							uploadProgress: 0,
							addedFrom: "dragInput",
							slot: ImageUploadHelper.findAvailableSlot(maxFiles, files),
						} as IImage)
				),
			]);
			setExceedError(false);
		} else if (maxFiles > 0) {
			setExceedError(true);
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderFiles = () => {
		if (!files || !files.length) return null;
		return files.map((fileItem: IImage, i: number) => {
			return (
				<FileItem
					id={`${id}-file-item`}
					key={`${fileItem.name}_${i}`}
					index={i}
					fileItem={fileItem}
					maxSize={maxSizeInKb}
					accepts={accepts}
					validation={validation}
					onDelete={handleDeleteFile}
				/>
			);
		});
	};

	// render uploader as long as there are available slots or maxFiles is not defined
	const renderUploader = () => {
		if (maxFiles && remainingPhotos <= 0) return null;
		return (
			<UploadWrapper>
				<AddButton
					onClick={handleClick}
					styleType="secondary"
					id={TestHelper.generateId(id, "file-input-add-button")}
					data-testid={TestHelper.generateId(id, "file-input-add-button")}
				>
					{buttonAdd}
				</AddButton>
				<DropThemHereText weight="semibold"> {inputHint} </DropThemHereText>
			</UploadWrapper>
		);
	};

	const renderFileExceededAlert = () => {
		const lengthRule = validation?.find((rule) => "length" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		let errorMessage = lengthRule?.errorMessage || maxRule?.errorMessage;
		if (!errorMessage) {
			if (remainingPhotos < 1 || files.length) {
				errorMessage = ERROR_MESSAGES.UPLOAD("photo").MAX_FILES(maxFiles);
			} else {
				errorMessage = ERROR_MESSAGES.UPLOAD("photo").MAX_FILES_WITH_REMAINING(remainingPhotos);
			}
		}

		return (
			<AlertContainer type="error" data-testid={TestHelper.generateId(id, "file-exceeded-error")}>
				{errorMessage}
			</AlertContainer>
		);
	};

	const renderCustomError = (errorMessage: string) => {
		return (
			<AlertContainer type="error" data-testid={TestHelper.generateId(id, "custom-error")}>
				{errorMessage}
			</AlertContainer>
		);
	};

	return (
		<Wrapper id={TestHelper.generateId(id)} data-testid={TestHelper.generateId(id)}>
			<DragUpload
				capture={capture}
				hint={dragAndDropHint}
				id={`${id}-drag-upload`}
				onInput={handleInput}
				ref={dragUploadRef}
			>
				<Subtitle weight="semibold">{title}</Subtitle>
				<Content weight="semibold">{description}</Content>
				{renderFiles()}
				{exceededFiles ? renderFileExceededAlert() : null}
				{errorMessage && renderCustomError(errorMessage)}
				{renderUploader()}
			</DragUpload>
		</Wrapper>
	);
};
