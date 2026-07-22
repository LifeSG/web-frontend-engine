import { Typography } from "@lifesg/react-design-system/typography";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { CrossIcon } from "@lifesg/react-icons/cross";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileHelper, TestHelper } from "../../../../../utils";
import { ERROR_MESSAGES } from "../../../../shared";
import { EImageStatus, IImage, IImageUploadValidationRule, ISharedImageProps } from "../../types";
import * as styles from "./file-item.styles";

interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
	id?: string;
	index: number;
	fileItem: IImage;
	validation: IImageUploadValidationRule[];
	onDelete: (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FileItem = ({ id = "file-item", index, fileItem, maxSizeInKb, accepts, onDelete, validation }: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { dataURL, file, name: fileName, status, uploadProgress } = fileItem;
	const [isError, setError] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const fileNameWrapperRef = useRef<HTMLDivElement>(null);
	const thumbnailRef = useRef<HTMLDivElement>(null);
	const [transformedFileName, setTransformedFileName] = useState<string>();

	useApplyStyle(thumbnailRef, {
		[styles.tokens.thumbnail.backgroundImage]: dataURL ? `url(${dataURL})` : undefined,
	});
	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const setFileNameToWidth = useCallback(() => {
		const transformed = FileHelper.truncateFileName(fileName, fileNameWrapperRef);
		setTransformedFileName(transformed);
	}, [fileName]);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const handleResize = () => {
			if (fileNameWrapperRef.current) {
				setFileNameToWidth();
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);
		const currentElement = fileNameWrapperRef.current;

		if (currentElement) {
			resizeObserver.observe(currentElement);
			setFileNameToWidth();
		}

		return () => {
			if (currentElement) {
				resizeObserver.unobserve(currentElement);
			}
		};
	}, [fileNameWrapperRef, setFileNameToWidth]);

	useEffect(() => {
		switch (status) {
			case EImageStatus.ERROR_FORMAT: {
				const fileTypeRule = validation?.find((rule) => "fileType" in rule);
				const _errorMessage = fileTypeRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").FILE_TYPE(accepts);
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
			case EImageStatus.ERROR_GENERIC: {
				const uploadRule = validation?.find((rule) => "upload" in rule);
				const _errorMessage = uploadRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").GENERIC;
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
			case EImageStatus.ERROR_SIZE: {
				const fileSizeRule = validation?.find((rule) => "maxSizeInKb" in rule);
				const _errorMessage =
					fileSizeRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").MAX_FILE_SIZE(maxSizeInKb);
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
			case EImageStatus.ERROR_FILENAME: {
				const matchesRule = validation?.find((rule) => "matches" in rule);
				const _errorMessage =
					matchesRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").MODAL.GENERIC_ERROR.INVALID_FILE_NAME;
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
			case EImageStatus.ERROR_CUSTOM: {
				const _errorMessage = fileItem.customErrorMessage;
				setError(true);
				setErrorMessage(_errorMessage);
				break;
			}
			case EImageStatus.ERROR_CUSTOM_MUTED: {
				const _errorMessage = fileItem.customErrorMessage;
				setError(false);
				setErrorMessage(_errorMessage);
				break;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, dataURL, file.type, maxSizeInKb]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const fileSize = `${Math.round(
		FileHelper.getFilesizeFromBase64(fileItem.drawingDataURL || fileItem.dataURL || "") / 1000
	)} KB`;

	const renderError = () =>
		(isError || status === EImageStatus.ERROR_CUSTOM_MUTED) && (
			<Typography.BodySM
				className={styles.errorText}
				weight={"semibold"}
				id={TestHelper.generateId(`${id}-${index + 1}`, "error-text")}
				data-testid={TestHelper.generateId(`${id}-${index + 1}`, "error-text")}
			>
				{errorMessage}
			</Typography.BodySM>
		);

	/**
	 * render progress bar or delete button
	 * - progress bar: no error or status = compressed / converted / uploading
	 * - delete button: got error or file is ready
	 */
	const renderDetails = () => {
		const renderProgressBar =
			!isError && [EImageStatus.COMPRESSED, EImageStatus.CONVERTED, EImageStatus.UPLOADING].includes(status);

		return renderProgressBar ? (
			<div className={styles.cellProgressBar}>
				<progress className={styles.progressBar} value={uploadProgress} max={100} />
			</div>
		) : (
			<div className={styles.cellDeleteButton}>
				<Button
					className={styles.deleteButton}
					onClick={onDelete(index)}
					id={TestHelper.generateId(`${id}-${index + 1}`, "btn-delete")}
					data-testid={TestHelper.generateId(`${id}-${index + 1}`, "btn-delete")}
					aria-label={`remove ${fileName}`}
					icon={<CrossIcon />}
				/>
			</div>
		);
	};

	const renderCellInfoDetails = () => {
		return status === EImageStatus.ERROR_CUSTOM_MUTED ? (
			<>
				<div className={styles.errorCustomMutedThumbnailContainer}>
					<div
						className={styles.thumbnail}
						ref={thumbnailRef}
						id={TestHelper.generateId(`${id}-${index + 1}`, "image")}
						data-testid={TestHelper.generateId(`${id}-${index + 1}`, "image")}
					/>
					<Typography.BodyBL
						className={styles.textBody}
						as="div"
						id={TestHelper.generateId(`${id}-${index + 1}`, "file-image")}
						data-testid={TestHelper.generateId(`${id}-${index + 1}`, "file-image")}
					>
						<div className={styles.fileNameWrapper} ref={fileNameWrapperRef}>
							{transformedFileName}
						</div>
						<div className={styles.desktopTextBodyDetail}>{renderError()}</div>
						<div className={styles.mobileTextBodyDetail}>{fileSize}</div>
					</Typography.BodyBL>
				</div>
				<Typography.BodyBL
					className={styles.textBody}
					as="div"
					id={TestHelper.generateId(`${id}-${index + 1}`, "file-error")}
					data-testid={TestHelper.generateId(`${id}-${index + 1}`, "file-error")}
				>
					<div className={styles.mobileTextBodyDetail}>{renderError()}</div>
				</Typography.BodyBL>
			</>
		) : (
			<>
				{status === EImageStatus.UPLOADED && !isError && (
					<div
						className={styles.thumbnail}
						ref={thumbnailRef}
						id={TestHelper.generateId(`${id}-${index + 1}`, "image")}
						data-testid={TestHelper.generateId(`${id}-${index + 1}`, "image")}
					/>
				)}
				<Typography.BodyBL
					className={styles.textBody}
					as="div"
					id={TestHelper.generateId(`${id}-${index + 1}`, "file-image")}
					data-testid={TestHelper.generateId(`${id}-${index + 1}`, "file-image")}
				>
					<div className={styles.fileNameWrapper} ref={fileNameWrapperRef}>
						{transformedFileName}
					</div>
					{renderError()}
					<div className={styles.mobileTextBodyDetail}>{fileSize}</div>
				</Typography.BodyBL>
			</>
		);
	};

	return (
		<div
			className={clsx(
				styles.wrapper,
				isError && styles.wrapperIsError,
				status === EImageStatus.ERROR_CUSTOM_MUTED && styles.wrapperIsCustomMuted
			)}
			id={TestHelper.generateId(`${id}-${index + 1}`)}
			data-testid={TestHelper.generateId(`${id}-${index + 1}`)}
		>
			<>
				<div className={styles.cellInfo}>{renderCellInfoDetails()}</div>
				<div className={styles.cellFileSize}>
					<Typography.BodyBL
						id={TestHelper.generateId(`${id}-${index + 1}`, "file-size")}
						data-testid={TestHelper.generateId(`${id}-${index + 1}`, "file-size")}
					>
						{fileSize}
					</Typography.BodyBL>
				</div>
				{renderDetails()}
			</>
		</div>
	);
};
