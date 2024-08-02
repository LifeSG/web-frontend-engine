import { FileItemProps, FileUploadProps } from "@lifesg/react-design-system";
import { IYupValidationRule } from "../../../context-providers";
import { IBaseFieldSchema } from "../types";
import { TFieldEventListener } from "../../../utils";

export type TUploadType = "base64" | "multipart";

export interface IFileUploadValidationRule extends IYupValidationRule {
	/** for customising upload error message */
	upload?: boolean | undefined;
	/** accepted file types */
	fileType?: string[] | undefined;
	/** max acceptable file size in kb */
	maxSizeInKb?: number | undefined;
}

export interface IFileUploadSchema<V = undefined>
	extends IBaseFieldSchema<"file-upload", V, IFileUploadValidationRule>,
		Pick<FileUploadProps, "capture" | "data-testid" | "disabled" | "readOnly" | "styleType"> {
	className?: string | undefined;
	description?: string | undefined;
	label: string;
	uploadOnAddingFile: { type: TUploadType; url: string };
	warning?: string | undefined;
	compressImages?: boolean | undefined;
}

export enum EFileStatus {
	INJECTED = -99,
	INJECTING = -98,
	TO_DELETE = -4,
	ERROR_FORMAT = -3,
	ERROR_GENERIC = -2,
	ERROR_SIZE = -1,
	NONE = 0,
	UPLOAD_READY = 4,
	UPLOADING = 5,
	UPLOADED = 6,
}

export interface IFile {
	addedFrom: "input" | "schema";
	dataURL?: string | undefined;
	fileItem?: FileItemProps | undefined;
	fileUrl?: string | undefined;
	rawFile: File;
	slot: number;
	status: EFileStatus;
	uploadResponse?: unknown | undefined;
}

export interface IFileUploadValue {
	dataURL?: string | undefined;
	fileId: string;
	fileName: string;
	fileUrl?: string | undefined;
	uploadResponse?: unknown | undefined;
}
// =============================================================================
// EVENTS (fired from FEE)
// =============================================================================
/** fired when field is mounted */
function fileUploadEvent(
	uiType: "file-upload",
	type: "mount",
	id: string,
	listener: TFieldEventListener,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function fileUploadEvent() {
	//
}
export type TFileUploadEvents = typeof fileUploadEvent;
