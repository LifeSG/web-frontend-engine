import { Icon } from "@lifesg/react-design-system/icon";
import { Modal } from "@lifesg/react-design-system/modal";
import { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import IconEraserBlack from "../../../../assets/img/icons/eraser-black.svg";
import IconEraserBlue from "../../../../assets/img/icons/eraser-blue.svg";
import IconDeleteDisabled from "../../../../assets/img/icons/image-delete-disabled.svg";
import IconDelete from "../../../../assets/img/icons/image-delete.svg";
import IconDrawDisabled from "../../../../assets/img/icons/image-draw-disabled.svg";
import IconDraw from "../../../../assets/img/icons/image-draw.svg";
import IconPencilGrey from "../../../../assets/img/icons/pencil-grey.svg";
import IconPencilWhite from "../../../../assets/img/icons/pencil-white.svg";
import { FileHelper, ImageHelper, TestHelper } from "../../../../utils";
import { useFieldEvent, usePrevious } from "../../../../utils/hooks";
import { TFileCapture } from "../../../shared";
import { ImageContext } from "../image-context";
import { ImageUploadHelper } from "../image-upload-helper";
import { EImageStatus, IImage, TImageUploadAcceptedFileType } from "../types";
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
interface IProps {
	accepts: TImageUploadAcceptedFileType[];
	capture?: TFileCapture;
	compress?: boolean | undefined;
	dimensions: { width: number; height: number };
	id?: string | undefined;
	maxFiles: number;
	maxSizeInKb: number;
	onExit: () => void;
	outputType: string;
	show: boolean;
}

export const ImageReview = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		accepts,
		capture,
		compress,
		dimensions,
		id = "image-review",
		maxFiles,
		maxSizeInKb,
		onExit,
		outputType,
		show,
	} = props;
	const { images, setImages } = useContext(ImageContext);
	const { dispatchFieldEvent } = useFieldEvent();
	const previousShow = usePrevious(show);

	// review image
	const [activeFileIndex, setActiveFileIndex] = useState(images.length - 1);
	const [drawActive, setDrawActive] = useState(false);
	const [activePrompt, setActivePrompt] = useState<"delete" | "exit" | "clear-drawing" | null>();
	const drawDeleteDisabled = !!images?.find(({ status }) => status === EImageStatus.NONE);

	// edit image
	const [activeColor, setActiveColor] = useState(PALETTE_COLORS[0].color);
	const [eraseMode, setEraseMode] = useState(false);
	const [clearDrawing, setClearDrawing] = useState(false);
	const imageEditorRef = useRef<IImageEditorRef>(null);

	const reviewSaveDisabled =
		!!images?.find(({ addedFrom, status }) => addedFrom === "reviewModal" && status <= EImageStatus.NONE) ||
		!images.length;

	// =============================================================================
	// EFFECTS
	// =============================================================================
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
	// - REVIEW MODAL
	// =============================================================================
	const handleSelectFile = (selectedFile: File) => {
		if (
			!maxFiles ||
			(selectedFile &&
				images.filter(({ addedFrom, status }) => status >= EImageStatus.NONE || addedFrom === "reviewModal")
					.length < maxFiles)
		) {
			// image manager will handle the rest
			setImages((prev) => {
				return [
					...prev,
					{
						file: selectedFile,
						name: selectedFile.name,
						dimensions,
						status: EImageStatus.NONE,
						uploadProgress: 0,
						addedFrom: "reviewModal",
						slot: ImageUploadHelper.findAvailableSlot(prev),
					},
				];
			});
		}
	};

	const handleDeleteDecision = (decision: boolean) => {
		if (decision) {
			setImages(images.filter((image, i) => i !== activeFileIndex));
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

	const handleSave = () => {
		if (dispatchFieldEvent("save-review-images", id, { images, retry: handleSave })) {
			setImages(
				images
					.filter(({ status }) => status >= EImageStatus.NONE)
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
			setClearDrawing(true);
			setTimeout(() => setClearDrawing(false));
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
		setClearDrawing(false);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderHeader = () => (
		<HeaderSection drawActive={drawActive}>
			{!drawActive ? (
				<>
					<ReviewCloseButton
						id={TestHelper.generateId(id, "close-button")}
						data-testid={TestHelper.generateId(id, "close-button")}
						aria-label="exit review modal"
						onClick={() => setActivePrompt("exit")}
					>
						<Icon type="cross" />
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
				<ImageEditorWrapper>
					<Suspense fallback={null}>
						<ImageEditor
							baseImageDataURL={images[activeFileIndex]?.dataURL}
							drawing={images[activeFileIndex]?.drawing}
							color={drawActive ? activeColor : undefined}
							erase={drawActive ? eraseMode : false}
							clear={clearDrawing}
							ref={imageEditorRef}
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
						<DrawIcon src={!drawDeleteDisabled ? IconDraw : IconDrawDisabled} />
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
						<DeleteIcon src={!drawDeleteDisabled ? IconDelete : IconDeleteDisabled} />
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
				/>
			)}
		</ContentSection>
	);

	const renderFooter = () => (
		<FooterSection>
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
						<ButtonIcon src={!eraseMode ? IconEraserBlack : IconEraserBlue} alt="" />
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
								{activeColor === color && (
									<ButtonIcon src={colorScheme === "light" ? IconPencilGrey : IconPencilWhite} />
								)}
							</Palette>
						))}
					</PaletteHolder>
				</>
			)}
		</FooterSection>
	);

	return (
		<Modal id={TestHelper.generateId(id, undefined, show ? "show" : "hide")} show={show}>
			<ModalBox className={TestHelper.generateId(id, "modal-box")} statusBarHeight={0} showCloseButton={false}>
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
