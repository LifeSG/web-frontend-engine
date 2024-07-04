import { Form } from "@lifesg/react-design-system/form";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as Yup from "yup";
import { AxiosApiClient, FileHelper, generateRandomId } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { ERROR_MESSAGES, Warning } from "../../shared";
import { IGenericFieldProps } from "../types";
import { IESignatureFieldSchema, IESignatureValue } from "./types";

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
	const [loadingProgress, setLoadingProgress] = useState<number>(null);
	const { setFieldValidationConfig } = useValidationConfig();
	const { setError } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.object()
				.shape({
					fileId: Yup.string().required(),
					dataURL: Yup.string().required(),
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
	const handleChange = async (signatureDataURL: string) => {
		const fileId = generateRandomId();
		if (!isEmpty(upload)) {
			try {
				const response = await uploadFile(fileId, signatureDataURL);
				onChange({
					target: {
						value: {
							fileId,
							...(upload.type === "base64" && { dataURL: signatureDataURL }),
							fileUrl: response?.["data"]?.["fileUrl"],
							uploadResponse: response,
						},
					},
				});
			} catch (error) {
				setError(id, { type: "onChange", message: ERROR_MESSAGES.UPLOAD().GENERIC });
			}
		} else {
			onChange({ target: { value: { fileId, dataURL: signatureDataURL } } });
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
	return (
		<>
			<Form.ESignature
				{...otherSchema}
				id={id}
				label={formattedLabel}
				errorMessage={error?.message}
				onChange={handleChange}
				value={stateValue?.dataURL}
				{...(loadingProgress !== null && { loadingProgress })}
			/>
			<Warning id={id} message={warning} />
		</>
	);
};
