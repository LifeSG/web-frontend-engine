import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine, IFrontendEngineData, IFrontendEngineRef } from "../../../../components";
import { IESignatureFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { AxiosApiClient, FileHelper } from "../../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "e-signature-field";
const COMPONENT_LABEL = "Signature";
const PNG_BASE64 =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+GdT9x8ABqwCuJzKui8AAAAASUVORK5CYII=";
const FILE_1 = new File(["file"], "test.png", {
	type: "image/png",
});
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: COMPONENT_LABEL,
					uiType: UI_TYPE,
					"data-testid": "field",
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<IESignatureFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), overrideSchema);
	merge(json, {
		sections: {
			section: {
				children: {
					[COMPONENT_ID]: overrideField,
				},
			},
		},
	});
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const drawAndSave = (edit = false) => {
	const canvas = document.querySelector(".upper-canvas");

	fireEvent.click(screen.getByRole("button", { name: !edit ? "Add signature" : "Edit signature" }));
	fireEvent.mouseDown(canvas, { clientX: 20, clientY: 20 });
	fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
	fireEvent.mouseUp(canvas, { clientX: 120, clientY: 120 });
	fireEvent.click(screen.getByRole("button", { name: "Save" }));
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		setupJestCanvasMock();
	});
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByRole("button", { name: "Add signature" })).toBeInTheDocument();
	});

	it("should be able to support default value", () => {
		renderComponent(undefined, {
			defaultValues: {
				[COMPONENT_ID]: {
					fieldId: "fieldId",
					dataURL: PNG_BASE64,
				},
			},
		});

		expect(screen.getByAltText("Signature preview")).toHaveAttribute("src", PNG_BASE64);
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).not.toHaveBeenCalled();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	describe("upload", () => {
		it("should be able to upload as base64 content-type", async () => {
			const uploadConfig = { url: "url", type: "base64" } as const;
			const uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({});
			renderComponent({ upload: uploadConfig });
			await waitFor(() => drawAndSave());

			expect(uploadSpy).toHaveBeenCalledWith(
				uploadConfig.url,
				expect.any(FormData),
				expect.objectContaining({
					headers: { "Content-Type": "application/json" },
				})
			);
		});

		it("should be able to upload as multipart content-type", async () => {
			jest.spyOn(FileHelper, "dataUrlToBlob").mockResolvedValue(FILE_1);

			const uploadConfig = { url: "url", type: "multipart" } as const;
			const uploadSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockResolvedValue({});
			renderComponent({ upload: uploadConfig });
			await act(async () => {
				await waitFor(() => drawAndSave());
			});

			expect(uploadSpy).toHaveBeenCalledWith(
				uploadConfig.url,
				expect.any(FormData),
				expect.objectContaining({
					headers: { "Content-Type": "multipart/form-data" },
				})
			);
		});

		it("should show error message with retry button and dismiss the loading indicator if upload fails", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue({});
			renderComponent({ upload: { url: "url", type: "base64" } });
			await waitFor(() => drawAndSave());

			expect(screen.getByText(ERROR_MESSAGES.ESIGNATURE.UPLOAD)).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Please try again." })).toBeInTheDocument();
			expect(screen.queryByTestId(`${COMPONENT_ID}-base-progress-bar`)).not.toBeInTheDocument();
		});

		it("should show refresh page alert message if upload fails for 3 consecutive times", async () => {
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue({});
			renderComponent({ upload: { url: "url", type: "base64" } });

			await waitFor(() => drawAndSave());

			const tryAgainButton = screen.getByRole("button", { name: "Please try again." });
			await waitFor(() => fireEvent.click(tryAgainButton));
			await waitFor(() => fireEvent.click(tryAgainButton));

			expect(screen.getByText(ERROR_MESSAGES.ESIGNATURE.UPLOAD)).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Please try again." })).toBeInTheDocument();
		});
	});

	describe("reset", () => {
		it("should clear values on reset", async () => {
			renderComponent();
			await waitFor(() => drawAndSave());
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.queryByAltText("Signature preview")).not.toBeInTheDocument();
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			renderComponent(undefined, {
				defaultValues: {
					[COMPONENT_ID]: {
						fileId: "fileId",
						dataURL: PNG_BASE64,
					},
				},
			});
			await waitFor(() => drawAndSave(true));
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByAltText("Signature preview")).toHaveAttribute("src", PNG_BASE64);
			expect(SUBMIT_FN).toHaveBeenCalledWith(
				expect.objectContaining({
					[COMPONENT_ID]: { fileId: "fileId", dataURL: PNG_BASE64 },
				})
			);
		});
	});

	describe("dirty state", () => {
		let formIsDirty: boolean;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};

		beforeEach(() => {
			formIsDirty = undefined;
		});

		it("should mount without setting form state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			await waitFor(() => drawAndSave());

			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...JSON_SCHEMA,
						defaultValues: {
							[COMPONENT_ID]: {
								fileId: "fileId",
								dataURL: PNG_BASE64,
							},
						},
					}}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			await waitFor(() => drawAndSave());
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{
						...JSON_SCHEMA,
						defaultValues: {
							[COMPONENT_ID]: {
								fileId: "fileId",
								dataURL: PNG_BASE64,
							},
						},
					}}
					onClick={handleClick}
				/>
			);
			await waitFor(() => drawAndSave(true));
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
	warningTestSuite<IESignatureFieldSchema>({ label: COMPONENT_LABEL, uiType: UI_TYPE });
});
