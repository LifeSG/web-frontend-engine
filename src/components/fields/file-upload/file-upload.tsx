import { FileUpload as DSFileUpload, FileItemProps } from "@lifesg/react-design-system/file-upload";
import { Suspense, lazy, useContext, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { IGenericFieldProps } from "..";
import { FileHelper } from "../../../utils";
import { useFieldEvent, useValidationConfig } from "../../../utils/hooks";
import { IYupValidationRule } from "../../frontend-engine";
import { ERROR_MESSAGES, Sanitize } from "../../shared";
import { FileUploadContext, FileUploadProvider } from "./file-upload-context";
import { FileUploadHelper } from "./file-upload-helper";
import { EFileStatus, IFile, IFileUploadSchema, IFileUploadValidationRule, IFileUploadValue } from "./types";

// lazy load to fix next.js SSR errors
const FileUploadManager = lazy(() => import("./file-upload-manager"));

export const FileUploadInner = (props: IGenericFieldProps<IFileUploadSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		error,
		isDirty,
		value,
		schema: { compressImages, description, label, uploadOnAddingFile, validation, warning, ...otherSchema },
	} = props;
	const { files, setFiles } = useContext(FileUploadContext);
	const fileTypeRuleRef = useRef<IFileUploadValidationRule>({});
	const maxFilesRuleRef = useRef<IYupValidationRule>({});
	const maxFileSizeRuleRef = useRef<IFileUploadValidationRule>({});
	const { setFieldValidationConfig } = useValidationConfig();
	const { dispatchFieldEvent } = useFieldEvent();
	const { clearErrors, setError } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		dispatchFieldEvent("mount", id);
	}, []);

	useEffect(() => {
		const isRequiredRule = validation?.find((rule) => "required" in rule);
		const acceptedFileTypeRule: IFileUploadValidationRule = validation?.find((rule) => "fileType" in rule);
		const matchedMaxFileSizeRule: IFileUploadValidationRule = validation?.find((rule) => "maxSizeInKb" in rule);
		if (acceptedFileTypeRule?.["fileType"]) {
			fileTypeRuleRef.current = acceptedFileTypeRule;
		} else {
			fileTypeRuleRef.current = {};
		}
		if (matchedMaxFileSizeRule?.["maxSizeInKb"] > 0) {
			maxFileSizeRuleRef.current = matchedMaxFileSizeRule;
		} else {
			maxFileSizeRuleRef.current = {};
		}

		const lengthRule = validation?.find((rule) => "length" in rule);
		const maxRule = validation?.find((rule) => "max" in rule);
		if (lengthRule) {
			maxFilesRuleRef.current = { max: lengthRule.length, errorMessage: lengthRule.errorMessage };
		} else if (maxRule) {
			maxFilesRuleRef.current = { max: maxRule.max, errorMessage: maxRule.errorMessage };
		} else {
			maxFilesRuleRef.current = {};
		}

		setFieldValidationConfig(
			id,
			Yup.array()
				.of(
					Yup.object().shape({
						dataURL: Yup.string(),
						fileId: Yup.string(),
						fileName: Yup.string(),
						fileUrl: Yup.string(),
						uploadResponse: Yup.object(),
					})
				)
				.test("is-empty-array", isRequiredRule?.errorMessage || ERROR_MESSAGES.UPLOAD().REQUIRED, (value) => {
					if (!value || !isRequiredRule?.required) return true;
					return value.length > 0;
				})
				.test(
					"max-size-in-kb",
					maxFileSizeRuleRef.current.errorMessage ||
						ERROR_MESSAGES.UPLOAD().MAX_FILE_SIZE(maxFileSizeRuleRef.current.maxSizeInKb),
					(value) => {
						if (!value || !Array.isArray(value) || !maxFileSizeRuleRef.current.maxSizeInKb) return true;
						return files
							.filter((file) => file.status === EFileStatus.UPLOADED)
							.every((file) => {
								if (uploadOnAddingFile.type === "base64") {
									return (
										FileHelper.getFilesizeFromBase64(file.dataURL) <=
										maxFileSizeRuleRef.current.maxSizeInKb * 1024
									);
								} else if (uploadOnAddingFile.type === "multipart") {
									return file.rawFile.size <= maxFileSizeRuleRef.current.maxSizeInKb * 1024;
								}
							});
					}
				)
				.test(
					"max-files",
					maxFilesRuleRef.current.errorMessage ||
						ERROR_MESSAGES.UPLOAD().MAX_FILES(maxFilesRuleRef.current.max),
					(value) => {
						if (!value || !Array.isArray(value) || !maxFilesRuleRef.current.max) return true;
						return value.length <= maxFilesRuleRef.current.max;
					}
				),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation, files.map((file) => file.status).join(",")]);

	useEffect(() => {
		// for defaultValue
		if (!isDirty && Array.isArray(value)) {
			const newFiles: IFile[] = [];
			(value as IFileUploadValue[]).forEach(({ dataURL, fileId, fileName, fileUrl, uploadResponse }) => {
				newFiles.push({
					addedFrom: "schema",
					dataURL,
					fileItem: {
						id: fileId,
					} as FileItemProps,
					uploadResponse,
					fileUrl,
					rawFile: {
						name: fileName,
					} as File,
					slot: null,
					status: EFileStatus.INJECTED,
				});
			});
			handleNewFiles(newFiles, []);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDirty]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleChange = (rawFiles: File[]) => {
		handleNewFiles(
			rawFiles.map((rawFile) => ({
				addedFrom: "input" as const,
				rawFile,
				slot: null,
				status: EFileStatus.NONE,
			})),
			files
		);
	};

	const handleDelete = (fileItemToDelete: FileItemProps) => {
		setFiles(
			files.map((file) => {
				if (file.fileItem.id !== fileItemToDelete.id) return file;
				else {
					return {
						...file,
						status: EFileStatus.TO_DELETE,
					};
				}
			})
		);
		clearErrors(id);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const handleNewFiles = (newFiles: IFile[], oldFiles: IFile[]) => {
		const updatedFiles = [...oldFiles];
		const fileCount = updatedFiles.length;
		newFiles.forEach((newFile, i) => {
			if (!maxFilesRuleRef.current.max || fileCount + i < maxFilesRuleRef.current.max) {
				updatedFiles.push({ ...newFile, slot: FileUploadHelper.findAvailableSlot(updatedFiles) });
				clearErrors(id);
			} else {
				setError(id, {
					type: "max",
					message:
						maxFilesRuleRef.current.errorMessage ||
						ERROR_MESSAGES.UPLOAD().MAX_FILES(maxFilesRuleRef.current.max),
				});
			}
		});
		setFiles(updatedFiles);
	};

	const generateAcceptedFileTypes = () =>
		fileTypeRuleRef.current.fileType?.map((fileType) => `.${fileType}`).join(",");

	const convertToFileItems = () =>
		files
			.filter(
				({ fileItem, status }) =>
					!!fileItem && status !== EFileStatus.INJECTED && status !== EFileStatus.INJECTING
			)
			.map(({ fileItem }) => fileItem);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderHtmlText = (htmlText: string) => {
		if (!htmlText) return null;
		return <Sanitize>{htmlText}</Sanitize>;
	};

	return (
		<>
			<Suspense fallback={null}>
				<FileUploadManager
					id={id}
					fileTypeRule={fileTypeRuleRef.current}
					maxFileSizeRule={maxFileSizeRuleRef.current}
					upload={uploadOnAddingFile}
					value={value}
					compressImages={!!compressImages}
				/>
			</Suspense>
			<DSFileUpload
				{...otherSchema}
				accept={generateAcceptedFileTypes()}
				description={renderHtmlText(description)}
				errorMessage={error?.message}
				fileItems={convertToFileItems()}
				id={id}
				maxFiles={maxFilesRuleRef.current.max}
				onChange={handleChange}
				onDelete={handleDelete}
				title={renderHtmlText(label)}
				warning={renderHtmlText(warning)}
			/>
		</>
	);
};

export const FileUpload = (props: IGenericFieldProps<IFileUploadSchema>) => (
	<FileUploadProvider>
		<FileUploadInner {...props} />
	</FileUploadProvider>
);
