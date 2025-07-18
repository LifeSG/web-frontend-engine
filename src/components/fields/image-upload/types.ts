import { FabricObject } from "fabric";
import { IBaseFieldSchema } from "../types";
import { IYupValidationRule } from "../../../context-providers";
import { TFieldEventListener } from "../../../utils";

export type TFileCapture = boolean | "user" | "environment" | undefined;
export type TUploadMethod = "post" | "put" | "patch";
export const ACCEPTED_FILE_TYPES = ["jpg", "gif", "png", "heic", "heif", "webp"] as const;
export type TImageUploadAcceptedFileType = (typeof ACCEPTED_FILE_TYPES)[number];
export type TImageUploadOutputFileType = "jpg" | "png";

export interface IImageUploadValidationRule extends IYupValidationRule {
	/** for customising upload error message */
	upload?: boolean | undefined;
	/** accepted file types */
	fileType?: TImageUploadAcceptedFileType[] | undefined;
	/** max acceptable file size in kb */
	maxSizeInKb?: number | undefined;
}

export interface IImageUploadSchema<V = undefined>
	extends IBaseFieldSchema<"image-upload", V, IImageUploadValidationRule> {
	buttonLabel?: string | undefined;
	className?: string | undefined;
	description?: string | undefined;
	editImage?: boolean | undefined;
	label: string;
	outputType?: TImageUploadOutputFileType | undefined;
	uploadOnAddingFile?: { method: TUploadMethod; url: string; sessionId?: string | undefined } | undefined;
	compress?: boolean | undefined;
	dimensions?: IImageDimensions | undefined;
	capture?: TFileCapture | undefined;
	multiple?: boolean | undefined;
	imageReviewModalStyles?: string | undefined;
}

export interface ISharedImageProps {
	id?: string | undefined;
	accepts: TImageUploadAcceptedFileType[];
	maxSizeInKb: number;
	maxFiles: number;
}

export enum EImageStatus {
	INJECTED = -99,
	ERROR_CUSTOM_MUTED = -7,
	ERROR_EXCEED = -6,
	ERROR_CUSTOM = -5,
	TO_DELETE = -4,
	ERROR_FORMAT = -3,
	ERROR_GENERIC = -2,
	ERROR_SIZE = -1,
	NONE = 0,
	TO_RECOMPRESS = 1,
	// compressed / recompressed / converted refer to the same step
	// got different steps due to different configs
	// recompressed wont fire some events
	COMPRESSED = 2,
	RECOMPRESSED = 2,
	CONVERTED = 2,
	EDITED = 3,
	UPLOAD_READY = 4,
	UPLOADING = 5,
	UPLOADED = 6,
	PENDING = 7,
}

export interface IImage {
	id: string;
	file: File;
	name: string;
	type?: string | undefined;
	/** refers to preview dimensions and eventual output dimensions */
	dimensions: IImageDimensions;
	dataURL?: string;
	thumbnailDataURL?: string;
	drawingDataURL?: string;
	drawing?: FabricObject[];
	status: EImageStatus;
	addedFrom?: "dragInput" | "reviewModal" | "schema";
	uploadProgress: number;
	uploadResponse?: any;
	slot: number;
	customErrorMessage?: string | undefined;
	metadata?: IImageMetadata | undefined;
}

export interface IImageDimensions {
	width: number;
	height: number;
}

export interface IUpdateImageStatus {
	id: string;
	updatedStatus: EImageStatus;
	errorMessage?: string | undefined;
}

export interface IUploadedImage {
	dataURL: string;
	fileId: string;
	fileName: string;
	uploadResponse?: any;
}

export interface IDismissReviewModalEvent {
	removePendingImages: boolean;
}

export interface IImageMetadata {
	dateTimeOriginal: string | undefined;
	lat: number | undefined;
	lng: number | undefined;
}
// =============================================================================
// EVENTS (fired from FEE)
// =============================================================================
/** fired when field is mounted */
function imageUploadEvent(
	uiType: "image-upload",
	type: "mount",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
/** fired when file dialog is shown */
function imageUploadEvent(
	uiType: "image-upload",
	type: "file-dialog",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
/**
 * fired when an image is ready to be uploaded
 *
 * `event.preventDefault()` will stop the image from getting uploaded
 * */
function imageUploadEvent(
	uiType: "image-upload",
	type: "upload-ready",
	id: string,
	listener: TFieldEventListener<{ imageData: IImage }>,
	options?: boolean | AddEventListenerOptions | undefined
): void;
/** fired when image review modal is shown */
function imageUploadEvent(
	uiType: "image-upload",
	type: "show-review-modal",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
/** fired on dismissing image review modal  */
function imageUploadEvent(
	uiType: "image-upload",
	type: "hide-review-modal",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
/**
 * fired on clicking save button in image review modal
 *
 * `event.preventDefault()` will stop all pending images from being uploaded
 * */
function imageUploadEvent(
	uiType: "image-upload",
	type: "save-review-images",
	id: string,
	listener: TFieldEventListener<{ images: IImage[]; retry: () => void }>,
	options?: boolean | AddEventListenerOptions | undefined
): void;
/** fired when an image is uploaded to the url specified in `uploadOnAddingFile`
 * */
function imageUploadEvent(
	uiType: "image-upload",
	type: "uploaded",
	id: string,
	listener: TFieldEventListener<{ imageData: IImage }>,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function imageUploadEvent() {
	//
}
export type TImageUploadEvents = typeof imageUploadEvent;

// =============================================================================
// TRIGGERS (fired from outside FEE)
// =============================================================================
/** update status and error message according to id */
function imageUploadTrigger(
	uiType: "image-upload",
	type: "update-image-status",
	id: string,
	details: IUpdateImageStatus
): boolean;
/** update the status of images added through the image review modal as `UPLOAD_READY` and initiates the uploading of these images */
function imageUploadTrigger(uiType: "image-upload", type: "trigger-save-review-images", id: string): boolean;
/** hide image review modal, with option to discard images that have not been uploaded yet */
function imageUploadTrigger(
	uiType: "image-upload",
	type: "dismiss-review-modal",
	id: string,
	details: IDismissReviewModalEvent
): boolean;
function imageUploadTrigger() {
	return true;
}
export type TImageUploadTriggers = typeof imageUploadTrigger;
