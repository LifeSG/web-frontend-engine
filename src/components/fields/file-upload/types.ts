import { FileItemProps, FileUploadProps } from "@lifesg/react-design-system";
import { AxiosRequestConfig } from "axios";
import { IYupValidationRule } from "../../../context-providers";
import { TFieldEventListener } from "../../../utils";
import { TErrorMessage } from "../../frontend-engine";
import { IBaseFieldSchema } from "../types";

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
	uploadOnAddingFile: {
		type: TUploadType;
		url: string;
		headers?: AxiosRequestConfig["headers"] | undefined;
		sessionId?: string | undefined;
	};
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

type Implements<T, U extends T> = U;

export type TFileUploadErrorObject = {
	message?: string | undefined;
	fileErrors?:
		| {
				[fileId: string]: string;
		  }
		| undefined;
};

// Implements<T> ensures `TFileUploadErrorMessage` conforms to `TErrorMessage`
export type TFileUploadErrorMessage = Implements<TErrorMessage, string | TFileUploadErrorObject>;

export type TUploadErrorDetail = {
	fileId: string;
	errorData: unknown;
};

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
/** fired when file upload throws error */
function fileUploadEvent(
	uiType: "file-upload",
	type: "upload-error",
	id: string,
	listener: TFieldEventListener<TUploadErrorDetail>,
	options?: boolean | AddEventListenerOptions | undefined
): void;
function fileUploadEvent() {
	//
}
export type TFileUploadEvents = typeof fileUploadEvent;
