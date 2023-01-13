import * as Yup from "yup";
import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { FileHelper, WindowHelper } from "../../../utils";
import { useFieldEvent, usePrevious, useValidationSchema } from "../../../utils/hooks";
import { IGenericFieldProps } from "../../frontend-engine";
import { ERROR_MESSAGES, Prompt } from "../../shared";
import { ImageContext, ImageProvider } from "./image-context";
import { ImageInput } from "./image-input";
import { ImageReview } from "./image-review";
import { ACCEPTED_FILE_TYPES, EImageStatus, IImage, IImageUploadSchema, TImageUploadAcceptedFileType } from "./types";

// lazy load to fix next.js SSR errors
const ImageManager = lazy(() => import("./image-manager"));

export const ImageUploadInner = (props: IGenericFieldProps<IImageUploadSchema>) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		schema: {
			capture,
			copies,
			compress,
			description,
			dimensions = { width: 1000, height: 1000 },
			editImage,
			label,
			outputType = "jpg",
			uploadOnAdd,
			validation,
		},
		id,
		value,
		onChange,
		...otherProps
	} = props;
	const { buttonAdd, dragAndDropHint, inputHint } = copies || {};
	const { images, setImages } = useContext(ImageContext);
	const previousImages = usePrevious(images);
	const [acceptedFileTypes, setAcceptedFileTypes] = useState<TImageUploadAcceptedFileType[]>(ACCEPTED_FILE_TYPES);
	const [maxFiles, setMaxFiles] = useState(0);
	const [maxFileSize, setMaxFileSize] = useState(0);
	const [showReviewPrompt, setShowReviewPrompt] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const { setFieldValidationConfig } = useValidationSchema();
	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		dispatchFieldEvent("mount", id);
	}, []);

	// handle `defaultValue`
	// to run once only, otherwise it will go into infinite loop as the value will change
	useEffect(() => {
		if (Array.isArray(value)) {
			const newImages: IImage[] = [];
			(value as { fileName: string; dataURL: string }[]).forEach(({ fileName, dataURL }, i) => {
				const newImage: IImage = {
					file: {} as File,
					name: fileName,
					dimensions: { width: 10, height: 10 },
					dataURL,
					status: EImageStatus.INJECTED,
					addedFrom: "schema",
					uploadProgress: 100,
					slot: i,
				};
				newImages.push(newImage);
			});
			setImages(newImages);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const acceptedFileTypeRule = validation?.find((rule) => "fileType" in rule);
		const maxFileSizeRule = validation?.find((rule) => "maxSize" in rule);
		if (acceptedFileTypeRule?.["fileType"] && acceptedFileTypeRule?.["fileType"] !== acceptedFileTypes)
			setAcceptedFileTypes(acceptedFileTypeRule?.["fileType"]);
		if (maxFileSizeRule?.["maxSize"] && maxFileSizeRule?.["maxSize"] !== maxFileSize)
			setMaxFileSize(maxFileSizeRule?.["maxSize"]);

		const lengthRule = validation?.find((rule) => "length" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		let maxFilesRule: { maxFiles: number; errorMessage?: string } = undefined;
		if (lengthRule) {
			maxFilesRule = { maxFiles: lengthRule.length, errorMessage: lengthRule.errorMessage };
		} else if (maxRule) {
			maxFilesRule = { maxFiles: maxRule.max, errorMessage: maxRule.errorMessage };
		}
		if (maxFilesRule?.maxFiles && maxFiles !== maxFilesRule.maxFiles) {
			setMaxFiles(maxFilesRule.maxFiles);
		}

		// no need to add validation for file type because it will be validated in image-manager, even when value is set from `defaultValue`
		setFieldValidationConfig(
			id,
			Yup.array()
				.of(
					Yup.object().shape({
						fileName: Yup.string(),
						dataURL: Yup.string(),
					})
				)
				.test(
					"is-empty-array",
					isRequiredRule?.errorMessage || ERROR_MESSAGES.UPLOAD("photo").REQUIRED,
					(value) => {
						if (!value || !isRequiredRule?.required) return true;

						return value.length > 0;
					}
				)
				.test(
					"max-size",
					maxFileSizeRule?.errorMessage ||
						ERROR_MESSAGES.UPLOAD("photo").MAX_FILE_SIZE(maxFileSizeRule?.["maxSize"]),
					(value) => {
						if (!value || !Array.isArray(value) || !maxFileSizeRule?.["maxSize"]) return true;
						return value.reduce((accumulator, file) => {
							if (
								!accumulator ||
								FileHelper.getFilesizeFromBase64(file.dataURL) > maxFileSizeRule?.["maxSize"] * 1024
							)
								return false;
							return true;
						}, true);
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		images.some((image, index) => {
			const previousFile = previousImages?.[index];
			if (image.status !== previousFile?.status || image.dataURL !== previousFile.dataURL) {
				switch (image.status) {
					case EImageStatus.COMPRESSED:
					case EImageStatus.CONVERTED:
						if (editImage && !showReviewModal) {
							if (WindowHelper.isMobileView()) {
								setShowReviewModal(true);
							} else {
								setShowReviewPrompt(true);
							}
							return true;
						}
						break;
				}
			}
		});

		if (images.length === 0) {
			setShowReviewModal(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.map((image) => image.status).join(","), images.map((image) => image.dataURL).join(",")]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleReviewDecision = (decision = false) => {
		if (decision) {
			if (editImage) {
				document.body.classList.remove("lifesg-ds-overlay-open"); // this prevents image review modal from thinking it's a stacked modal
				setShowReviewModal(true);
			}
		} else {
			setImages((prev) =>
				prev.map((image) => {
					if (image.status < EImageStatus.UPLOAD_READY && image.status > EImageStatus.NONE) {
						return { ...image, status: EImageStatus.UPLOAD_READY };
					}
					return image;
				})
			);
		}
		setShowReviewPrompt(false);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderReviewPrompt = () => (
		<Prompt
			id={`${id}-review-prompt`}
			title="Review photos?"
			size="large"
			show={showReviewPrompt}
			description="This lets you check if you've selected the correct photos, and draw on them to highlight the issue."
			buttons={[
				{
					id: "ok",
					title: "Ok",
					onClick: () => handleReviewDecision(true),
				},
				{
					id: "skip",
					title: "Skip",
					buttonStyle: "secondary",
					onClick: () => handleReviewDecision(),
				},
			]}
		/>
	);

	const renderImageReviewModal = () => {
		return (
			<ImageReview
				accepts={acceptedFileTypes}
				capture={capture}
				dimensions={dimensions}
				id={id}
				maxFiles={maxFiles}
				maxSizeInKb={maxFileSize}
				onExit={() => setShowReviewModal(false)}
				outputType={outputType}
				show={showReviewModal}
			/>
		);
	};

	return (
		<>
			<Suspense fallback={null}>
				<ImageManager
					accepts={acceptedFileTypes}
					compress={!!compress}
					dimensions={dimensions}
					editImage={editImage}
					maxSizeInKb={maxFileSize}
					onChange={onChange}
					outputType={outputType}
					upload={uploadOnAdd}
					value={value}
				/>
			</Suspense>
			<ImageInput
				title={label}
				capture={capture}
				description={description}
				buttonAdd={buttonAdd}
				id={id}
				inputHint={inputHint}
				dragAndDropHint={dragAndDropHint}
				accepts={acceptedFileTypes}
				maxFiles={maxFiles}
				maxSizeInKb={maxFileSize}
				dimensions={dimensions}
				errorMessage={otherProps.error?.message}
				validation={validation}
			/>
			{renderReviewPrompt()}
			{renderImageReviewModal()}
		</>
	);
};

export const ImageUpload = (props: IGenericFieldProps<IImageUploadSchema>) => (
	<ImageProvider>
		<ImageUploadInner {...props} />
	</ImageProvider>
);
