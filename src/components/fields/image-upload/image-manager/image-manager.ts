import { useContext, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { AxiosApiClient, FileHelper, ImageHelper, generateRandomId } from "../../../../utils";
import { useFieldEvent, usePrevious } from "../../../../utils/hooks";
import { ImageContext } from "../image-context";
import {
	EImageStatus,
	IImage,
	ISharedImageProps,
	IUpdateImageStatus,
	TImageUploadOutputFileType,
	TUploadMethod,
} from "../types";

interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
	editImage: boolean;
	compress: boolean;
	crop: boolean;
	dimensions: { width: number; height: number };
	outputType: TImageUploadOutputFileType;
	upload?: {
		method: TUploadMethod;
		url: string;
		sessionId?: string | undefined;
	};
	filenameMatches?: string | undefined;
	filenameMatchesErrorMessage?: string | undefined;
	value: any;
}

const patchImageById = (
	prev: IImage[],
	imageId: string,
	patch: Partial<IImage> | ((image: IImage) => IImage)
): IImage[] => {
	const imageIndex = prev.findIndex((img) => img.id === imageId);
	if (imageIndex === -1) return prev;
	const updatedImages = [...prev];
	const current = prev[imageIndex];
	updatedImages[imageIndex] = typeof patch === "function" ? patch(current) : { ...current, ...patch };
	return updatedImages;
};

/**
 * manages selected images by listening to images from context provider
 * rename / compress / upload
 */
