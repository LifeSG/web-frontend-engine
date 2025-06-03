import { AxiosError } from "axios";
import { useContext, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { AxiosApiClient, FileHelper, ImageHelper, generateRandomId } from "../../../utils";
import { useFieldEvent, usePrevious } from "../../../utils/hooks";
import { ERROR_MESSAGES } from "../../shared";
import { FileUploadContext } from "./file-upload-context";
import {
	EFileStatus,
	IFile,
	IFileUploadSchema,
	IFileUploadValidationRule,
	IFileUploadValue,
	TUploadErrorDetail,
} from "./types";

interface IProps {
	compressImages: boolean;
	fileTypeRule: IFileUploadValidationRule;
	id: string;
	maxFileSizeRule: IFileUploadValidationRule;
	upload: IFileUploadSchema["uploadOnAddingFile"];
	uploadRule: IFileUploadValidationRule;
	value: IFileUploadValue[];
}

const RESIZEABLE_IMAGE_TYPES = ["image/jpeg", "image/gif", "image/png"];

const FileUploadManager = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { compressImages, fileTypeRule, id, maxFileSizeRule, upload, uploadRule, value } = props;
	const { files, setFiles, setCurrentFileIds } = useContext(FileUploadContext);
	const previousValue = usePrevious(value);
	const { setValue } = useFormContext();
	const { dispatchFieldEvent } = useFieldEvent();
	const sessionId = useRef<string>();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		sessionId.current = generateRandomId();
	}, []);

	useEffect(
		() => {
			// handle file status
			files.forEach(async (file, index) => {
				try {
					switch (file.status) {
						case EFileStatus.INJECTED:
							await injectFile(file, index);
							break;
						case EFileStatus.NONE:
							await parseFile(file, index);
							break;
						case EFileStatus.UPLOAD_READY:
							await uploadFile(file, index);
							break;
						case EFileStatus.TO_DELETE:
							deleteFile(index);
							break;
					}
				} catch (err) {
					handleGenericError(index);
				}
			});

			// track / update values
			const uploadedFiles = files.filter(({ status }) => status === EFileStatus.UPLOADED);
			const notPrefilledFiles = uploadedFiles.filter(({ addedFrom }) => addedFrom !== "schema");
			const hasNotPrefilledFiles = notPrefilledFiles.length > 0;
			const gotDeleteFiles = files.filter(({ status }) => status === EFileStatus.TO_DELETE).length > 0;

			/**
			 * should dirty if
			 * - it is dirty in the first place
			 * - there are non-prefilled files
			 * - user deleted file (differentiated from reset)
			 */
			const shouldDirty = hasNotPrefilledFiles || gotDeleteFiles;

			setCurrentFileIds(uploadedFiles.map(({ fileItem }) => fileItem.id));

			setValue(
				id,
				uploadedFiles.map(({ dataURL, fileItem, fileUrl, uploadResponse }) => ({
					...(upload.type === "base64" ? { dataURL } : {}),
					fileId: fileItem.id,
					fileName: fileItem.name,
					fileUrl,
					uploadResponse,
				})),
				{ shouldDirty, shouldTouch: hasNotPrefilledFiles }
			);
		}, // eslint-disable-next-line react-hooks/exhaustive-deps
		[files.map(({ fileItem, status }) => `${fileItem?.id}-${status}`).join(",")]
	);

	// for reset
	useEffect(() => {
		if (previousValue !== undefined && value === undefined && files.length) {
			setFiles([]);
		}
	}, [files, previousValue, setFiles, value]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================

	const handleGenericError = (index: number) => {
		setFiles((prev) => {
			const updatedFiles = [...prev];
			const file = prev[index];
			updatedFiles[index] = {
				...file,
				fileItem: {
					...file.fileItem,
					id: file.fileItem?.id || generateRandomId(),
					name: file.rawFile.name,
					errorMessage: uploadRule?.errorMessage || ERROR_MESSAGES.UPLOAD().GENERIC,
				},
				status: EFileStatus.ERROR_GENERIC,
			};
			return updatedFiles;
		});
	};

	const generateThumbnail = async (file: IFile, fileType?: string | undefined) => {
		if (RESIZEABLE_IMAGE_TYPES.includes(fileType || file.fileItem?.type)) {
			const image = await ImageHelper.dataUrlToImage(file.dataURL);
			const thumbnail = await ImageHelper.resampleImage(image, { width: 94, height: 94, crop: true });
			return await FileHelper.fileToDataUrl(thumbnail);
		}
		return "";
	};

	const readFile = async (fileToRead: IFile) => {
		const { addedFrom, dataURL, rawFile } = fileToRead;
		const fileType = await FileHelper.getType(rawFile);
		const validFileType = fileTypeRule.fileType?.length ? fileTypeRule.fileType?.includes(fileType.ext) : true;

		if (!validFileType) {
			return {
				errorMessage:
					fileTypeRule.errorMessage || ERROR_MESSAGES.UPLOAD().FILE_TYPE(fileTypeRule.fileType || []),
				fileType,
				status: EFileStatus.ERROR_FORMAT,
			};
		}

		if (maxFileSizeRule.maxSizeInKb > 0) {
			const maxSizeInB = maxFileSizeRule.maxSizeInKb * 1024;
			if (
				(upload.type === "base64" && FileHelper.getFilesizeFromBase64(dataURL) > maxSizeInB) ||
				(upload.type === "multipart" && rawFile.size > maxSizeInB)
			) {
				return {
					errorMessage:
						maxFileSizeRule.errorMessage ||
						ERROR_MESSAGES.UPLOAD().MAX_FILE_SIZE(maxFileSizeRule.maxSizeInKb),
					fileType,
					status: EFileStatus.ERROR_SIZE,
				};
			}
		}

		if (addedFrom === "schema") {
			return {
				fileType,
				status: EFileStatus.UPLOADED,
			};
		}

		return {
			fileType,
			status: EFileStatus.UPLOAD_READY,
		};
	};

	// =============================================================================
	// FILE STATUS HANDLERS
	// =============================================================================
	const injectFile = async (fileToInject: IFile, index: number) => {
		setFiles((prev) => {
			const updatedFiles = [...prev];
			updatedFiles[index] = {
				...prev[index],
				status: EFileStatus.INJECTING,
			};
			return updatedFiles;
		});

		let rawFile: File;
		if (fileToInject.dataURL) {
			const blob = await FileHelper.dataUrlToBlob(fileToInject.dataURL);
			rawFile = new File([blob], fileToInject.rawFile.name);
		} else if (fileToInject.fileUrl) {
			const response: Blob = await new AxiosApiClient("", undefined, undefined, false, {
				responseType: "blob",
			}).get(fileToInject.fileUrl);
			const fileType = await FileHelper.getType(new File([response], fileToInject.rawFile.name));
			rawFile = new File([response], fileToInject.rawFile.name, { type: fileType.mime });
			fileToInject.dataURL = await FileHelper.fileToDataUrl(rawFile);
		}
		const { errorMessage, fileType } = await readFile({ ...fileToInject, rawFile });
		const thumbnailImageDataUrl = await generateThumbnail(fileToInject, fileType.mime);

		setFiles((prev) => {
			const updatedFiles = [...prev];
			updatedFiles[index] = {
				...fileToInject,
				fileItem: {
					errorMessage,
					id: fileToInject.fileItem?.id || generateRandomId(),
					name: FileHelper.deduplicateFileName(
						files.map(({ fileItem }) => fileItem?.name),
						index,
						rawFile.name
					),
					progress: 1,
					size: rawFile.size,
					type: fileType.mime,
					thumbnailImageDataUrl,
				},
				rawFile,
				status: EFileStatus.UPLOADED,
			};
			return updatedFiles;
		});
	};

	const parseFile = async (fileToParse: IFile, index: number) => {
		const compressedFile = await compressImageFile(fileToParse);
		const dataURL = await FileHelper.fileToDataUrl(compressedFile.rawFile);
		const { errorMessage, fileType, status } = await readFile({ dataURL, ...compressedFile });

		setFiles((prev) => {
			const updatedFiles = [...prev];
			updatedFiles[index] = {
				...compressedFile,
				dataURL,
				fileItem: {
					errorMessage,
					id: generateRandomId(),
					name: FileHelper.deduplicateFileName(
						files.map(({ fileItem }) => fileItem?.name),
						index,
						compressedFile.rawFile.name
					),
					size: compressedFile.rawFile.size,
					type: fileType.mime,
					progress: 0,
				},
				status,
			};
			return updatedFiles;
		});
	};

	const uploadFile = async (fileToUpload: IFile, index: number) => {
		setFiles((prev) => {
			const updatedFiles = [...prev];
			updatedFiles[index] = {
				...prev[index],
				status: EFileStatus.UPLOADING,
			};
			return updatedFiles;
		});

		const formData = new FormData();
		formData.append("sessionId", upload?.sessionId || sessionId.current || "");
		formData.append("fileId", fileToUpload.fileItem.id);
		formData.append("slot", fileToUpload.slot.toString());
		if (upload.type === "base64") {
			formData.append("dataURL", fileToUpload.dataURL);
		} else if (upload.type === "multipart") {
			formData.append("file", fileToUpload.rawFile, fileToUpload.fileItem?.name);
		}

		try {
			const response = await new AxiosApiClient("", undefined, undefined, true).post(upload.url, formData, {
				headers: {
					"Content-Type": upload.type === "base64" ? "application/json" : "multipart/form-data",
					...upload.headers,
				},
				onUploadProgress: (progressEvent) => {
					const { loaded, total } = progressEvent;
					setFiles((prev) => {
						if (!prev[index]) return prev;
						const updatedFiles = [...prev];
						updatedFiles[index] = {
							...prev[index],
							fileItem: {
								...prev[index].fileItem,
								progress: loaded / total,
							},
						};

						return updatedFiles;
					});
				},
			});

			const thumbnailImageDataUrl = await generateThumbnail(fileToUpload);
			setFiles((prev) => {
				if (!prev[index]) return prev;
				const updatedFiles = [...prev];
				updatedFiles[index] = {
					...prev[index],
					fileItem: {
						...prev[index].fileItem,
						progress: 1,
						thumbnailImageDataUrl,
					},
					fileUrl: response?.["data"]?.["fileUrl"],
					status: EFileStatus.UPLOADED,
					uploadResponse: response,
				};
				return updatedFiles;
			});
		} catch (err) {
			dispatchFieldEvent<TUploadErrorDetail>("upload-error", id, {
				fileId: fileToUpload.fileItem.id,
				errorData: (err as AxiosError)?.response?.data,
			});

			throw err;
		}
	};

	const deleteFile = (index: number) => {
		setFiles((prev) => prev.filter((_file, i) => i !== index));
	};

	const compressImageFile = async (fileToCompress: IFile) => {
		if (maxFileSizeRule.maxSizeInKb > 0 && compressImages) {
			const maxSizeInB = maxFileSizeRule.maxSizeInKb * 1024;
			if (fileToCompress.rawFile.size > maxSizeInB) {
				const fileType = await FileHelper.getType(fileToCompress.rawFile);
				if (RESIZEABLE_IMAGE_TYPES.includes(fileType.mime)) {
					let fileOrBlob = await ImageHelper.compressImage(fileToCompress.rawFile, {
						fileSize: maxFileSizeRule.maxSizeInKb,
					});
					if (fileOrBlob instanceof Blob) {
						fileOrBlob = FileHelper.blobToFile(fileOrBlob, {
							name: fileToCompress.rawFile.name,
							lastModified: fileToCompress.rawFile.lastModified,
						});
					}
					return {
						...fileToCompress,
						rawFile: fileOrBlob,
					};
				}
			}
		}

		return fileToCompress;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return null;
};

export default FileUploadManager;
