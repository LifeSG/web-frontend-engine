import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AxiosRequestConfig } from "axios";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { useEffect, useRef } from "react";
import { FrontendEngine } from "../../../../components";
import { IFileUploadSchema, TFileUploadErrorMessage, TUploadType } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../../components/types";
import { AxiosApiClient, FileHelper, ImageHelper } from "../../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	flushPromise,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const JPG_BASE64 =
	"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=";
const FILE_1 = new File(["file"], "test.jpg", {
	type: "image/jpeg",
});
const FILE_2 = new File(["file"], "test2.jpg", {
	type: "image/jpeg",
});
const COMPONENT_ID = "field";
const UI_TYPE = "file-upload";
const SUBMIT_FN = jest.fn();
const UPLOAD_URL = "test";
let uploadSpy: jest.SpyInstance;

const getDragInputUploadField = (): HTMLElement => screen.getByTestId("dropzone-input");
const getCustomButton = (): HTMLElement => screen.getByRole("button", { name: "Custom Button" });

interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	eventType: string;
	eventListener: (this: Element, ev: Event) => void;
	onClick?: (ref: React.MutableRefObject<IFrontendEngineRef>) => void;
}
const FrontendEngineWithEventListener = (props: ICustomFrontendEngineProps) => {
	const { eventType, eventListener, onClick, ...otherProps } = props;
	const formRef = useRef<IFrontendEngineRef>();
	useEffect(() => {
		if (eventType && eventListener) {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(UI_TYPE, eventType as any, "field", eventListener);
			return () => currentFormRef.removeFieldEventListener(UI_TYPE, eventType as any, "field", eventListener);
		}
	}, [eventListener, eventType]);

	return (
		<>
			<FrontendEngine {...otherProps} ref={formRef} />
			<button type="button" onClick={() => onClick(formRef)}>
				Custom Button
			</button>
		</>
	);
};

interface IRenderAndPerformActionsOptions {
	overrideField?: TOverrideField<IFileUploadSchema> | undefined;
	overrideSchema?: TOverrideSchema | undefined;
	files?: { name: string; type: string }[] | undefined;
	inputType?: "input" | "drag & drop" | undefined;
	uploadType?: TUploadType | undefined;
	headers?: AxiosRequestConfig["headers"];
	eventType?: string | undefined;
	eventListener?: ((this: Element, ev: Event) => unknown) | undefined;
	onClick?: (ref: React.MutableRefObject<IFrontendEngineRef>) => void;
}

/**
 * render component
 * upload with file(s) specified
 * optionally go to review modal
 */
