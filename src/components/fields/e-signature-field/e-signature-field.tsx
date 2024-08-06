import { Form } from "@lifesg/react-design-system/form";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { AxiosApiClient, FileHelper, generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { IGenericFieldProps } from "../types";
import { ESignatureWrapper, ErrorWrapper, RefreshAlert, TryAgain } from "./e-signature-field.styles";
import { IESignatureFieldSchema, IESignatureFieldValidationRule, IESignatureValue } from "./types";

export const ESignatureField = (props: IGenericFieldProps<IESignatureFieldSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		error,
		formattedLabel,
		id,
		onChange,
		schema: { label: _label, uiType: _uiType, upload, validation, ...otherSchema },
		value,
		warning,
	} = props;
	const [stateValue, setStateValue] = useState<IESignatureValue>(value);
	const [signatureDataURL, setSignatureDataURL] = useState<string>(null);
	const [uploadErrorCount, setUploadErrorCount] = useState(0);
	const [loadingProgress, setLoadingProgress] = useState<number>(null);
	const { setFieldValidationConfig } = useValidationConfig();
	const uploadRuleRef = useRef<IESignatureFieldValidationRule>(null);
	const { clearErrors } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		const uploadRule = validation?.find(
			(rule): rule is IESignatureFieldValidationRule => "upload" in rule && rule.upload
		);
		uploadRuleRef.current = uploadRule;

		setFieldValidationConfig(
			id,
			Yup.object()
				.shape({
					fileId: Yup.string().required(),
					dataURL: Yup.string(),
					fileUrl: Yup.string(),
					uploadResponse: Yup.mixed().nullable(),
				})
				.default(undefined),
			validation
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	// =============================================================================
	// EVENT HANDLER
	// =============================================================================
	const handleChange = async (dataURL: string) => {
		const fileId = generateRandomId();
		setSignatureDataURL(dataURL);
		if (!isEmpty(upload)) {
			try {
				const response = await uploadFile(fileId, dataURL);
				onChange({
					target: {
						value: {
							fileId,
							...(upload.type === "base64" && { dataURL }),
							fileUrl: response?.["data"]?.["fileUrl"],
							uploadResponse: response,
						},
					},
				});
				clearErrors(id);
				setUploadErrorCount(0);
			} catch (error) {
				setUploadErrorCount((prevCount) => prevCount + 1);
				setLoadingProgress(null);
			}
		} else {
			onChange({ target: { value: { fileId, dataURL } } });
		}
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const uploadFile = async (fileId: string, signatureDataURL: string) => {
		setLoadingProgress(0);
		const formData = new FormData();
		formData.append("fileId", fileId);
		if (upload.type === "base64") {
			formData.append("dataURL", signatureDataURL);
		} else if (upload.type === "multipart") {
			const blob = await FileHelper.dataUrlToBlob(signatureDataURL);
			const file = FileHelper.blobToFile(blob, { name: fileId, lastModified: Date.now() });
			formData.append("file", file, fileId);
		}

		const response = await new AxiosApiClient("", undefined, undefined, true).post(upload.url, formData, {
			headers: {
				"Content-Type": upload.type === "base64" ? "application/json" : "multipart/form-data",
			},
			onUploadProgress: (progressEvent) => {
				const { loaded, total } = progressEvent;
				setLoadingProgress(loaded / total);
			},
		});
		setLoadingProgress(null);
		return response;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderError = () => {
		if ((!error?.message && !uploadErrorCount) || loadingProgress !== null) return null;

		// upload error takes highest precedence
		if (uploadErrorCount > 0) {
			return (
				<ErrorWrapper weight="semibold">
					{uploadRuleRef.current?.errorMessage || ERROR_MESSAGES.ESIGNATURE.UPLOAD}
					<TryAgain type="button" onClick={() => handleChange(signatureDataURL)}>
						Please try again.
					</TryAgain>
					{uploadErrorCount >= 3 && (
						<RefreshAlert type="warning" data-testid="refresh-alert">
							Refresh this page if you cannot upload your signature.
						</RefreshAlert>
					)}
				</ErrorWrapper>
			);
		}

		return <ErrorWrapper weight="semibold">{error?.message}</ErrorWrapper>;
	};

	return (
		<ESignatureWrapper>
			<Form.ESignature
				{...otherSchema}
				id={id}
				label={formattedLabel}
				onChange={handleChange}
				value={stateValue?.dataURL}
				{...(loadingProgress !== null && { loadingProgress })}
			/>
			{renderError()}
			<Warning id={id} message={warning} />
		</ESignatureWrapper>
	);
};
