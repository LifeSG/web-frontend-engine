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
	dimensions: { width: number; height: number };
	outputType: TImageUploadOutputFileType;
	upload?: {
		method: TUploadMethod;
		url: string;
		sessionId?: string | undefined;
	};
	value: any;
}

/**
 * manages selected images by listening to images from context provider
 * rename / compress / upload
 */
export const ImageManager = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { accepts, compress, dimensions, editImage, id, maxSizeInKb, outputType, upload, value } = props;
	const { images, setImages, setErrorCount, setCurrentFileIds } = useContext(ImageContext);
	const previousImages = usePrevious(images);
	const previousValue = usePrevious(value);
	const { setValue } = useFormContext();
	const sessionId = useRef<string>(null);
	const managerErrorCount = useRef(0);

	const { dispatchFieldEvent, addFieldEventListener, removeFieldEventListener } = useFieldEvent();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const handleUpdateImageStatus = (e: CustomEvent<IUpdateImageStatus>) => {
			setImages((prev) => {
				const imageIndex = prev.findIndex((image) => image.id === e.detail.id);
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
		images.forEach((image, index) => {
			const previousFile = previousImages?.[index];
			if (image.status !== previousFile?.status || image.dataURL !== previousFile.dataURL) {
				switch (image.status) {
					case EImageStatus.INJECTED:
						FileHelper.dataUrlToBlob(image.dataURL)
							.then((blob) => {
								setImages((prev) => {
									const updatedImages = [...prev];
									updatedImages[index] = {
										...image,
										file: new File([blob], image.name),
										status: EImageStatus.NONE,
									};
									return updatedImages;
								});
							})
							.catch(() => {
								setImages((prev) => prev.filter((prev, i) => i !== index));
							});
						break;
					case EImageStatus.NONE:
						FileHelper.getType(image.file).then((fileType) => {
							const mimeType = fileType.mime;
							if (mimeType && accepts.map(FileHelper.fileExtensionToMimeType).includes(mimeType)) {
								setImages((prev) => {
									const updatedImages = [...prev];
									updatedImages[index] = {
										...image,
										name: FileHelper.deduplicateFileName(
											images.map(({ name }) => name),
											index,
											FileHelper.sanitizeFileName(image.name)
										),
										type: mimeType,
										status: image.addedFrom !== "schema" ? image.status : EImageStatus.UPLOADED,
									};
									return updatedImages;
								});
								if (image.addedFrom !== "schema") {
									compress ? compressImage(index, image) : convertImage(index, image);
								}
							} else {
								setImages((prev) => {
									const updatedImages = [...prev];
									updatedImages[index] = {
										...image,
										status: EImageStatus.ERROR_FORMAT,
									};
									return updatedImages;
								});
							}
						});
						break;
					case EImageStatus.TO_RECOMPRESS:
						recompressImage(index, image);
						break;
					case EImageStatus.COMPRESSED:
					case EImageStatus.CONVERTED:
					case EImageStatus.RECOMPRESSED:
						if (!editImage) {
							const shouldPreventDefault = !dispatchFieldEvent("upload-ready", id, { imageData: image });

							setImages((prev) => {
								const updatedImages = [...prev];
								updatedImages[index] = {
									...updatedImages[index],
									status: shouldPreventDefault ? EImageStatus.PENDING : EImageStatus.UPLOAD_READY,
								};
								return updatedImages;
							});
						}
						break;
					case EImageStatus.UPLOAD_READY:
						uploadImage(index, image);
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
				[EImageStatus.ERROR_GENERIC, EImageStatus.ERROR_SIZE].includes(image.status)
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

	const convertImage = async (index: number, image: IImage) => {
		try {
			const dataURL = await ImageHelper.convertBlob(image.file, FileHelper.fileExtensionToMimeType(outputType));
			const filesize = FileHelper.getFilesizeFromBase64(dataURL);

			if (maxSizeInKb && filesize > maxSizeInKb * 1024) {
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						status: EImageStatus.ERROR_SIZE,
					};
					return updatedImages;
				});
			} else {
				const metadata = await ImageHelper.getMetadata(image.file);
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						dataURL,
						metadata,
						status: EImageStatus.CONVERTED,
					};
					return updatedImages;
				});
			}
		} catch (e) {
			setImages((prev) => {
				const updatedImages = [...prev];
				updatedImages[index] = {
					...prev[index],
					status: EImageStatus.ERROR_GENERIC,
				};
				return updatedImages;
			});
		}
	};

	const compressImage = async (index: number, imageToCompress: IImage) => {
		try {
			const dataURL = await ImageHelper.convertBlob(
				imageToCompress.file,
				FileHelper.fileExtensionToMimeType(outputType)
			);
			const image = await ImageHelper.dataUrlToImage(dataURL);
			const origDim = { w: image.naturalWidth, h: image.naturalHeight };
			const scale = getScale(origDim.w, origDim.h);
			let compressed = await ImageHelper.resampleImage(image, { scale });
			if (maxSizeInKb) {
				compressed = (await ImageHelper.compressImage(compressed, {
					fileSize: maxSizeInKb,
				})) as File;
			}

			if (maxSizeInKb && compressed.size > maxSizeInKb * 1024) {
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						status: EImageStatus.ERROR_SIZE,
					};
					return updatedImages;
				});
			} else {
				const metadata = await ImageHelper.getMetadata(imageToCompress.file);
				const dataURL = await FileHelper.fileToDataUrl(compressed);
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						dataURL,
						metadata,
						status: EImageStatus.COMPRESSED,
					};
					return updatedImages;
				});
			}
		} catch (e) {
			setImages((prev) => {
				const updatedImages = [...prev];
				updatedImages[index] = {
					...prev[index],
					status: EImageStatus.ERROR_GENERIC,
				};
				return updatedImages;
			});
		}
	};

	const recompressImage = async (index: number, imageToCompress: IImage) => {
		if (imageToCompress.drawingDataURL) {
			try {
				const image = await ImageHelper.dataUrlToImage(imageToCompress.drawingDataURL);
				const origDim = { w: image.naturalWidth, h: image.naturalHeight };
				const scale = getScale(origDim.w, origDim.h);
				let scaledFile = await ImageHelper.resampleImage(image, { scale });
				scaledFile = (await ImageHelper.compressImage(scaledFile, { fileSize: maxSizeInKb })) as File;

				if (scaledFile.size > maxSizeInKb * 1024) {
					const updatedImages = [...images];
					updatedImages[index] = {
						...images[index],
						status: EImageStatus.ERROR_SIZE,
					};
					setImages(updatedImages);
				} else {
					const dataURL = await FileHelper.fileToDataUrl(scaledFile);
					const updatedImages = [...images];
					updatedImages[index] = {
						...images[index],
						drawingDataURL: dataURL,
						status: EImageStatus.RECOMPRESSED,
					};
					setImages(updatedImages);
				}
			} catch (e) {
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						status: EImageStatus.ERROR_GENERIC,
					};
					return updatedImages;
				});
			}
		}
	};

	const uploadImage = async (index: number, iFile: IImage) => {
		try {
			setImages((prev) => {
				const updatedImages = [...prev];
				updatedImages[index] = {
					...prev[index],
					status: EImageStatus.UPLOADING,
				};
				return updatedImages;
			});

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
							setImages((prev) => {
								const updatedImages = [...prev];
								updatedImages[index] = {
									...prev[index],
									uploadProgress: percent,
								};
								return updatedImages;
							});
						},
					}
				);
			}

			setImages((prev) => {
				const updatedImages = [...prev];
				updatedImages[index] = {
					...prev[index],
					uploadResponse: response,
					status: EImageStatus.UPLOADED,
				};
				return updatedImages;
			});
		} catch (err) {
			setImages((prev) => {
				const updatedImages = [...prev];
				updatedImages[index] = {
					...prev[index],
					status: EImageStatus.ERROR_GENERIC,
				};
				return updatedImages;
			});
		}
	};

	return null;
};