const renderComponent = async (options: IRenderAndPerformActionsOptions = {}) => {
	jest.spyOn(ImageHelper, "convertBlob").mockResolvedValue(JPG_BASE64);
	jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });

	const {
		overrideField,
		overrideSchema,
		eventType,
		eventListener,
		files = [],
		inputType = "input",
		uploadType = "base64",
		headers = {},
		onClick,
	} = options;
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Upload",
						uiType: UI_TYPE,
						uploadOnAddingFile: {
							type: uploadType,
							url: UPLOAD_URL,
							headers,
						},
						...overrideField,
					},
					...getSubmitButtonProps(),
					...getResetButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	render(
		<FrontendEngineWithEventListener
			data={json}
			onSubmit={SUBMIT_FN}
			eventType={eventType}
			eventListener={eventListener}
			onClick={onClick}
		/>
	);

	const uploadField = await waitFor(() =>
		inputType === "input" ? getDragInputUploadField() : screen.getByTestId("dropzone")
	);
	await act(async () => {
		for (let i = 0; i < files.length; i++) {
			fireEvent[inputType === "input" ? "change" : "drop"](uploadField, {
				target: {
					files: [files[i]],
				},
			});
			await flushPromise(200);
		}
	});
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		setupJestCanvasMock();
		jest.spyOn(ImageHelper, "dataUrlToImage").mockResolvedValue(new Image());
		uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({});
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it("should be able to render the field", async () => {
		await renderComponent();

		expect(getDragInputUploadField()).toBeInTheDocument();
		expect(screen.getByText("Upload")).toBeInTheDocument();
	});

	describe("default value", () => {
		beforeEach(() => {
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);
			jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });
		});

		it("should support default value based on dataURL", async () => {
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ dataURL: JPG_BASE64, fileId: FILE_1.name, fileName: FILE_1.name }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
				await waitFor(() => fireEvent.click(getSubmitButton()));
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({ dataURL: JPG_BASE64, fileId: FILE_1.name, fileName: FILE_1.name }),
					]),
				})
			);
		});

		it("should support default value based on fileUrl", async () => {
			jest.spyOn(AxiosApiClient.prototype, "get").mockResolvedValue(FILE_1);
			const fileUrl = "dummy url";
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileUrl, fileId: FILE_1.name, fileName: FILE_1.name }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
				await waitFor(() => fireEvent.click(getSubmitButton()));
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({
							dataURL: await FileHelper.fileToDataUrl(FILE_1),
							fileId: FILE_1.name,
							fileName: FILE_1.name,
							fileUrl,
						}),
					]),
				})
			);
		});

		it("should support default value without dataURL and fileUrl", async () => {
			jest.spyOn(AxiosApiClient.prototype, "get").mockResolvedValue(FILE_1);
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileId: FILE_1.name, fileName: FILE_1.name }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
				await waitFor(() => fireEvent.click(getSubmitButton()));
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({
							dataURL: undefined,
							fileId: FILE_1.name,
							fileName: FILE_1.name,
						}),
					]),
				})
			);
		});

		it("should determine file size based on uploadResponse when dataURL and fileUrl are not present (flat structure)", async () => {
			const uploadResponse = {
				fileId: "f307b120-6c4d-4b2c-b278-33bb9aefbc6e",
				fileName: "my-image.jpg",
				fileSize: 595705,
				mimeType: "image/jpeg",
				uploadedAt: "2025-01-01T03:57:55.573Z",
			};
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileId: FILE_1.name, fileName: FILE_1.name, uploadResponse }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByText("582 KB")).toBeInTheDocument();
			});
		});

		it("should determine file size based on uploadResponse when dataURL and fileUrl are not present (nested structure)", async () => {
			const uploadResponse = {
				data: {
					fileId: "f307b120-6c4d-4b2c-b278-33bb9aefbc6e",
					fileName: "my-image.jpg",
					fileSize: 595705,
					mimeType: "image/jpeg",
					uploadedAt: "2025-01-01T03:57:55.573Z",
				},
			};
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileId: FILE_1.name, fileName: FILE_1.name, uploadResponse }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByText("582 KB")).toBeInTheDocument();
			});
		});

		it("should display 0kb when dataURL and fileUrl are not present", async () => {
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileId: FILE_1.name, fileName: FILE_1.name }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByText("0 KB")).toBeInTheDocument();
			});
		});

		it("should display 0kb when dataURL and fileUrl are not present and uploadResponse.fileSize is not a number (flat structure)", async () => {
			const uploadResponse = {
				fileId: "f307b120-6c4d-4b2c-b278-33bb9aefbc6e",
				fileName: "my-image.jpg",
				fileSize: "test",
				mimeType: "image/jpeg",
				uploadedAt: "2025-01-01T03:57:55.573Z",
			};
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileId: FILE_1.name, fileName: FILE_1.name, uploadResponse }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByText("0 KB")).toBeInTheDocument();
			});
		});

		it("should display 0kb when dataURL and fileUrl are not present and uploadResponse.data.fileSize is not a number (nested structure)", async () => {
			const uploadResponse = {
				data: {
					fileId: "f307b120-6c4d-4b2c-b278-33bb9aefbc6e",
					fileName: "my-image.jpg",
					fileSize: "test",
					mimeType: "image/jpeg",
					uploadedAt: "2025-01-01T03:57:55.573Z",
				},
			};
			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ fileId: FILE_1.name, fileName: FILE_1.name, uploadResponse }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
			});

			expect(uploadSpy).not.toHaveBeenCalled();
			await waitFor(() => {
				expect(screen.getByText("0 KB")).toBeInTheDocument();
			});
		});

		it("should add files until max number of files", async () => {
			await renderComponent({
				overrideField: { validation: [{ max: 1, errorMessage: ERROR_MESSAGE }] },
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [
							{ dataURL: JPG_BASE64, fileId: FILE_1.name, fileName: FILE_1.name },
							{ dataURL: JPG_BASE64, fileId: FILE_2.name, fileName: FILE_2.name },
						],
					},
				},
			});
			await act(async () => {
				await waitFor(() => expect(screen.getByTestId(`${FILE_1.name}-thumbnail`)).toBeInTheDocument());
				expect(screen.getAllByTestId(/thumbnail$/).length).toBe(1);
				expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			});
		});

		it("should not render thumbnail when hideThumbnail is true", async () => {
			await renderComponent({
				overrideField: { hideThumbnail: true },
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ dataURL: JPG_BASE64, fileId: FILE_1.name, fileName: FILE_1.name }],
					},
				},
			});
			await act(async () => {
				await flushPromise(200);
			});

			await waitFor(() => expect(screen.getByLabelText(`delete ${FILE_1.name}`)).toBeInTheDocument());
			expect(screen.queryByTestId(`${FILE_1.name}-thumbnail`)).not.toBeInTheDocument();
		});
	});

	describe("validation", () => {
		it("should support validation schema", async () => {
			await renderComponent({
				overrideField: {
					validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				},
			});
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).not.toHaveBeenCalled();
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should be able to validate by file type", async () => {
			jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "png", mime: "image/png" });
			await renderComponent({
				files: [FILE_1],
				overrideField: { validation: [{ fileType: ["jpg"], errorMessage: ERROR_MESSAGE }] },
				inputType: "input",
			});

			await waitFor(() => {
				expect(screen.getAllByText(ERROR_MESSAGE).length > 0).toBeTruthy();
			});
		});

		it("should allow customisation of the upload failed error message", async () => {
			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue("error");
			await renderComponent({
				overrideField: { validation: [{ upload: true, errorMessage: ERROR_MESSAGE }] },
				files: [FILE_1],
				uploadType: "base64",
			});

			expect(screen.getAllByText(ERROR_MESSAGE).length > 0).toBeTruthy();
		});

		it("should prevent form submission while files are uploading", async () => {
			// Mock upload to be slow
			uploadSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 5000)));

			await renderComponent({
				files: [FILE_1],
				overrideField: { validation: [{ required: true }] },
			});

			// Try to submit while uploading
			await waitFor(() => fireEvent.click(getSubmitButton()));

			// Should show uploading error and not call submit
			expect(screen.getByText(ERROR_MESSAGES.UPLOAD().UPLOADING)).toBeInTheDocument();
			expect(SUBMIT_FN).not.toHaveBeenCalled();
		});

		it("should prevent form submission while files are being injected from default value", async () => {
			// Mock slow default value processing
			jest.spyOn(FileHelper, "dataUrlToBlob").mockImplementation(
				() => new Promise((resolve) => setTimeout(() => resolve(FILE_1), 5000))
			);

			await renderComponent({
				overrideSchema: {
					defaultValues: {
						[COMPONENT_ID]: [{ dataURL: JPG_BASE64, fileId: FILE_1.name, fileName: FILE_1.name }],
					},
				},
			});

			// Try to submit while injecting
			await waitFor(() => fireEvent.click(getSubmitButton()));

			// Should show uploading error and not call submit
			expect(screen.getByText(ERROR_MESSAGES.UPLOAD().UPLOADING)).toBeInTheDocument();
			expect(SUBMIT_FN).not.toHaveBeenCalled();
		});
	});

	describe("default value validation", () => {
		beforeEach(() => {
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);
			jest.spyOn(AxiosApiClient.prototype, "get").mockResolvedValue(FILE_1);
		});

		describe("flat uploadResponse structure", () => {
			const uploadResponse = {
				fileSize: 999999,
				mimeType: "image/jpeg",
				ext: "jpg",
			};
			const base64DefaultValues = {
				dataURL: JPG_BASE64,
				fileId: FILE_1.name,
				fileName: FILE_1.name,
				uploadResponse,
			};
			const fileUrlDefaultValues = {
				fileUrl: "mock url",
				fileId: FILE_1.name,
				fileName: FILE_1.name,
				uploadResponse,
			};

			it.each`
				scenario                                                  | type           | validation                | defaultValues
				${"do not match file type"}                               | ${"base64"}    | ${{ fileType: ["png"] }}  | ${base64DefaultValues}
				${"do not match file type"}                               | ${"multipart"} | ${{ fileType: ["png"] }}  | ${fileUrlDefaultValues}
				${"exceed file size limit"}                               | ${"base64"}    | ${{ maxSizeInKb: 0.001 }} | ${base64DefaultValues}
				${"exceed file size limit"}                               | ${"multipart"} | ${{ maxSizeInKb: 0.001 }} | ${fileUrlDefaultValues}
				${"have no dataURL / fileUrl and do not match file type"} | ${"base64"}    | ${{ fileType: ["png"] }}  | ${{ ...base64DefaultValues, dataURL: undefined, fileUrl: undefined }}
				${"have no dataURL / fileUrl and do not match file type"} | ${"multipart"} | ${{ fileType: ["png"] }}  | ${{ ...fileUrlDefaultValues, dataURL: undefined, fileUrl: undefined }}
				${"have no dataURL / fileUrl and exceed file size limit"} | ${"base64"}    | ${{ maxSizeInKb: 0.001 }} | ${{ ...base64DefaultValues, dataURL: undefined, fileUrl: undefined }}
				${"have no dataURL / fileUrl and exceed file size limit"} | ${"multipart"} | ${{ maxSizeInKb: 0.001 }} | ${{ ...fileUrlDefaultValues, dataURL: undefined, fileUrl: undefined }}
			`(
				"should reject $type file upload with default values that $scenario",
				async ({ type, validation, defaultValues }) => {
					await renderComponent({
						overrideField: {
							uploadOnAddingFile: { type, url: UPLOAD_URL },
							validation: [{ ...validation, errorMessage: ERROR_MESSAGE }],
						},
						overrideSchema: {
							defaultValues: {
								[COMPONENT_ID]: [defaultValues],
							},
						},
					});

					await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(2)); // each error message is rendered twice
				}
			);
		});

		describe("nested uploadResponse structure", () => {
			const uploadResponseNested = {
				data: {
					fileSize: 999999,
					mimeType: "image/jpeg",
					ext: "jpg",
				},
			};
			const base64DefaultValuesNested = {
				dataURL: JPG_BASE64,
				fileId: FILE_1.name,
				fileName: FILE_1.name,
				uploadResponse: uploadResponseNested,
			};
			const fileUrlDefaultValuesNested = {
				fileUrl: "mock url",
				fileId: FILE_1.name,
				fileName: FILE_1.name,
				uploadResponse: uploadResponseNested,
			};

			it.each`
				scenario                                                  | type           | validation                | defaultValues
				${"do not match file type"}                               | ${"base64"}    | ${{ fileType: ["png"] }}  | ${base64DefaultValuesNested}
				${"do not match file type"}                               | ${"multipart"} | ${{ fileType: ["png"] }}  | ${fileUrlDefaultValuesNested}
				${"exceed file size limit"}                               | ${"base64"}    | ${{ maxSizeInKb: 0.001 }} | ${base64DefaultValuesNested}
				${"exceed file size limit"}                               | ${"multipart"} | ${{ maxSizeInKb: 0.001 }} | ${fileUrlDefaultValuesNested}
				${"have no dataURL / fileUrl and do not match file type"} | ${"base64"}    | ${{ fileType: ["png"] }}  | ${{ ...base64DefaultValuesNested, dataURL: undefined, fileUrl: undefined }}
				${"have no dataURL / fileUrl and do not match file type"} | ${"multipart"} | ${{ fileType: ["png"] }}  | ${{ ...fileUrlDefaultValuesNested, dataURL: undefined, fileUrl: undefined }}
				${"have no dataURL / fileUrl and exceed file size limit"} | ${"base64"}    | ${{ maxSizeInKb: 0.001 }} | ${{ ...base64DefaultValuesNested, dataURL: undefined, fileUrl: undefined }}
				${"have no dataURL / fileUrl and exceed file size limit"} | ${"multipart"} | ${{ maxSizeInKb: 0.001 }} | ${{ ...fileUrlDefaultValuesNested, dataURL: undefined, fileUrl: undefined }}
			`(
				"should reject $type file upload with default values that $scenario",
				async ({ type, validation, defaultValues }) => {
					await renderComponent({
						overrideField: {
							uploadOnAddingFile: { type, url: UPLOAD_URL },
							validation: [{ ...validation, errorMessage: ERROR_MESSAGE }],
						},
						overrideSchema: {
							defaultValues: {
								[COMPONENT_ID]: [defaultValues],
							},
						},
					});

					await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(2)); // each error message is rendered twice
				}
			);
		});
	});

	describe("upload", () => {
		it("should upload with additional headers", async () => {
			const mockUploadResponse = { data: { hello: "world" } };
			const mockHeaders = {
				reqHeader1: "header1",
				reqHeader2: "header2",
			};
			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue(mockUploadResponse);
			await renderComponent({
				files: [FILE_1, FILE_2],
				uploadType: "base64",
				headers: mockHeaders,
			});
			expect(uploadSpy).toHaveBeenNthCalledWith(
				1,
				UPLOAD_URL,
				expect.anything(),
				expect.objectContaining({ headers: expect.objectContaining(mockHeaders) })
			);
			expect(uploadSpy).toHaveBeenNthCalledWith(
				2,
				UPLOAD_URL,
				expect.anything(),
				expect.objectContaining({ headers: expect.objectContaining(mockHeaders) })
			);
		});

		it("should not render thumbnail when hideThumbnail is true", async () => {
			const mockUploadResponse = { data: { hello: "world" } };
			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue(mockUploadResponse);

			await renderComponent({
				files: [FILE_1],
				uploadType: "base64",
				overrideField: { hideThumbnail: true },
			});
			await flushPromise(200);

			await waitFor(() => expect(screen.getByLabelText(`delete ${FILE_1.name}`)).toBeInTheDocument());
			expect(screen.queryAllByTestId(/-thumbnail$/)).toHaveLength(0);
		});
	});

	describe("upload type", () => {
		it("should be able to upload as base64 content-type", async () => {
			const mockUploadResponse = { data: { hello: "world" } };
			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue(mockUploadResponse);
			await renderComponent({
				files: [FILE_1, FILE_2],
				uploadType: "base64",
			});
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(uploadSpy).toHaveBeenCalledTimes(2);
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({
							dataURL: await FileHelper.fileToDataUrl(FILE_1),
							fileId: expect.any(String),
							fileName: FILE_1.name,
							uploadResponse: mockUploadResponse,
						}),
						expect.objectContaining({
							dataURL: await FileHelper.fileToDataUrl(FILE_2),
							fileId: expect.any(String),
							fileName: FILE_2.name,
							uploadResponse: mockUploadResponse,
						}),
					]),
				})
			);
		});

		it("should be able to upload as multipart content-type", async () => {
			const mockUploadResponse = { data: { hello: "world", fileUrl: "mock url" } };
			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue(mockUploadResponse);
			await renderComponent({
				files: [FILE_1, FILE_2],
				uploadType: "multipart",
			});
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(uploadSpy).toHaveBeenCalledTimes(2);
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({
							fileId: expect.any(String),
							fileName: FILE_1.name,
							fileUrl: mockUploadResponse.data.fileUrl,
							uploadResponse: mockUploadResponse,
						}),
						expect.objectContaining({
							fileId: expect.any(String),
							fileName: FILE_2.name,
							fileUrl: mockUploadResponse.data.fileUrl,
							uploadResponse: mockUploadResponse,
						}),
					]),
				})
			);
		});
	});

	describe.each`
		inputType
		${"input"}
		${"drag & drop"}
	`("when upload through $inputType as $uploadType content-type", ({ inputType }) => {
		describe("when uploading till max number of files", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: { validation: [{ max: 2 }] },
					inputType,
				});
			});

			it("should show and upload as many files", async () => {
				expect(screen.getAllByTestId(/thumbnail$/).length).toBe(2);
				expect(uploadSpy).toHaveBeenCalledTimes(2);
			});

			it("should hide the add button", () => {
				expect(screen.queryByLabelText("Upload files")).not.toBeInTheDocument();
			});

			it("should submit as many entries and upload response", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileId: expect.any(String),
								fileName: FILE_1.name,
							}),
							expect.objectContaining({
								fileId: expect.any(String),
								fileName: FILE_2.name,
							}),
						]),
					})
				);
			});
		});

		describe("when uploading beyond max number of files", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: { validation: [{ max: 1, errorMessage: ERROR_MESSAGE }] },
					inputType: inputType,
				});
			});

			it("should show and upload up to max number of files", async () => {
				expect(screen.getAllByTestId(/thumbnail$/).length).toBe(1);
				expect(uploadSpy).toHaveBeenCalledTimes(1);
			});

			// NOTE: no longer able to drop files beyond max files, to be addressed when porting image-upload over
			if (inputType === "input") {
				it("should display error message when adding beyond max no. of files", () => {
					expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
				});
			}

			// NOTE: add button is now disabled instead of hidden, to be addressed when porting image-upload over
			it.skip("should hide the add button", () => {
				expect(getField("button", "Upload files", true)).not.toBeInTheDocument();
			});

			it("should disable the add button", () => {
				expect(getField("button", "Upload files")).toBeDisabled();
			});

			it("should submit as many entries as the max no. of files accepted", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileId: expect.any(String),
								fileName: FILE_1.name,
							}),
						]),
					})
				);
			});
		});

		describe("when uploading wrong format", () => {
			beforeEach(async () => {
				jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "jpg", mime: "image/jpeg" });
				jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "png", mime: "image/png" });
				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: {
						validation: [{ fileType: ["png"], errorMessage: ERROR_MESSAGE }],
					},
					inputType: inputType,
				});
			});

			it("should not upload the invalid file and show an error message", () => {
				expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(2); // each error message is rendered twice
				expect(uploadSpy).toHaveBeenCalledTimes(1);
			});

			it("should submit only the valid files", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileId: expect.any(String),
								fileName: FILE_2.name,
							}),
						]),
					})
				);
			});
		});

		describe("when there is a generic error", () => {
			beforeEach(async () => {
				jest.spyOn(FileHelper, "fileToDataUrl").mockRejectedValueOnce("error");
				await renderComponent({
					files: [FILE_1, FILE_2],
					inputType: inputType,
				});
			});

			it("should not upload the erroneous file and show an error message", async () => {
				await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGES.UPLOAD().GENERIC).length).toBe(2));
				expect(uploadSpy).toHaveBeenCalledTimes(1);
			});

			it("should submit only the valid files", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileId: expect.any(String),
								fileName: FILE_2.name,
							}),
						]),
					})
				);
			});
		});

		describe("when there is a file size limit", () => {
			beforeEach(async () => {
				jest.spyOn(FileHelper, "fileToDataUrl").mockResolvedValueOnce(`${JPG_BASE64}${JPG_BASE64}`);
				jest.spyOn(FileHelper, "fileToDataUrl").mockResolvedValueOnce(JPG_BASE64);

				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: {
						validation: [{ maxSizeInKb: 0.15, errorMessage: ERROR_MESSAGE }],
					},
					inputType: inputType,
				});
			});

			it("should show error and not upload the file that exceeds the file size limit", async () => {
				expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(2); // each error message is rendered twice
				expect(uploadSpy).toHaveBeenCalledTimes(1);
			});

			it("should submit only the valid files", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileId: expect.any(String),
								fileName: FILE_2.name,
							}),
						]),
					})
				);
			});
		});

		describe("image compression", () => {
			it("should not compress image by default", async () => {
				const compressSpy = jest.spyOn(ImageHelper, "compressImage");
				await renderComponent({
					files: [FILE_1],
					uploadType: inputType,
				});
				await flushPromise();

				expect(compressSpy).not.toHaveBeenCalled();
			});

			it("should compress image if compress=true and max size is defined", async () => {
				const compressSpy = jest.spyOn(ImageHelper, "compressImage");
				await act(async () => {
					await renderComponent({
						files: [FILE_1],
						overrideField: { compressImages: true, validation: [{ maxSizeInKb: 0.001 }] },
						uploadType: inputType,
					});
					await flushPromise();
				});

				expect(compressSpy).toHaveBeenCalled();
			});

			it("should not compress non-image file", async () => {
				jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ mime: "application/pdf", ext: ".pdf" });
				const compressSpy = jest.spyOn(ImageHelper, "compressImage");
				await renderComponent({
					files: [FILE_1],
					overrideField: { compressImages: true, validation: [{ maxSizeInKb: 0.001 }] },
					uploadType: inputType,
				});
				await flushPromise();

				expect(compressSpy).not.toHaveBeenCalled();
			});
		});
	});

	describe("events", () => {
		it("should fire mount event on mount", async () => {
			const handleMount = jest.fn();
			await renderComponent({ eventType: "mount", eventListener: handleMount });
			expect(handleMount).toHaveBeenCalled();
		});

		it("should fire upload-error event on upload error", async () => {
			const mockError = { response: { data: "error data" } };
			let detail = undefined;
			const handleUploadError = jest.fn((e) => (detail = e.detail));

			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValueOnce(mockError);
			await renderComponent({
				files: [FILE_1],
				uploadType: "base64",
				eventType: "upload-error",
				eventListener: handleUploadError,
			});
			expect(handleUploadError).toHaveBeenCalledTimes(1);
			expect(detail).toEqual({
				id: COMPONENT_ID,
				fileId: expect.anything(),
				errorData: mockError.response.data,
			});
		});
	});

	describe("reset", () => {
		it("should clear values on reset", async () => {
			await renderComponent({
				files: [FILE_1, FILE_2],
				inputType: "input",
			});
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(screen.queryByTestId(/thumbnail$/)).not.toBeInTheDocument();
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
		});

		it("should revert to default value on reset", async () => {
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);

			await renderComponent({
				files: [FILE_2],
				overrideSchema: {
					defaultValues: {
						field: [
							{
								fileId: FILE_1.name,
								fileName: FILE_1.name,
								dataURL: JPG_BASE64,
							},
						],
					},
				},
			});
			await act(async () => {
				await flushPromise(100);
				fireEvent.click(getResetButton());
				await flushPromise(100);
				await waitFor(() => fireEvent.click(getSubmitButton()));
			});

			expect(screen.getAllByTestId(/thumbnail$/).length).toBe(1);
			expect(screen.getByTestId(`${FILE_1.name}-thumbnail`)).toBeInTheDocument();
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({
							fileId: FILE_1.name,
							fileName: FILE_1.name,
						}),
					]),
				})
			);
		});
	});

	describe("warning", () => {
		const warningMessage = "warning message";
		beforeEach(async () => {
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current?.setWarnings({ [COMPONENT_ID]: warningMessage });
			};

			render(
				<FrontendEngineWithCustomButton
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[COMPONENT_ID]: {
										label: "Upload",
										uiType: "file-upload",
										uploadOnAddingFile: {
											type: "base64",
											url: UPLOAD_URL,
										},
									},
									...getSubmitButtonProps(),
								},
							},
						},
					}}
					onClick={handleClick}
				/>
			);

			await waitFor(() => getDragInputUploadField());
		});

		it("should not render warning by default", () => {
			expect(screen.queryByTestId(`${COMPONENT_ID}__warning`)).not.toBeInTheDocument();
			expect(screen.queryByText(warningMessage)).not.toBeInTheDocument();
		});

		it("should be able to render warning via setWarnings()", () => {
			fireEvent.click(getField("button", "Custom Button"));

			expect(screen.getByText(warningMessage)).toBeInTheDocument();
		});

		it("should clear warnings on submit", async () => {
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.queryByText(warningMessage)).not.toBeInTheDocument();
		});
	});

	describe("error", () => {
		it("should be able to set field error via setErrors()", async () => {
			const error = "field error";
			await renderComponent({ onClick: (ref) => ref.current.setErrors({ [COMPONENT_ID]: error }) });
			fireEvent.click(getCustomButton());

			expect(screen.getByText(error)).toBeInTheDocument();
		});

		it("should be able to clear field error via setErrors", async () => {
			await renderComponent({
				overrideField: {
					validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				},
				onClick: (ref) => ref.current.setErrors({ [COMPONENT_ID]: undefined }),
			});
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			fireEvent.click(getCustomButton());
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
		});

		it("should set field and individual file errors via setErrors()", async () => {
			const fileError1 = "file error 1";
			const fileError2 = "file error 2";
			await renderComponent({
				files: [FILE_1, FILE_2],
				onClick: (ref) => {
					const files = ref.current.getValues()[COMPONENT_ID];

					const errors: TFileUploadErrorMessage = {
						message: ERROR_MESSAGE,
						fileErrors: {
							[files[0].fileId]: fileError1,
							[files[1].fileId]: fileError2,
						},
					};

					ref.current.setErrors({ [COMPONENT_ID]: errors });
				},
			});
			fireEvent.click(getCustomButton());

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getAllByText(fileError1).length > 0).toBeTruthy();
			expect(screen.getAllByText(fileError2).length > 0).toBeTruthy();
		});

		it("should set field error while keeping existing file errors", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValueOnce("error");
			await renderComponent({
				files: [FILE_1],
				onClick: (ref) => {
					const errors: TFileUploadErrorMessage = {
						message: ERROR_MESSAGE,
					};

					ref.current.setErrors({ [COMPONENT_ID]: errors });
				},
			});
			fireEvent.click(getCustomButton());

			expect(screen.getAllByText(ERROR_MESSAGES.UPLOAD().GENERIC).length > 0).toBeTruthy();
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should set specific file error while keeping existing field error and other file errors", async () => {
			const fileError1 = "file error 1";

			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValueOnce("error");
			await renderComponent({
				files: [FILE_1, FILE_2],
				overrideField: {
					validation: [{ length: 5, errorMessage: ERROR_MESSAGE }],
				},
				onClick: (ref) => {
					const files = ref.current.getValues()[COMPONENT_ID];

					const errors: TFileUploadErrorMessage = {
						fileErrors: {
							[files[0].fileId]: fileError1,
						},
					};

					ref.current.setErrors({ [COMPONENT_ID]: errors });
				},
			});
			await waitFor(() => fireEvent.click(getSubmitButton()));
			fireEvent.click(getCustomButton());

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getAllByText(ERROR_MESSAGES.UPLOAD().GENERIC).length > 0).toBeTruthy();
			expect(screen.getAllByText(fileError1).length > 0).toBeTruthy();
		});
	});

	describe("dirty state", () => {
		let formIsDirty: boolean;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};
		const json: IFrontendEngineData = {
			id: FRONTEND_ENGINE_ID,
			sections: {
				section: {
					uiType: "section",
					children: {
						[COMPONENT_ID]: {
							label: "Upload",
							uiType: UI_TYPE,
							uploadOnAddingFile: {
								type: "base64",
								url: UPLOAD_URL,
							},
						},
						...getSubmitButtonProps(),
						...getResetButtonProps(),
					},
				},
			},
		};

		beforeEach(() => {
			formIsDirty = undefined;
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);
			jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user adds a file", async () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			await act(async () => {
				fireEvent.change(getDragInputUploadField(), {
					target: {
						files: [FILE_1],
					},
				});

				await waitFor(() => expect(screen.getByTestId(/thumbnail$/)).toBeInTheDocument());
				await flushPromise();
			});
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...json,
						defaultValues: {
							[COMPONENT_ID]: [
								{
									fileName: FILE_1.name,
									dataURL: JPG_BASE64,
								},
							],
						},
					}}
					onClick={handleClick}
				/>
			);
			await act(async () => {
				await waitFor(() => expect(screen.getByTestId(/thumbnail$/)).toBeInTheDocument());
				await flushPromise();
			});
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user removes an image", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...json,
						defaultValues: {
							[COMPONENT_ID]: [
								{
									fileId: FILE_1.name,
									fileName: FILE_1.name,
									dataURL: JPG_BASE64,
								},
							],
						},
					}}
					onClick={handleClick}
				/>
			);
			await act(async () => {
				await waitFor(() => expect(screen.getByTestId(/image$/)).toBeInTheDocument());
				await waitFor(() => fireEvent.click(screen.getByTestId(/(delete-button)$/)));
				await flushPromise();
			});
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(true);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			await act(async () => {
				fireEvent.change(getDragInputUploadField(), {
					target: {
						files: [FILE_1],
					},
				});
				await waitFor(() => expect(screen.getByTestId(/image$/)).toBeInTheDocument());
				await flushPromise();
				await waitFor(() => fireEvent.click(getResetButton()));
			});
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...json,
						defaultValues: {
							[COMPONENT_ID]: [
								{
									fileName: FILE_1.name,
									dataURL: JPG_BASE64,
								},
							],
						},
					}}
					onClick={handleClick}
				/>
			);
			await act(async () => {
				fireEvent.change(getDragInputUploadField(), {
					target: {
						files: [FILE_2],
					},
				});
				await waitFor(() => expect(screen.getAllByTestId(/image$/).length).toBe(2));
				await flushPromise(200);
				await waitFor(() => fireEvent.click(getResetButton()));
				await flushPromise();
			});
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});
	});
});
