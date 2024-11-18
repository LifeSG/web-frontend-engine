import { Modal } from "@lifesg/react-design-system/modal";
import { CrossIcon } from "@lifesg/react-icons/cross";
import { Suspense, lazy, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FileHelper, ImageHelper, TestHelper, generateRandomId } from "../../../../utils";
import { useFieldEvent, usePrevious } from "../../../../utils/hooks";
import { ImageContext } from "../image-context";
import { ImageUploadHelper } from "../image-upload-helper";
import { EImageStatus, IDismissReviewModalEvent, IImage, ISharedImageProps, TFileCapture } from "../types";
import { IImageEditorRef } from "./image-editor";
import { ImageError } from "./image-error";
import { ImagePrompts } from "./image-prompts";
import {
	ButtonIcon,
	ContentSection,
	DeleteIcon,
	DrawDeleteButton,
	DrawDeleteButtonText,
	DrawDeleteButtonWrapper,
	DrawIcon,
	EditHeaderButton,
	EraserButton,
	EraserButtonIcon,
	FooterSaveButton,
	FooterSection,
	HeaderSection,
	ImageEditorWrapper,
	LoadingPreviewText,
	ModalBox,
	Palette,
	PaletteHolder,
	ReviewCloseButton,
	ReviewTitle,
} from "./image-review.styles";
import { ImageThumbnails } from "./image-thumbnails";

// lazy load to fix next.js SSR errors
const ImageEditor = lazy(() => import("./image-editor"));

const PALETTE_COLORS = [
	{ color: "#282828", label: "black" },
	{ color: "#FFF", colorScheme: "light", label: "white" },
	{ color: "#017cd3", label: "blue" },
	{ color: "#fb0101", label: "red" },
	{ color: "#22910c", label: "green" },
	{ color: "#f8e821", label: "yellow" },
];

interface IProps extends ISharedImageProps {
	capture?: TFileCapture | undefined;
	className?: string | undefined;
	compress?: boolean | undefined;
	dimensions: { width: number; height: number };
	onExit: () => void;
	outputType: string;
	show: boolean;
	multiple?: boolean | undefined;
	maxFilesErrorMessage?: string | undefined;
	imageReviewModalStyles?: string | undefined;
}