export const ImageManager = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		accepts,
		compress,
		crop,
		dimensions,
		editImage,
		id,
		maxSizeInKb,
		outputType,
		upload,
		filenameMatches,
		filenameMatchesErrorMessage,
		value,
	} = props;
	const { images, setImages, setErrorCount, setCurrentFileIds } = useContext(ImageContext);
	const previousImages = usePrevious(images);
	const previousValue = usePrevious(value);
	const { setValue } = useFormContext();
	const sessionId = useRef<string>();
	const managerErrorCount = useRef(0);

	const { dispatchFieldEvent, addFieldEventListener, removeFieldEventListener } = useFieldEvent();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const handleUpdateImageStatus = (e: CustomEvent<IUpdateImageStatus>) => {
			setImages((prev) => {
				const imageIndex = prev.findIndex((image) => image.id === e.detail.id);
				if (imageIndex === -1) return prev;
				const updatedImage = { ...prev[imageIndex] };
				updatedImage.status = e.detail.updatedStatus;
				updatedImage.customErrorMessage = e.detail.errorMessage;

				const newImages = [...prev];
				newImages.splice(imageIndex, 1, updatedImage);
				return newImages;
			});
		};

		addFieldEventListener("update-image-status", id, handleUpdateImageStatus);
		return () => removeFieldEventListener("update-image-status", id, handleUpdateImageStatus);
	}, [addFieldEventListener, id, removeFieldEventListener, setImages]);

	// generate pseudo-random session id
	useEffect(() => {
		sessionId.current = generateRandomId();
	}, []);

	useEffect(() => {
		images.forEach((image) => {
			const previousFile = previousImages?.find((prevImage) => prevImage.id === image.id);
			if (image.status !== previousFile?.status || image.dataURL !== previousFile?.dataURL) {
				switch (image.status) {
					case EImageStatus.INJECTED: {
						const imageId = image.id;
						FileHelper.dataUrlToBlob(image.dataURL)
							.then((blob) => {
								setImages((prev) =>
									patchImageById(prev, imageId, {
										file: new File([blob], image.name),
										status: EImageStatus.NONE,
									})
								);
							})
							.catch(() => {
								setImages((prev) => prev.filter((img) => img.id !== imageId));
							});
						break;
					}
					case EImageStatus.NONE: {
						const imageId = image.id;
						if (filenameMatches) {
							const pattern = resolveMatchesPattern(filenameMatches);
							if (pattern && !pattern.test(image.name)) {
								setImages((prev) =>
									patchImageById(prev, imageId, {
										status: EImageStatus.ERROR_FILENAME,
										customErrorMessage: filenameMatchesErrorMessage,
									})
								);
								break;
							}
						}
						FileHelper.getType(image.file).then((fileType) => {
							const mimeType = fileType.mime;
							if (mimeType && accepts.map(FileHelper.fileExtensionToMimeType).includes(mimeType)) {
								setImages((prev) => {
									const imageIndex = prev.findIndex((img) => img.id === imageId);
									if (imageIndex === -1) return prev;
									return patchImageById(prev, imageId, {
										name: FileHelper.deduplicateFileName(
											prev.map(({ name }) => name),
											imageIndex,
											FileHelper.sanitizeFileName(image.name)
										),
										type: mimeType,
										status: image.addedFrom !== "schema" ? image.status : EImageStatus.UPLOADED,
									});
								});
								if (image.addedFrom !== "schema") {
									compress ? compressImage(image) : convertImage(image);
								}
							} else {
								setImages((prev) =>
									patchImageById(prev, imageId, {
										status: EImageStatus.ERROR_FORMAT,
									})
								);
							}
						});
						break;
					}
					case EImageStatus.TO_RECOMPRESS:
						recompressImage(image);
						break;
					case EImageStatus.COMPRESSED:
					case EImageStatus.CONVERTED:
					case EImageStatus.RECOMPRESSED:
						if (!editImage) {
							const shouldPreventDefault = !dispatchFieldEvent("upload-ready", id, { imageData: image });

							setImages((prev) =>
								patchImageById(prev, image.id, {
									status: shouldPreventDefault ? EImageStatus.PENDING : EImageStatus.UPLOAD_READY,
								})
							);
						}
						break;
					case EImageStatus.UPLOAD_READY:
						uploadImage(image);
						break;
					case EImageStatus.TO_DELETE:
						setImages((prev) => prev.filter(({ status }) => status !== EImageStatus.TO_DELETE));
						break;
					case EImageStatus.UPLOADED:
						dispatchFieldEvent("uploaded", id, { imageData: image });
						break;
				}
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.map(({ status }) => status).join(","), images.map(({ dataURL }) => dataURL).join(",")]);

	// track / update errors and values
	useEffect(() => {
		let updatedManagerErrorCount = 0;
		images.forEach((image) => {
			if (
				(image.type && !accepts.map(FileHelper.fileExtensionToMimeType).includes(image.type)) ||
				[EImageStatus.ERROR_GENERIC, EImageStatus.ERROR_SIZE, EImageStatus.ERROR_FILENAME].includes(
					image.status
				)
			) {
				updatedManagerErrorCount++;
			}
		});
		setErrorCount((prev) => Math.max(0, prev + updatedManagerErrorCount - managerErrorCount.current));
		managerErrorCount.current = updatedManagerErrorCount;

		const uploadedImages = images.filter(
			({ status }) => status === EImageStatus.UPLOADED || status === EImageStatus.ERROR_CUSTOM_MUTED
		);
		const notPrefilledImages = uploadedImages.filter(({ addedFrom }) => addedFrom !== "schema");
		const gotDeleteImages = images.filter(({ status }) => status === EImageStatus.TO_DELETE).length > 0;

		/**
		 * should dirty if
		 * - it is dirty in the first place
		 * - there are non-prefilled images
		 * - user deleted image (differentiated from reset)
		 */
		const hasNotPrefilledImages = notPrefilledImages.length > 0;
		const shouldDirty = hasNotPrefilledImages || gotDeleteImages;

		setCurrentFileIds(uploadedImages.map(({ id }) => id));

		setValue(
			id,
			uploadedImages.map(({ id, dataURL, drawingDataURL, name, metadata, uploadResponse }) => ({
				fileId: id,
				fileName: name,
				dataURL: drawingDataURL || dataURL,
				metadata,
				uploadResponse,
			})),
			{ shouldDirty, shouldTouch: hasNotPrefilledImages }
		);
	}, [accepts, id, images, setErrorCount, setValue]);

	useEffect(() => {
		if (previousValue !== undefined && value === undefined && images.length) {
			setImages([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previousValue === undefined, value === undefined, images.length]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getScale = (origWidth: number, origHeight: number): number => {
		let scale = dimensions.width / origWidth;
		if (origHeight * scale > dimensions.height) {
			scale = dimensions.height / origHeight;
		}
		return scale;
	};

	/**
	 * Converts a matches string (e.g. "/^abc$/i" or "^abc$") to a RegExp.
	 * Returns undefined if the string is invalid.
	 */
	const resolveMatchesPattern = (matches: string): RegExp | undefined => {
		try {
			const parsed = matches.match(/^\/(.+)\/([gimsuy]*)$/);
			return parsed ? new RegExp(parsed[1], parsed[2] || "") : new RegExp(matches);
		} catch {
			return undefined;
		}
	};

	const convertImage = async (image: IImage) => {
		const imageId = image.id;
		try {
			const dataURL = await ImageHelper.convertBlob(image.file, FileHelper.fileExtensionToMimeType(outputType));
			const filesize = FileHelper.getFilesizeFromBase64(dataURL);

			if (maxSizeInKb && filesize > maxSizeInKb * 1024) {
				setImages((prev) => patchImageById(prev, imageId, { status: EImageStatus.ERROR_SIZE }));
			} else {
				const metadata = await ImageHelper.getMetadata(image.file);
				setImages((prev) =>
					patchImageById(prev, imageId, {
						dataURL,
						metadata,
						status: EImageStatus.CONVERTED,
					})
				);
			}
		} catch (e) {
			setImages((prev) => patchImageById(prev, imageId, { status: EImageStatus.ERROR_GENERIC }));
		}
	};

	const compressImage = async (imageToCompress: IImage) => {
		const imageId = imageToCompress.id;
		try {
			const dataURL = await ImageHelper.convertBlob(
				imageToCompress.file,
				FileHelper.fileExtensionToMimeType(outputType)
			);
			const image = await ImageHelper.dataUrlToImage(dataURL);
			const origDim = { w: image.naturalWidth, h: image.naturalHeight };
			let compressed: Blob;
			if (crop) {
				compressed = await ImageHelper.resampleImage(image, {
					width: dimensions.width,
					height: dimensions.height,
					crop: true,
				});
			} else {
				const scale = getScale(origDim.w, origDim.h);
				compressed = await ImageHelper.resampleImage(image, { scale });
			}
			if (maxSizeInKb) {
				compressed = (await ImageHelper.compressImage(compressed, {
					fileSize: maxSizeInKb,
				})) as File;
			}

			if (maxSizeInKb && compressed.size > maxSizeInKb * 1024) {
				setImages((prev) => patchImageById(prev, imageId, { status: EImageStatus.ERROR_SIZE }));
			} else {
				const metadata = await ImageHelper.getMetadata(imageToCompress.file);
				const compressedDataURL = await FileHelper.fileToDataUrl(compressed);
				setImages((prev) =>
					patchImageById(prev, imageId, {
						dataURL: compressedDataURL,
						metadata,
						status: EImageStatus.COMPRESSED,
					})
				);
			}
		} catch (e) {
			setImages((prev) => patchImageById(prev, imageId, { status: EImageStatus.ERROR_GENERIC }));
		}
	};

	const recompressImage = async (imageToCompress: IImage) => {
		const imageId = imageToCompress.id;
		if (imageToCompress.drawingDataURL) {
			try {
				const image = await ImageHelper.dataUrlToImage(imageToCompress.drawingDataURL);
				const origDim = { w: image.naturalWidth, h: image.naturalHeight };
				let scaledFile: Blob;
				if (crop) {
					scaledFile = await ImageHelper.resampleImage(image, {
						width: dimensions.width,
						height: dimensions.height,
						crop: true,
					});
				} else {
					const scale = getScale(origDim.w, origDim.h);
					scaledFile = await ImageHelper.resampleImage(image, { scale });
				}
				scaledFile = (await ImageHelper.compressImage(scaledFile, { fileSize: maxSizeInKb })) as File;

				if (scaledFile.size > maxSizeInKb * 1024) {
					setImages((prev) => patchImageById(prev, imageId, { status: EImageStatus.ERROR_SIZE }));
				} else {
					const dataURL = await FileHelper.fileToDataUrl(scaledFile);
					setImages((prev) =>
						patchImageById(prev, imageId, {
							drawingDataURL: dataURL,
							status: EImageStatus.RECOMPRESSED,
						})
					);
				}
			} catch (e) {
				setImages((prev) => patchImageById(prev, imageId, { status: EImageStatus.ERROR_GENERIC }));
			}
		}
	};

	const uploadImage = async (iFile: IImage) => {
		const uploadImageId = iFile.id;
		try {
			setImages((prev) => patchImageById(prev, uploadImageId, { status: EImageStatus.UPLOADING }));

			let response: unknown;
			if (upload?.method && upload?.url) {
				const formData = new FormData();
				formData.append("dataURL", iFile.drawingDataURL || iFile.dataURL || "");
				formData.append("sessionId", upload?.sessionId || sessionId.current || "");
				formData.append("slot", `${iFile.slot}`);
				response = await new AxiosApiClient("", undefined, undefined, true)[upload.method](
					upload.url,
					formData,
					{
						onUploadProgress: (progressEvent) => {
							const { loaded, total } = progressEvent;
							const percent = Math.floor((loaded * 100) / total);
							setImages((prev) => patchImageById(prev, uploadImageId, { uploadProgress: percent }));
						},
					}
				);
			}

			setImages((prev) =>
				patchImageById(prev, uploadImageId, {
					uploadResponse: response,
					status: EImageStatus.UPLOADED,
				})
			);
		} catch (err) {
			setImages((prev) => patchImageById(prev, uploadImageId, { status: EImageStatus.ERROR_GENERIC }));
		}
	};

	return null;
};
