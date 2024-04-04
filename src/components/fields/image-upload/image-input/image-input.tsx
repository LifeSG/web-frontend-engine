import React, { createRef, useContext, useEffect, useState } from "react";
import { TestHelper, generateRandomId } from "../../../../utils";
import { useFieldEvent, usePrevious } from "../../../../utils/hooks";
import { ERROR_MESSAGES, Sanitize } from "../../../shared";
import { ImageContext } from "../image-context";
import { ImageUploadHelper } from "../image-upload-helper";
import { EImageStatus, IImage, IImageUploadValidationRule, ISharedImageProps, TFileCapture } from "../types";
import { DragUpload, IDragUploadRef } from "./drag-upload";
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

interface IImageInputProps extends ISharedImageProps {
	buttonLabel?: string | undefined;
	capture?: TFileCapture | undefined;
	className?: string | undefined;
	description?: string | undefined;
	dimensions: { width: number; height: number };
	errorMessage?: string | undefined;
	label: string;
	validation: IImageUploadValidationRule[];
}

/**
 * handles adding of image(s) through drag & drop or file dialog
 */
export const ImageInput = (props: IImageInputProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		capture,
		className,
		label,
		buttonLabel = "Add photos",
		description,
		dimensions,
		maxFiles,
		accepts,
		maxSizeInKb,
		validation,
		errorMessage,
	} = props;
	const { images, setImages, setErrorCount } = useContext(ImageContext);
	const { dispatchFieldEvent } = useFieldEvent();
	const dragUploadRef = createRef<IDragUploadRef>();
	const [remainingPhotos, setRemainingPhotos] = useState<number>(0);
	const [exceededFiles, setExceedError] = useState<boolean>();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (maxFiles > 0) setRemainingPhotos(maxFiles - images.length);
	}, [maxFiles, images.length]);

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
		dispatchFieldEvent("file-dialog", id);
		dragUploadRef?.current?.fileDialog();
	};

	const handleDeleteFile = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setImages((prev) =>
			prev.map((image, i) => ({
				...image,
				...(i === index ? { status: EImageStatus.TO_DELETE } : {}),
			}))
		);
		setExceedError(false);
	};

	const handleInput = (inputFiles: File[]): void => {
		if (!inputFiles || !inputFiles.length) return;
		if (!maxFiles || inputFiles.length + images.length <= maxFiles) {
			const updatedImages: IImage[] = [...images];
			inputFiles.forEach((inputFile) => {
				const slot = ImageUploadHelper.findAvailableSlot(updatedImages);
				updatedImages.push({
					id: generateRandomId(),
					file: inputFile,
					name: inputFile.name,
					dimensions,
					status: EImageStatus.NONE,
					uploadProgress: 0,
					addedFrom: "dragInput",
					slot,
				});
			});
			setImages(updatedImages);
			setExceedError(false);
		} else if (maxFiles > 0) {
			setExceedError(true);
		}
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderFiles = () => {
		if (!images || !images.length) return null;
		return images.map((fileItem: IImage, i: number) => {
			return (
				<FileItem
					id={`${id}-file-item`}
					key={`${fileItem.name}_${i}`}
					index={i}
					fileItem={fileItem}
					maxSizeInKb={maxSizeInKb}
					accepts={accepts}
					validation={validation}
					onDelete={handleDeleteFile}
				/>
			);
		});
	};

	// render uploader as long as there are available slots or max is not defined
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
					{buttonLabel}
				</AddButton>
				<DropThemHereText>or drop them here</DropThemHereText>
			</UploadWrapper>
		);
	};

	const renderFileExceededAlert = () => {
		const lengthRule = validation?.find((rule) => "length" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		let _errorMessage = lengthRule?.errorMessage || maxRule?.errorMessage;
		if (!_errorMessage) {
			if (remainingPhotos < 1 || images.length === 0) {
				_errorMessage = ERROR_MESSAGES.UPLOAD("photo").MAX_FILES(maxFiles);
			} else {
				_errorMessage = ERROR_MESSAGES.UPLOAD("photo").MAX_FILES_WITH_REMAINING(remainingPhotos);
			}
		}

		return (
			<AlertContainer type="error" data-testid={TestHelper.generateId(id, "error")}>
				{_errorMessage}
			</AlertContainer>
		);
	};

	const renderCustomError = (_errorMessage: string) => {
		return (
			<AlertContainer type="error" data-testid={TestHelper.generateId(id, "error")}>
				{_errorMessage}
			</AlertContainer>
		);
	};

	return (
		<Wrapper
			id={TestHelper.generateId(id)}
			data-testid={TestHelper.generateId(id)}
			className={className}
			aria-invalid={!!errorMessage}
			aria-describedby={!!errorMessage && TestHelper.generateId(id, "error")}
		>
			<DragUpload
				id={`${id}-drag-upload`}
				accept={accepts}
				capture={capture}
				onInput={handleInput}
				ref={dragUploadRef}
			>
				<Subtitle
					as="label"
					htmlFor={TestHelper.generateId(id, "file-input-add-button")}
					$hasDescription={!!description}
					weight="semibold"
				>
					{label}
				</Subtitle>
				{description && (
					<Content>
						<Sanitize>{description}</Sanitize>
					</Content>
				)}
				{renderFiles()}
				{exceededFiles ? renderFileExceededAlert() : null}
				{errorMessage && renderCustomError(errorMessage)}
				{renderUploader()}
			</DragUpload>
		</Wrapper>
	);
};
