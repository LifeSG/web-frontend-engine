import { Modal } from "@lifesg/react-design-system/modal";
import {
	Breakpoint,
	useApplyStyle,
	useMediaQuery,
	useResolvedBreakpointToken,
} from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import { BinIcon } from "@lifesg/react-icons/bin";
import { CrossIcon } from "@lifesg/react-icons/cross";
import { EraserIcon } from "@lifesg/react-icons/eraser";
import { PencilIcon } from "@lifesg/react-icons/pencil";
import { PencilStrokeIcon } from "@lifesg/react-icons/pencil-stroke";
import clsx from "clsx";
import { Suspense, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FileHelper, ImageHelper, TestHelper, generateRandomId } from "../../../../utils";
import { useFieldEvent, usePrevious } from "../../../../utils/hooks";
import { ImageContext } from "../image-context";
import { ImageUploadHelper } from "../image-upload-helper";
import { EImageStatus, IDismissReviewModalEvent, IImage, ISharedImageProps, TFileCapture } from "../types";
import { IImageEditorRef } from "./image-editor";
import { ImageError } from "./image-error";
import { ImagePrompts } from "./image-prompts";
import * as styles from "./image-review.styles";
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

// =============================================================================
// PALETTE ITEM
// =============================================================================
interface IPaletteItemProps {
	id: string;
	color: string;
	colorScheme?: string;
	ariaLabel: string;
	isActive: boolean;
	onClick: () => void;
}

const PaletteItem = ({ id, color, colorScheme, ariaLabel, isActive, onClick }: IPaletteItemProps) => {
	const paletteRef = useRef<HTMLButtonElement>(null);

	useApplyStyle(paletteRef, {
		[styles.tokens.palette.color]: color,
	});

	return (
		<button
			ref={paletteRef}
			id={id}
			data-testid={id}
			className={clsx(styles.palette, colorScheme === "light" && styles.paletteColorSchemeLight)}
			aria-label={ariaLabel}
			onClick={onClick}
		>
			{isActive && (
				<PencilIcon
					className={clsx(styles.buttonIcon, colorScheme === "light" && styles.buttonIconColorSchemeLight)}
				/>
			)}
		</button>
	);
};

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
	const smMaxToken = useResolvedBreakpointToken(Breakpoint["sm-max"]);
	const isMobileLandscape = useMediaQuery({
		clauses: [
			{ feature: "orientation", value: "landscape" },
			{ feature: "max-height", value: smMaxToken },
		],
	});

	// Stable unique id used to scope consumer-provided imageReviewModalStyles to
	// this specific modal instance, avoiding style leakage to other elements.
	const modalStyleId = useMemo(() => `image-review-${generateRandomId()}`, []);
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
		<div
			className={clsx(
				styles.headerSection,
				drawActive && styles.headerSectionDrawActive,
				className && `${className}-header`
			)}
		>
			{!drawActive ? (
				<>
					<Button
						className={styles.reviewCloseButton}
						id={TestHelper.generateId(id, "close-button")}
						data-testid={TestHelper.generateId(id, "close-button")}
						aria-label="exit review modal"
						onClick={() => setActivePrompt("exit")}
						icon={<CrossIcon />}
					/>
					<Typography.BodyMD className={styles.reviewTitle} weight="semibold">
						Review photos
					</Typography.BodyMD>
				</>
			) : (
				<>
					<button
						className={styles.editHeaderButton}
						id={TestHelper.generateId(id, "clear-drawing-button")}
						data-testid={TestHelper.generateId(id, "clear-drawing-button")}
						onClick={() => setActivePrompt("clear-drawing")}
					>
						Clear
					</button>
					<button
						className={styles.editHeaderButton}
						id={TestHelper.generateId(id, "save-drawing")}
						data-testid={TestHelper.generateId(id, "save-drawing")}
						onClick={handleSaveDrawing}
					>
						Save
					</button>
				</>
			)}
		</div>
	);

	const renderContent = () => (
		<div className={styles.contentSection}>
			{images.length > 0 && (
				<div className={clsx(styles.imageEditorWrapper, className && `${className}-editor`)}>
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
				</div>
			)}
			{images.length > 0 && (
				<Typography.HeadingXS className={styles.loadingPreviewText}>Loading Preview...</Typography.HeadingXS>
			)}
			{!drawActive && images[activeFileIndex]?.status >= EImageStatus.NONE && (
				<div className={styles.drawDeleteButtonWrapper}>
					<Button
						className={styles.drawDeleteButton}
						id={TestHelper.generateId(id, "draw-button")}
						data-testid={TestHelper.generateId(id, "draw-button")}
						onClick={handleStartDrawing}
						disabled={drawDeleteDisabled}
						icon={
							<PencilStrokeIcon
								className={clsx(styles.drawIcon, drawDeleteDisabled && styles.drawIconDisabled)}
							/>
						}
					>
						<Typography.BodySM
							className={clsx(
								styles.drawDeleteButtonText,
								drawDeleteDisabled && styles.drawDeleteButtonTextDisabled
							)}
							weight="semibold"
						>
							Draw
						</Typography.BodySM>
					</Button>
					<Button
						className={styles.drawDeleteButton}
						id={TestHelper.generateId(id, "delete-button")}
						data-testid={TestHelper.generateId(id, "delete-button")}
						onClick={() => setActivePrompt("delete")}
						disabled={drawDeleteDisabled}
						icon={
							<BinIcon
								className={clsx(styles.deleteIcon, drawDeleteDisabled && styles.deleteIconDisabled)}
							/>
						}
					>
						<Typography.BodySM
							className={clsx(
								styles.drawDeleteButtonText,
								drawDeleteDisabled && styles.drawDeleteButtonTextDisabled
							)}
							weight="semibold"
						>
							Delete
						</Typography.BodySM>
					</Button>
				</div>
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
		</div>
	);

	const renderFooter = () => (
		<div className={clsx(styles.footerSection, className && `${className}-footer`)}>
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
					<Button
						className={styles.footerSaveButton}
						id={TestHelper.generateId(id, "save-button")}
						data-testid={TestHelper.generateId(id, "save-button")}
						onClick={handleSave}
						disabled={reviewSaveDisabled}
					>
						Save
					</Button>
				</>
			) : (
				<>
					<button
						className={styles.eraserButton}
						id={TestHelper.generateId(id, "eraser-button")}
						data-testid={TestHelper.generateId(id, "eraser-button")}
						aria-label="eraser"
						onClick={handleEraseMode}
					>
						<EraserIcon
							className={clsx(styles.eraserButtonIcon, eraseMode && styles.eraserButtonIconEraseMode)}
						/>
					</button>
					<div className={styles.paletteHolder}>
						{PALETTE_COLORS.map(({ color, colorScheme, label }, i) => (
							<PaletteItem
								key={color}
								id={TestHelper.generateId(id, `palette-color-${i}`)}
								color={color}
								colorScheme={colorScheme}
								ariaLabel={`${label} brush`}
								isActive={activeColor === color}
								onClick={() => handleSelectPaletteColor(color)}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);

	return (
		<Modal
			id={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			className={className ? `${className}-review` : undefined}
			show={show}
		>
			<Modal.Box
				className={clsx(
					styles.modalBox,
					imageReviewModalStyles && modalStyleId,
					className && `${className}-review-modal-box`
				)}
				showCloseButton={false}
				data-mobile-landscape={!!isMobileLandscape}
			>
				{show ? (
					<>
						{imageReviewModalStyles && <style>{`.${modalStyleId} { ${imageReviewModalStyles} }`}</style>}
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
			</Modal.Box>
		</Modal>
	);
};
