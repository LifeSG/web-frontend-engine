import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { useEffect, useRef } from "react";
import { FrontendEngine } from "../../../../components";
import { EImageStatus, IImageUploadSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../../components/types";
import { AxiosApiClient, FileHelper, ImageHelper } from "../../../../utils";
import * as IdHelper from "../../../../utils/id-helper";
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
import * as WindowHelper from "../../../../utils/hooks/use-window-helper";

const METADATA = { dateTimeOriginal: "2009:10:10 04:09:20", lat: 22.316033333333333, lng: 114.17031666666666 };

const JPG_BASE64 =
	"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=";
const FILE_1 = new File(["file"], "test.jpg", {
	type: "image/jpeg",
});
const FILE_2 = new File(["file"], "test2.jpg", {
	type: "image/jpeg",
});
const COMPONENT_ID = "field";
const UI_TYPE = "image-upload";
const SUBMIT_FN = jest.fn();
let uploadSpy: jest.SpyInstance;
let extractMetadataSpy: jest.SpyInstance;

const getSaveButton = (isQuery = false): HTMLElement => getField("button", "Save", isQuery);
const getDragInputUploadField = (): HTMLElement => screen.getByTestId("field-drag-upload__hidden-input");
const getReviewModalUploadField = (): HTMLElement => screen.getByTestId("field-image-thumbnails__file-input");

interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	eventType: string;
	eventListener: (this: Element, ev: Event) => any;
	onClick?: (ref: React.MutableRefObject<IFrontendEngineRef>) => void;
}
const FrontendEngineWithEventListener = (props: ICustomFrontendEngineProps) => {
	const { eventType, eventListener, onClick, data, ...otherProps } = props;
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
			<FrontendEngine {...otherProps} data={data} ref={formRef} />
			<button type="button" onClick={() => onClick(formRef)}>
				Custom Button
			</button>
		</>
	);
};

interface IRenderAndPerformActionsOptions {
	overrideField?: TOverrideField<IImageUploadSchema>;
	overrideSchema?: TOverrideSchema;
	files?: { name: string; type: string }[];
	uploadType?: "input" | "drag & drop";
	reviewImage?: boolean;
	eventType?: string;
	eventListener?: (this: Element, ev: Event) => any;
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
		uploadType = "input",
		reviewImage,
		onClick,
	} = options;
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "Image Upload",
						uiType: UI_TYPE,
						uploadOnAddingFile: {
							method: "post",
							url: "test",
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
		uploadType === "input" ? getDragInputUploadField() : screen.getByTestId("field-drag-upload")
	);
	await act(async () => {
		for (let i = 0; i < files.length; i++) {
			fireEvent[uploadType === "input" ? "change" : "drop"](uploadField, {
				target: {
					files: [files[i]],
				},
			});
			if (uploadType === "input") {
				await new Promise((resolve) => setTimeout(resolve, 100));
				await flushPromise();
			} else {
				await flushPromise();
			}
		}
	});

	if (reviewImage) {
		await waitFor(() => fireEvent.click(getField("button", "Ok")));
		await new Promise((resolve) => setTimeout(resolve));
	}
};

