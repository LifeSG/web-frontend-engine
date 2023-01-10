import { useContext, useEffect, useRef, useState } from "react";
import { usePrevious } from "../../../../utils/hooks";
import { AxiosApiClient, FileHelper, ImageHelper } from "../../../../utils";
import { ImageContext } from "../image-context";
import {
	EImageStatus,
	IImage,
	TImageUploadAcceptedFileType,
	TImageUploadOutputFileType,
	TUploadMethod,
} from "../types";

interface IProps {
	accepts: TImageUploadAcceptedFileType[];
	compress: boolean;
	dimensions: { width: number; height: number };
	editImage: boolean;
	onChange: (...event: any[]) => void;
	outputType: TImageUploadOutputFileType;
	maxSizeInKb: number;
	upload?: {
		method: TUploadMethod;
		url: string;
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
	const { accepts, compress, dimensions, editImage, maxSizeInKb, onChange, outputType, upload, value } = props;
	const { images, setImages, setErrorCount } = useContext(ImageContext);
	const previousImages = usePrevious(images);
	const [managerErrorCount, setManagerErrorCount] = useState(0);
	const previousValue = usePrevious(value);
	const sessionId = useRef<string>();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	// generate pseudo-random session id
	useEffect(() => {
		sessionId.current = Array(5)
			.fill(0)
			.map(() => Math.random().toString(36).slice(2))
			.join("");
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
						FileHelper.getMimeType(image.file).then((mimeType) => {
							if (mimeType && accepts.map(FileHelper.fileExtensionToMimeType).includes(mimeType)) {
								setImages((prev) => {
									const updatedImages = [...prev];
									updatedImages[index] = {
										...image,
										name: FileHelper.deduplicateFileName(
											images.map(({ name }) => name),
											index,
											image.name
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
							setImages((prev) => {
								const updatedImages = [...prev];
								updatedImages[index] = {
									...updatedImages[index],
									status: EImageStatus.UPLOAD_READY,
								};
								return updatedImages;
							});
						}
						break;
					case EImageStatus.UPLOAD_READY:
						uploadImage(index, image);
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
		setErrorCount((prev) => Math.max(0, prev + updatedManagerErrorCount - managerErrorCount));
		setManagerErrorCount(updatedManagerErrorCount);

		onChange({
			target: {
				value: images
					.filter(({ status }) => status === EImageStatus.UPLOADED)
					.map(({ dataURL, drawingDataURL, name, uploadResponse }) => ({
						fileName: name,
						dataURL: drawingDataURL || dataURL,
						uploadResponse,
					})),
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.map((image) => image.status).join(",")]);

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
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						dataURL,
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
			const dataURL = await FileHelper.fileToDataUrl(imageToCompress.file);
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
				const dataURL = await FileHelper.fileToDataUrl(compressed);
				setImages((prev) => {
					const updatedImages = [...prev];
					updatedImages[index] = {
						...prev[index],
						dataURL,
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
				formData.append("sessionId", sessionId.current || "");
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