export const ImageReview = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		accepts,
		capture,
		className,
		compress,
		dimensions,
		id = "image-review",
		maxFiles,
		maxSizeInKb,
		onExit,
		outputType,
		show,
		multiple,
		maxFilesErrorMessage,
		imageReviewModalStyles,
	} = props;
	const { images, setImages } = useContext(ImageContext);
	const { dispatchFieldEvent, addFieldEventListener, removeFieldEventListener } = useFieldEvent();
	const previousShow = usePrevious(show);

	// review image
	const [activeFileIndex, setActiveFileIndex] = useState(images.length - 1);
	const [drawActive, setDrawActive] = useState(false);
	const [activePrompt, setActivePrompt] = useState<"delete" | "exit" | "clear-drawing" | null>();
	const drawDeleteDisabled = !!images?.find(({ status }) => status === EImageStatus.NONE);

	// edit image
	const [activeColor, setActiveColor] = useState(PALETTE_COLORS[0].color);
	const [eraseMode, setEraseMode] = useState(false);
	const imageEditorRef = useRef<IImageEditorRef>(null);

	const reviewSaveDisabled =
		!!images?.find(({ addedFrom, status }) => addedFrom === "reviewModal" && status <= EImageStatus.NONE) ||
		!images.length;

	// =============================================================================
	// - REVIEW MODAL
	// =============================================================================
	const handleDismissReviewModal = useCallback(
		(e: CustomEvent<IDismissReviewModalEvent>) => {
			if (e.detail.removePendingImages) {
				//remove others but keep the uploaded
				setImages((prev) => {
					return prev.filter(
						({ status }) => status === EImageStatus.UPLOADED || status === EImageStatus.ERROR_CUSTOM_MUTED
					);
				});
			}
			onExit();
		},
		[onExit, setImages]
	);

	const handleSelectFile = (selectedFiles: File[]) => {
		if (
			!maxFiles ||
			selectedFiles.length +
				images.filter(({ status, addedFrom }) => status >= EImageStatus.NONE || addedFrom === "reviewModal")
					.length <=
				maxFiles
		) {
			selectedFiles.forEach((selectedFile) => {
				setImages((prev) => {
					const slot = ImageUploadHelper.findAvailableSlot(prev);
					return [
						...prev,
						{
							id: generateRandomId(),
							file: selectedFile,
							name: selectedFile.name,
							dimensions,
							status: EImageStatus.NONE,
							uploadProgress: 0,
							addedFrom: "reviewModal",
							slot,
						},
					];
				});
			});
		} else {
			setImages((prev) => {
				const slot = ImageUploadHelper.findAvailableSlot(prev);
				return [
					...prev,
					{
						id: generateRandomId(),
						file: selectedFiles[0],
						name: selectedFiles[0].name,
						dimensions,
						status: EImageStatus.ERROR_EXCEED,
						uploadProgress: 0,
						addedFrom: "reviewModal",
						slot,
					},
				];
			});
		}
	};

	const handleDeleteDecision = (decision: boolean) => {
		if (decision) {
			setImages((prev) =>
				prev.map((image, i) => ({
					...image,
					...(i === activeFileIndex ? { status: EImageStatus.TO_DELETE } : {}),
				}))
			);
			setActiveFileIndex(Math.max(0, activeFileIndex - 1));
		}
		setActivePrompt(null);
	};

	const handleExitDecision = (decision: boolean) => {
		if (decision) {
			setImages(
				images
					.filter(
						({ addedFrom, status }) =>
							status >= EImageStatus.UPLOADED || (status < EImageStatus.NONE && addedFrom === "dragInput")
					)
					.map((file) => ({
						...file,
						drawingDataURL: undefined,
						drawing: undefined,
					}))
			);
			onExit();
		}
		setActivePrompt(null);
	};

	const handleSetImagesStatus = useCallback(() => {
		setImages((prev) =>
			prev
				.filter(({ status }) => status >= EImageStatus.NONE || status === EImageStatus.ERROR_CUSTOM_MUTED)
				.map((file) => {
					const editedFile: IImage = { ...file };
					if (file.drawingDataURL) {
						editedFile.dataURL = file.drawingDataURL;
					}
					if (file.status < EImageStatus.UPLOAD_READY && file.status > EImageStatus.NONE) {
						editedFile.status = EImageStatus.UPLOAD_READY;
					}
					editedFile.drawingDataURL = undefined;
					editedFile.drawing = undefined;
					return editedFile;
				})
		);
	}, [setImages]);

	const handleSave = () => {
		const shouldPreventDefault = !dispatchFieldEvent("save-review-images", id, { images, retry: handleSave });

		if (!shouldPreventDefault) {
			handleSetImagesStatus();
			onExit();
		}
	};

	// =============================================================================
	// DRAWING
	// =============================================================================
	const handleStartDrawing = () => {
		setDrawActive(true);
		setActiveColor(PALETTE_COLORS[0].color);
	};

	const handleSaveDrawing = async () => {
		const { dataURL: drawingDataURL, drawing } = imageEditorRef.current?.export() || {};
		const image = await ImageHelper.dataUrlToImage(drawingDataURL);
		const thumbnail = await ImageHelper.resampleImage(image, {
			scale: 96 / image.width,
			type: FileHelper.fileExtensionToMimeType(outputType),
		});
		const thumbnailDataURL = await FileHelper.fileToDataUrl(thumbnail);

		setImages((prev) => {
			const updatedFiles = [...prev];
			updatedFiles[activeFileIndex] = {
				...updatedFiles[activeFileIndex],
				thumbnailDataURL,
				drawingDataURL,
				drawing,
				status: compress ? EImageStatus.TO_RECOMPRESS : EImageStatus.EDITED,
			};
			return updatedFiles;
		});

		setDrawActive(false);
		clearDrawingStates();
	};

	const handleClearDrawingDecision = (decision: boolean) => {
		if (decision) {
			imageEditorRef.current.clearDrawing();
		}
		setActivePrompt(null);
	};

	const handleEraseMode = () => {
		clearDrawingStates();
		setEraseMode(true);
	};

	const handleSelectPaletteColor = (color: string) => {
		clearDrawingStates();
		setActiveColor(color);
	};

	const clearDrawingStates = () => {
		setActiveColor("");
		setEraseMode(false);
	};

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const eventsData = {
			["trigger-save-review-images"]: handleSetImagesStatus,
			["dismiss-review-modal"]: handleDismissReviewModal,
		};

		Object.entries(eventsData).forEach(([event, callback]) => {
			addFieldEventListener(event, id, callback);
		});

		return () => {
			Object.entries(eventsData).forEach(([event, callback]) => {
				removeFieldEventListener(event, id, callback);
			});
		};
	}, [addFieldEventListener, handleDismissReviewModal, handleSetImagesStatus, id, removeFieldEventListener]);

	useEffect(() => {
		setActiveFileIndex(images.length - 1);
	}, [images.length]);

	useEffect(() => {
		if (show) {
			dispatchFieldEvent("show-review-modal", id);
		} else if (previousShow) {
			dispatchFieldEvent("hide-review-modal", id);
		}
	}, [show]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderHeader = () => (
		<HeaderSection className={className ? `${className}-header` : undefined} drawActive={drawActive}>
			{!drawActive ? (
				<>
					<ReviewCloseButton
						id={TestHelper.generateId(id, "close-button")}
						data-testid={TestHelper.generateId(id, "close-button")}
						aria-label="exit review modal"
						onClick={() => setActivePrompt("exit")}
					>
						<CrossIcon type="cross" />
					</ReviewCloseButton>
					<ReviewTitle weight="semibold">Review photos</ReviewTitle>
				</>
			) : (
				<>
					<EditHeaderButton
						id={TestHelper.generateId(id, "clear-drawing-button")}
						data-testid={TestHelper.generateId(id, "clear-drawing-button")}
						onClick={() => setActivePrompt("clear-drawing")}
					>
						Clear
					</EditHeaderButton>
					<EditHeaderButton
						id={TestHelper.generateId(id, "save-drawing")}
						data-testid={TestHelper.generateId(id, "save-drawing")}
						onClick={handleSaveDrawing}
					>
						Save
					</EditHeaderButton>
				</>
			)}
		</HeaderSection>
	);

	const renderContent = () => (
		<ContentSection>
			{images.length > 0 && (
				<ImageEditorWrapper className={className ? `${className}-editor` : undefined}>
					<Suspense fallback={null}>
						<ImageEditor
							baseImageDataURL={images[activeFileIndex]?.dataURL}
							drawing={images[activeFileIndex]?.drawing}
							color={drawActive ? activeColor : undefined}
							erase={drawActive ? eraseMode : false}
							ref={imageEditorRef}
							maxSizeInKb={maxSizeInKb}
						/>
					</Suspense>
				</ImageEditorWrapper>
			)}
			{images.length > 0 && <LoadingPreviewText>Loading Preview...</LoadingPreviewText>}
			{!drawActive && images[activeFileIndex]?.status >= EImageStatus.NONE && (
				<DrawDeleteButtonWrapper>
					<DrawDeleteButton
						id={TestHelper.generateId(id, "draw-button")}
						data-testid={TestHelper.generateId(id, "draw-button")}
						onClick={handleStartDrawing}
						disabled={drawDeleteDisabled}
					>
						<DrawIcon />
						<DrawDeleteButtonText weight="semibold" disabled={drawDeleteDisabled}>
							Draw
						</DrawDeleteButtonText>
					</DrawDeleteButton>
					<DrawDeleteButton
						id={TestHelper.generateId(id, "delete-button")}
						data-testid={TestHelper.generateId(id, "delete-button")}
						onClick={() => setActivePrompt("delete")}
						disabled={drawDeleteDisabled}
					>
						<DeleteIcon disabled={drawDeleteDisabled} />
						<DrawDeleteButtonText weight="semibold" disabled={drawDeleteDisabled}>
							Delete
						</DrawDeleteButtonText>
					</DrawDeleteButton>
				</DrawDeleteButtonWrapper>
			)}
			{images[activeFileIndex]?.status < EImageStatus.NONE && (
				<ImageError
					id={`${id}-photo-error`}
					image={images[activeFileIndex]}
					accepts={accepts}
					maxSizeInKb={maxSizeInKb}
					onClickOk={() => handleDeleteDecision(true)}
					maxFilesErrorMessage={maxFilesErrorMessage}
					maxFiles={maxFiles}
				/>
			)}
		</ContentSection>
	);

	const renderFooter = () => (
		<FooterSection className={className ? `${className}-footer` : undefined}>
			{!drawActive ? (
				<>
					<ImageThumbnails
						id={`${id}-image-thumbnails`}
						activeFileIndex={activeFileIndex}
						accepts={accepts}
						capture={capture}
						maxFiles={maxFiles}
						images={images}
						onClickThumbnail={setActiveFileIndex}
						onSelectFile={handleSelectFile}
						multiple={multiple}
					/>
					<FooterSaveButton
						id={TestHelper.generateId(id, "save-button")}
						data-testid={TestHelper.generateId(id, "save-button")}
						onClick={handleSave}
						disabled={reviewSaveDisabled}
					>
						Save
					</FooterSaveButton>
				</>
			) : (
				<>
					<EraserButton
						id={TestHelper.generateId(id, "eraser-button")}
						data-testid={TestHelper.generateId(id, "eraser-button")}
						aria-label="eraser"
						onClick={handleEraseMode}
						active={eraseMode}
					>
						<EraserButtonIcon eraseMode={eraseMode} />
					</EraserButton>
					<PaletteHolder>
						{PALETTE_COLORS.map(({ color, colorScheme, label }, i) => (
							<Palette
								id={TestHelper.generateId(id, `palette-color-${i}`)}
								aria-label={`${label} brush`}
								color={color}
								colorScheme={colorScheme}
								key={color}
								onClick={() => handleSelectPaletteColor(color)}
							>
								{activeColor === color && <ButtonIcon colorScheme={colorScheme} />}
							</Palette>
						))}
					</PaletteHolder>
				</>
			)}
		</FooterSection>
	);

	return (
		<Modal
			id={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			className={className ? `${className}-review` : undefined}
			show={show}
		>
			<ModalBox
				className={className ? `${className}-review-modal-box` : undefined}
				imageReviewModalStyles={imageReviewModalStyles}
				showCloseButton={false}
			>
				{show ? (
					<>
						{renderHeader()}
						{renderContent()}
						{renderFooter()}
						<ImagePrompts
							images={images}
							show={activePrompt}
							onDecideClearDrawing={handleClearDrawingDecision}
							onDecideDelete={handleDeleteDecision}
							onDecideExit={handleExitDecision}
						/>
					</>
				) : (
					<></>
				)}
			</ModalBox>
		</Modal>
	);
};