describe("image-upload", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		setupJestCanvasMock();

		jest.spyOn(FileHelper, "truncateFileName").mockImplementation((fileName) => fileName);
		uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({ id: 1 });
		extractMetadataSpy = jest.spyOn(ImageHelper, "getMetadata").mockResolvedValue(METADATA);
	});

	it("should be able to render the field", async () => {
		await renderComponent();

		expect(screen.getByTestId("field")).toBeInTheDocument();
		expect(getDragInputUploadField()).toBeInTheDocument();
		expect(screen.getByLabelText("Image Upload")).toBeInTheDocument();
	});

	it("should allow customising of copies", async () => {
		await renderComponent({
			overrideField: {
				buttonLabel: "TEST 1",
			},
		});

		await waitFor(() =>
			fireEvent.dragEnter(screen.getByTestId("field-drag-upload"), {
				dataTransfer: {
					files: [FILE_1],
					items: [
						{
							kind: "file",
							size: FILE_1.size,
							type: FILE_1.type,
							getAsFile: () => FILE_1,
						},
					],
					types: ["Files"],
				},
			})
		);

		expect(screen.getByText("TEST 1")).toBeInTheDocument();
	});

	it("should support default value", async () => {
		jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);
		jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });

		await renderComponent({
			overrideSchema: {
				defaultValues: {
					field: [
						{
							fileName: FILE_1.name,
							dataURL: JPG_BASE64,
						},
						{
							fileName: FILE_2.name,
							dataURL: JPG_BASE64,
						},
					],
				},
			},
		});
		await act(async () => {
			await flushPromise(100);
			await waitFor(() => fireEvent.click(getSubmitButton()));
		});

		expect(SUBMIT_FN).toHaveBeenCalledWith(
			expect.objectContaining({
				field: expect.arrayContaining([
					expect.objectContaining({
						fileName: FILE_1.name,
						dataURL: JPG_BASE64,
					}),
				]),
			})
		);
	});

	describe("validation", () => {
		it("should support validation schema", async () => {
			await renderComponent({
				overrideField: {
					validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
				},
			});
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).not.toBeCalled();
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should be able to validate by file type", async () => {
			jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "png", mime: "image/png" });
			await renderComponent({
				files: [FILE_1],
				overrideField: { validation: [{ fileType: ["jpg"], errorMessage: ERROR_MESSAGE }] },
				uploadType: "input",
			});

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should allow customisation of the upload failed error message", async () => {
			uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue("error");
			await renderComponent({
				overrideField: { validation: [{ upload: true, errorMessage: ERROR_MESSAGE }] },
				files: [FILE_1],
				uploadType: "input",
			});

			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});

	describe.each`
		inputType
		${"input"}
		${"drag & drop"}
	`("when upload through $inputType", ({ inputType }) => {
		describe("when uploading till max number of images", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: { validation: [{ max: 2 }] },
					uploadType: inputType,
				});
			});

			it("should show and upload as many images", async () => {
				expect(screen.getByText(FILE_1.name)).toBeInTheDocument();
				expect(screen.getByText(FILE_2.name)).toBeInTheDocument();
				expect(uploadSpy).toBeCalledTimes(2);
			});

			it("should hide the add button", () => {
				expect(screen.queryByLabelText("Add photos")).not.toBeInTheDocument();
			});

			it("should submit as many base64 and upload response", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileName: FILE_1.name,
								dataURL: JPG_BASE64,
							}),
							expect.objectContaining({
								fileName: FILE_2.name,
								dataURL: JPG_BASE64,
							}),
						]),
					})
				);
			});
		});

		describe("when uploading beyond max number of images", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: { validation: [{ max: 1, errorMessage: ERROR_MESSAGE }] },
					uploadType: inputType,
				});
			});

			it("should show and upload up to max number of images", async () => {
				expect(screen.getByText(FILE_1.name)).toBeInTheDocument();
				expect(screen.queryByText(FILE_2.name)).not.toBeInTheDocument();
				expect(uploadSpy).toBeCalledTimes(1);
			});

			it("should display error message when adding beyond max no. of images", () => {
				expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			});

			it("should hide the add button", () => {
				expect(getField("button", "Image Upload", true)).not.toBeInTheDocument();
			});

			it("should submit base64 and upload response up to max number of images", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileName: FILE_1.name,
								dataURL: JPG_BASE64,
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
					uploadType: inputType,
				});
			});

			it("should not upload the invalid file and show an error message", () => {
				expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
				expect(uploadSpy).toBeCalledTimes(1);
			});

			it("should submit only the valid files", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileName: FILE_2.name,
								dataURL: JPG_BASE64,
							}),
						]),
					})
				);
			});
		});

		describe("when there is a generic error", () => {
			beforeEach(async () => {
				jest.spyOn(ImageHelper, "convertBlob").mockRejectedValueOnce("error");
				await renderComponent({
					files: [FILE_1, FILE_2],
					uploadType: inputType,
				});
			});

			it("should not upload the erroneous file and show an error message", async () => {
				expect(screen.getByText(ERROR_MESSAGES.UPLOAD().GENERIC)).toBeInTheDocument();
				expect(uploadSpy).toBeCalledTimes(1);
			});

			it("should submit only the valid files", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileName: FILE_2.name,
								dataURL: JPG_BASE64,
							}),
						]),
					})
				);
			});
		});

		describe("when there is a file size limit and images are not compressed", () => {
			beforeEach(async () => {
				jest.spyOn(ImageHelper, "convertBlob").mockResolvedValueOnce(`${JPG_BASE64}${JPG_BASE64}`);
				jest.spyOn(ImageHelper, "convertBlob").mockResolvedValueOnce(JPG_BASE64);

				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: {
						validation: [{ maxSizeInKb: 0.15, errorMessage: ERROR_MESSAGE }],
					},
					uploadType: inputType,
				});
			});

			it("should show error and not upload the image that exceeds the file size limit", async () => {
				expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
				expect(uploadSpy).toBeCalledTimes(1);
			});

			it("should submit only the valid files", async () => {
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({
						field: expect.arrayContaining([
							expect.objectContaining({
								fileName: FILE_2.name,
								dataURL: JPG_BASE64,
							}),
						]),
					})
				);
			});
		});

		describe("image compression", () => {
			beforeEach(() => {
				jest.spyOn(ImageHelper, "dataUrlToImage").mockResolvedValue(new Image());
				jest.spyOn(ImageHelper, "resampleImage").mockResolvedValue(FILE_1);
			});

			it("should not compress image by default", async () => {
				const compressSpy = jest.spyOn(ImageHelper, "compressImage");
				await renderComponent({
					files: [FILE_1],
					uploadType: inputType,
				});
				await flushPromise();

				expect(compressSpy).not.toBeCalled();
			});

			it("should compress image if compress=true and max size is defined", async () => {
				const compressSpy = jest.spyOn(ImageHelper, "compressImage");
				await act(async () => {
					await renderComponent({
						files: [FILE_1],
						overrideField: { compress: true, validation: [{ maxSizeInKb: 1 }] },
						uploadType: inputType,
					});
					await flushPromise();
				});

				expect(compressSpy).toBeCalled();
			});

			it("Should extract image metadata", async () => {
				jest.spyOn(ImageHelper, "compressImage").mockResolvedValue(FILE_1);

				await waitFor(async () => {
					await renderComponent({
						files: [FILE_1],
						overrideField: { compress: true, validation: [{ maxSizeInKb: 1 }] },
						uploadType: inputType,
					});
				});

				await waitFor(() => expect(extractMetadataSpy).toHaveBeenCalledTimes(1));
				expect(extractMetadataSpy).toHaveBeenCalledWith(FILE_1);
			});
		});
	});

	describe("when showing review modal", () => {
		describe("desktop", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1],
					overrideField: { editImage: true },
				});
			});

			it("should not upload photo", () => {
				expect(uploadSpy).not.toBeCalled();
			});

			it("should show confirmation prompt", () => {
				expect(screen.getByText("Review photos?")).toBeVisible();
			});

			it("should show review modal after clicking ok in confirmation prompt", async () => {
				await waitFor(() => fireEvent.click(getField("button", "Ok")));

				expect(screen.getByText("Review photos")).toBeVisible();
			});
		});

		describe("mobile", () => {
			beforeEach(async () => {
				jest.spyOn(WindowHelper, "useWindowHelper").mockReturnValue(() => true);

				await renderComponent({
					files: [FILE_1],
					overrideField: { editImage: true },
				});
			});

			it("should not upload photo", () => {
				expect(uploadSpy).not.toBeCalled();
			});

			it("should skip confirmation prompt and show review modal", async () => {
				expect(screen.getByText("Review photos?")).not.toBeVisible();
				expect(screen.getByText("Review photos")).toBeVisible();
			});
		});
	});

	describe("when add through review modal", () => {
		describe("when add till max number of images", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1, FILE_2],
					overrideField: { editImage: true, validation: [{ max: 2 }] },
					reviewImage: true,
				});
			});

			it("should not upload images", () => {
				expect(uploadSpy).not.toBeCalled();
			});

			it("should show as many images", () => {
				expect(getField("button", `thumbnail of ${FILE_1.name}`)).toBeInTheDocument();
				expect(getField("button", `thumbnail of ${FILE_2.name}`)).toBeInTheDocument();
			});

			it("should hide the add button", () => {
				expect(getField("button", "add image", true)).not.toBeInTheDocument();
			});

			it("should upload as many images after clicking save", async () => {
				await waitFor(() => fireEvent.click(getSaveButton()));
				await flushPromise();

				expect(uploadSpy).toBeCalledTimes(2);
			});
		});

		describe("when uploading wrong format", () => {
			it("should show error thumbnail, message and disable submit button", async () => {
				jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "jpg", mime: "image/jpeg" });
				await renderComponent({
					files: [FILE_1],
					overrideField: {
						editImage: true,
						validation: [{ fileType: ["jpg"] }],
					},
					reviewImage: true,
				});

				jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "png", mime: "image/png" });
				await waitFor(() => fireEvent.change(getReviewModalUploadField(), { target: { files: [FILE_1] } }));

				expect(getField("button", `error with ${FILE_1.name}`)).toBeInTheDocument();
				expect(screen.getByText(ERROR_MESSAGES.UPLOAD("photo").MODAL.FILE_TYPE.TITLE)).toBeInTheDocument();
				expect(getSaveButton()).toBeDisabled();
			});
		});

		describe("when there is a generic error", () => {
			it("should show an error message and disable submit button", async () => {
				jest.spyOn(FileHelper, "getType").mockResolvedValueOnce({ ext: "jpg", mime: "image/jpeg" });
				await renderComponent({
					files: [FILE_1],
					overrideField: {
						editImage: true,
						validation: [{ fileType: ["jpg"] }],
					},
					reviewImage: true,
				});

				jest.spyOn(ImageHelper, "convertBlob").mockRejectedValue("error");
				await waitFor(() => fireEvent.change(getReviewModalUploadField(), { target: { files: [FILE_1] } }));

				expect(screen.getByText(ERROR_MESSAGES.UPLOAD("photo").MODAL.GENERIC_ERROR.TITLE)).toBeInTheDocument();
				expect(getSaveButton()).toBeDisabled();
			});
		});

		describe("when there is no need to compress", () => {
			let compressSpy: jest.SpyInstance;
			beforeEach(async () => {
				compressSpy = jest.spyOn(ImageHelper, "compressImage");
				await renderComponent({
					files: [FILE_1],
					overrideField: { editImage: true, validation: [{ maxSizeInKb: 0.15 }] },
					reviewImage: true,
				});

				jest.spyOn(ImageHelper, "convertBlob").mockResolvedValue(`${JPG_BASE64}${JPG_BASE64}`);
				await waitFor(() => fireEvent.change(getReviewModalUploadField(), { target: { files: [FILE_1] } }));
			});

			it("should not compress the image", async () => {
				expect(compressSpy).not.toBeCalled();
			});

			it("should show error and disable submit button if image exceeds max size", async () => {
				expect(screen.getByText(ERROR_MESSAGES.UPLOAD("photo").MODAL.MAX_FILE_SIZE.TITLE)).toBeInTheDocument();
				expect(getSaveButton()).toBeDisabled();
			});

			it("Should extract image metadata", async () => {
				expect(extractMetadataSpy).toHaveBeenCalledTimes(1);
				expect(extractMetadataSpy).toHaveBeenCalledWith(FILE_1);
			});
		});

		describe("when editing image", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1],
					overrideField: { editImage: true },
					reviewImage: true,
				});
				await waitFor(() => fireEvent.click(getField("button", "Draw")));
			});

			it("should hide the thumbnails and show the drawing toolbar", () => {
				expect(getField("button", `thumbnail of ${FILE_1.name}`, true)).not.toBeInTheDocument();
				expect(getField("button", "eraser")).toBeInTheDocument();
				expect(screen.getAllByRole("button", { name: /brush$/i })).toBeTruthy();
			});

			it("should hide the draw and delete buttons", () => {
				expect(getField("button", "Draw", true)).not.toBeInTheDocument();
				expect(getField("button", "Delete", true)).not.toBeInTheDocument();
			});

			it("should hide image editor when click on the save button", async () => {
				jest.spyOn(ImageHelper, "dataUrlToImage").mockResolvedValue(new Image());
				jest.spyOn(ImageHelper, "resampleImage").mockResolvedValue(FILE_1);

				await act(async () => {
					await waitFor(() => fireEvent.click(getField("button", "Save")));
					await waitFor(() => getField("button", `thumbnail of ${FILE_1.name}`));
				});

				expect(getField("button", `thumbnail of ${FILE_1.name}`)).toBeInTheDocument();
				expect(getField("button", "eraser", true)).not.toBeInTheDocument();
				expect(getField("button", /brush$/i, true)).not.toBeInTheDocument();
			});
		});

		describe("when deleting image", () => {
			describe("not last image", () => {
				beforeEach(async () => {
					await renderComponent({
						files: [FILE_1, FILE_1, FILE_1],
						overrideField: { editImage: true },
						reviewImage: true,
					});
					await waitFor(() => fireEvent.click(getField("button", "Delete")));
				});

				it("should show delete confirmation prompt on clicking the delete button", () => {
					expect(screen.getByText("Delete photo?")).toBeVisible();
					expect(getField("button", "Cancel")).toBeVisible();
					expect(getField("button", "Yes, delete")).toBeVisible();
				});

				it("should delete the image and hide the prompt on confirming delete", async () => {
					await waitFor(() => fireEvent.click(getField("button", "Yes, delete")));

					expect(screen.getAllByRole("button", { name: /^thumbnail/i })).toHaveLength(2);
					expect(screen.getByText("Delete photo?")).not.toBeVisible();
				});

				it("should not delete the image but dismiss the prompt on cancelling the confirmation prompt", async () => {
					await waitFor(() => fireEvent.click(getField("button", "Cancel")));

					expect(screen.getByText("Delete photo?")).not.toBeVisible();
					expect(screen.getAllByRole("button", { name: /^thumbnail/i })).toHaveLength(3);
				});
			});

			describe("last image", () => {
				beforeEach(async () => {
					await renderComponent({
						files: [FILE_1],
						overrideField: { editImage: true },
						reviewImage: true,
					});
					await waitFor(() => fireEvent.click(getField("button", "Delete")));
				});

				it("should show delete and exit confirmation prompt on attempting to delete the last photo", () => {
					expect(screen.getByText("Delete photo and exit?")).toBeVisible();
					expect(getField("button", "Cancel")).toBeVisible();
					expect(getField("button", "Delete and exit")).toBeVisible();
				});

				it("should delete the image and close the review modal on deleting the last image", async () => {
					await waitFor(() => fireEvent.click(getField("button", "Delete and exit")));

					expect(getField("button", /^thumbnail/i, true)).not.toBeInTheDocument();
					expect(screen.queryByText("Delete photo and exit?")).not.toBeInTheDocument();
					expect(screen.queryByText("Review photos")).not.toBeInTheDocument();
				});

				it("should not delete the image and return to the review modal on cancelling the confirmation prompt", async () => {
					await waitFor(() => fireEvent.click(getField("button", "Cancel")));

					expect(getField("button", /^thumbnail/i)).toBeInTheDocument();
					expect(screen.getByText("Delete photo and exit?")).not.toBeVisible();
					expect(screen.getByText("Review photos")).toBeInTheDocument();
				});
			});
		});

		describe("when exiting review modal", () => {
			beforeEach(async () => {
				await renderComponent({
					files: [FILE_1],
					overrideField: { editImage: true },
					reviewImage: true,
				});
				await waitFor(() => fireEvent.click(getField("button", "exit review modal")));
			});

			it("should show confirmation prompt", () => {
				expect(screen.getByText("Exit without saving?")).toBeVisible();
				expect(screen.getByText("Yes, exit")).toBeVisible();
				expect(getField("button", "Cancel")).toBeVisible();
			});

			it("should close review modal on confirmation", async () => {
				await waitFor(() => fireEvent.click(getField("button", "Yes, exit")));

				expect(screen.queryByText("Exit without saving?")).not.toBeInTheDocument();
				expect(screen.queryByText("Review photos")).not.toBeInTheDocument();
				expect(getField("button", /^thumbnail/i, true)).not.toBeInTheDocument();
			});

			it("should not close review modal on cancelling the confirmation prompt", async () => {
				await waitFor(() => fireEvent.click(getField("button", "Cancel")));

				expect(screen.getByText("Exit without saving?")).not.toBeVisible();
				expect(screen.getByText("Review photos")).toBeInTheDocument();
				expect(getField("button", /^thumbnail/i)).toBeInTheDocument();
			});
		});
	});

	describe("events", () => {
		it("should fire mount event on mount", async () => {
			const handleMount = jest.fn();
			await renderComponent({ eventType: "mount", eventListener: handleMount });
			expect(handleMount).toBeCalled();
		});

		it("should fire show-review-modal event on showing review modal", async () => {
			const handleShowReviewModal = jest.fn();
			await renderComponent({
				eventType: "show-review-modal",
				eventListener: handleShowReviewModal,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
			});

			expect(handleShowReviewModal).toBeCalled();
		});

		it("should fire hide-review-modal event on hiding review modal", async () => {
			const handleHideReviewModal = jest.fn();
			await renderComponent({
				eventType: "hide-review-modal",
				eventListener: handleHideReviewModal,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
			});
			await waitFor(() => fireEvent.click(getSaveButton()));

			expect(handleHideReviewModal).toBeCalled();
		});

		it("should fire file-dialog event on showing file-dialog", async () => {
			const handleFileDialog = jest.fn();
			await renderComponent({
				eventType: "file-dialog",
				eventListener: handleFileDialog,
			});
			await act(async () => {
				await waitFor(() => fireEvent.click(getField("button", "Image Upload")));
			});

			expect(handleFileDialog).toBeCalled();
		});

		it("should fire save-review-images event on clicking save button in review modal", async () => {
			const handleSaveImages = jest.fn();
			await renderComponent({
				eventType: "save-review-images",
				eventListener: handleSaveImages,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
			});
			await waitFor(() => fireEvent.click(getSaveButton()));

			expect(handleSaveImages).toBeCalled();
		});

		it("should not save images / close modal if save-review-images event is prevented", async () => {
			const handleSaveImages = (event: CustomEvent) => {
				event.preventDefault();
			};
			await renderComponent({
				eventType: "save-review-images",
				eventListener: handleSaveImages,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
			});
			await waitFor(() => fireEvent.click(getSaveButton()));

			expect(getSaveButton()).toBeInTheDocument();
			expect(uploadSpy).not.toBeCalled();
		});

		it("should allow retry through save-review-images event detail", async () => {
			const mockCounter = { value: () => 1 };
			jest.spyOn(mockCounter, "value").mockReturnValueOnce(0);

			const handleSaveImages = (event: CustomEvent) => {
				if (mockCounter.value() < 1) {
					event.preventDefault();
					event.detail.retry();
				}
			};
			await renderComponent({
				eventType: "save-review-images",
				eventListener: handleSaveImages,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
			});
			await waitFor(() => fireEvent.click(getSaveButton()));

			expect(mockCounter.value).toBeCalledTimes(2);
			expect(getSaveButton(true)).not.toBeInTheDocument();
			expect(uploadSpy).toBeCalled();
		});

		it("should fire hide-review-modal event on hiding review modal", async () => {
			const handleHideReviewModal = jest.fn();
			await renderComponent({
				eventType: "hide-review-modal",
				eventListener: handleHideReviewModal,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
			});
			await waitFor(() => fireEvent.click(getSaveButton()));

			expect(handleHideReviewModal).toBeCalled();
		});

		it("should allow dismissing of the review modal via dismiss-review-modal event", async () => {
			const handleDismissReviewModal = jest.fn();
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current?.dispatchFieldEvent(UI_TYPE, "dismiss-review-modal", COMPONENT_ID, {
					removePendingImages: false,
				});
			};
			await renderComponent({
				eventType: "dismiss-review-modal",
				eventListener: handleDismissReviewModal,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
				onClick: handleClick,
			});

			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(handleDismissReviewModal).toBeCalled();
		});

		it("should be able to save review images via trigger-save-review-images event", async () => {
			const saveReviewImageFn = jest.fn();
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current?.dispatchFieldEvent(UI_TYPE, "trigger-save-review-images", COMPONENT_ID);
			};
			await renderComponent({
				eventType: "trigger-save-review-images",
				eventListener: saveReviewImageFn,
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
				onClick: handleClick,
			});

			await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "Custom Button" })));

			expect(saveReviewImageFn).toBeCalled();
		});

		it("should be able to show custom error message when update-image-status is fired", async () => {
			const mockID = "mock-random-id";
			jest.spyOn(IdHelper, "generateRandomId").mockReturnValue(mockID);
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current?.dispatchFieldEvent(UI_TYPE, "update-image-status", COMPONENT_ID, {
					id: mockID,
					updatedStatus: EImageStatus.ERROR_CUSTOM_MUTED,
					errorMessage: ERROR_MESSAGE,
				});
			};
			await renderComponent({
				files: [FILE_1],
				overrideField: { editImage: true },
				reviewImage: true,
				onClick: handleClick,
			});

			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));
			const errMsg = screen.getAllByTestId("field-file-item-1__error-text")[0].innerHTML;
			expect(errMsg).toBe(ERROR_MESSAGE);
			expect(screen.getAllByTestId("field-file-item-1__error-text")[0]).toBeInTheDocument();
		});
	});

	describe("reset", () => {
		it("should clear values on reset", async () => {
			await renderComponent({
				files: [FILE_1, FILE_2],
				uploadType: "input",
			});
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(screen.queryByText(FILE_1.name)).not.toBeInTheDocument();
			expect(screen.queryByText(FILE_2.name)).not.toBeInTheDocument();
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
		});

		it("should revert to default value on reset", async () => {
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);
			jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });

			await renderComponent({
				files: [FILE_2],
				overrideSchema: {
					defaultValues: {
						field: [
							{
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
				await flushPromise();
				await waitFor(() => fireEvent.click(getSubmitButton()));
			});

			expect(screen.getByText(FILE_1.name)).toBeInTheDocument();
			expect(screen.queryByText(FILE_2.name)).not.toBeInTheDocument();
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					field: expect.arrayContaining([
						expect.objectContaining({
							fileName: FILE_1.name,
							dataURL: JPG_BASE64,
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
										label: "Image Upload",
										uiType: UI_TYPE,
										uploadOnAddingFile: {
											method: "post",
											url: "test",
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
							label: "Image Upload",
							uiType: UI_TYPE,
							compress: false,
						},
						...getSubmitButtonProps(),
						...getResetButtonProps(),
					},
				},
			},
		};

		beforeEach(() => {
			formIsDirty = undefined;
			jest.spyOn(ImageHelper, "convertBlob").mockResolvedValue(JPG_BASE64);
			jest.spyOn(ImageHelper, "getMetadata").mockResolvedValue(METADATA);
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);
			jest.spyOn(FileHelper, "getType").mockResolvedValue({ ext: "jpg", mime: "image/jpeg" });
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user adds an image", async () => {
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			await act(async () => {
				fireEvent.change(getDragInputUploadField(), {
					target: {
						files: [FILE_1],
					},
				});
				await new Promise((resolve) => setTimeout(resolve, 100)); //add time-out due the the behavior change in the drag-upload
			});
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

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
				await flushPromise();
			});
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

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
									fileName: FILE_1.name,
									dataURL: JPG_BASE64,
								},
							],
						},
					}}
					onClick={handleClick}
				/>
			);
			await waitFor(() => fireEvent.click(screen.getByTestId(`${COMPONENT_ID}-file-item-1__btn-delete`)));
			await flushPromise();
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

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
				await new Promise((resolve) => setTimeout(resolve, 100)); //add time-out due the the behavior change in the drag-upload
				await flushPromise(100);
				await waitFor(() => fireEvent.click(getResetButton()));
			});
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

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
				await new Promise((resolve) => setTimeout(resolve, 100)); //add time-out due the the behavior change in the drag-upload
				await flushPromise(100);
				await waitFor(() => fireEvent.click(getResetButton()));
			});
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	describe("when capture value is specified", () => {
		it("should render an input element with the specified capture value", async () => {
			await renderComponent({ overrideField: { capture: "user" } });

			const input = screen.getByTestId("field-drag-upload__hidden-input");

			expect(input.getAttribute("type")).toBe("file");
			expect(input.getAttribute("capture")).toBe("user");
		});
	});

	describe("upload multiple images at once through file dialog", () => {
		it("able to upload multiple images at once", async () => {
			await renderComponent({
				overrideField: { multiple: true },
			});
			await act(async () => {
				fireEvent.change(getDragInputUploadField(), {
					target: {
						files: [FILE_1, FILE_2],
					},
				});
				await new Promise((resolve) => setTimeout(resolve, 100)); //add time-out due the the behavior change in the drag-upload
				await flushPromise();
			});
			expect((getDragInputUploadField() as HTMLInputElement).files).toHaveLength(2);
			expect(screen.getByText(FILE_1.name)).toBeInTheDocument();
			expect(screen.getByText(FILE_2.name)).toBeInTheDocument();
		});

		it("should show exceed error when add over the max number", async () => {
			await renderComponent({
				overrideField: { multiple: true, validation: [{ max: 1 }] },
			});
			await act(async () => {
				fireEvent.change(getDragInputUploadField(), {
					target: {
						files: [FILE_1, FILE_2],
					},
				});
				await new Promise((resolve) => setTimeout(resolve, 100)); //add time-out due the the behavior change in the drag-upload
			});
			expect(screen.getByText(ERROR_MESSAGES.UPLOAD("photo").MAX_FILES(1))).toBeInTheDocument();
		});

		describe("when add through review modal", () => {
			it("able to upload multiple images at once", async () => {
				await renderComponent({
					files: [FILE_1],
					overrideField: { multiple: true, editImage: true },
					reviewImage: true,
				});
				await waitFor(() =>
					fireEvent.change(getReviewModalUploadField(), { target: { files: [FILE_1, FILE_2] } })
				);
				expect(getField("button", `thumbnail of ${FILE_1.name}`)).toBeInTheDocument();
				expect(getField("button", `thumbnail of ${FILE_2.name}`)).toBeInTheDocument();
				expect(getField("button", `thumbnail of test (1).jpg`)).toBeInTheDocument();
			});

			it("should show exceed error when add over the max number", async () => {
				await renderComponent({
					files: [FILE_1],
					overrideField: { multiple: true, editImage: true, validation: [{ max: 2 }] },
					reviewImage: true,
				});
				await waitFor(() =>
					fireEvent.change(getReviewModalUploadField(), { target: { files: [FILE_1, FILE_2] } })
				);
				expect(getField("button", `error with ${FILE_1.name}`)).toBeInTheDocument();
				expect(
					screen.getByText(ERROR_MESSAGES.UPLOAD("photo").MAX_FILES_WITH_REMAINING(1))
				).toBeInTheDocument();
			});
		});
	});
});
