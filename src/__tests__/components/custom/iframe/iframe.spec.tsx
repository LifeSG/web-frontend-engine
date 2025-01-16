import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { EPostMessageEvent, IIframeSchema } from "../../../../components/custom";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/types";
import {
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const CHANGE_FN = jest.fn();
const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "iframe";
const IFRAME_SRC = "http://localhost";
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					referenceKey: UI_TYPE,
					src: IFRAME_SRC,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const getIframe = () => {
	return screen.getByTestId<HTMLIFrameElement>(COMPONENT_ID);
};

const renderComponent = (overrideField?: TOverrideField<IIframeSchema>, overrideSchema?: TOverrideSchema) => {
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
	return render(
		<FrontendEngine data={json} onValueChange={(values, isValid) => CHANGE_FN(isValid)} onSubmit={SUBMIT_FN} />
	);
};

const sendPostMessage = (type: EPostMessageEvent, payload?: unknown | undefined) => {
	fireEvent(
		window,
		new MessageEvent("message", {
			data: { type, payload },
			origin: IFRAME_SRC,
		})
	);
};

describe("iframe", () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		const iframeElement = getIframe();
		expect(iframeElement).toBeInTheDocument();
		expect(iframeElement).toHaveAttribute("src", IFRAME_SRC);
	});

	it("should fire a sync postMessage with the field state on receiving a triggerSync postMessage", () => {
		const defaultValue = "hello";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });
		const iframeElement = getIframe();
		const postMessageSpy = jest.spyOn(iframeElement.contentWindow, "postMessage");

		sendPostMessage(EPostMessageEvent.TRIGGER_SYNC);

		expect(postMessageSpy).toHaveBeenCalledWith(
			{ type: EPostMessageEvent.SYNC, payload: { id: COMPONENT_ID, value: defaultValue } },
			IFRAME_SRC
		);
	});

	it("should update its value on receiving a setValue postMessage", async () => {
		renderComponent({ validationTimeout: -1 });

		sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "hello world" }));
	});

	describe("validation", () => {
		it("should send validate postMessage on value change", async () => {
			renderComponent();
			const iframeElement = getIframe();
			const postMessageSpy = jest.spyOn(iframeElement.contentWindow, "postMessage");
			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");

			await waitFor(() =>
				expect(postMessageSpy).toHaveBeenCalledWith(
					{ type: EPostMessageEvent.VALIDATE, payload: { value: "hello world", isSubmit: false } },
					IFRAME_SRC
				)
			);
		});

		it("should send validate postMessage on submit", async () => {
			renderComponent();
			const iframeElement = getIframe();
			const postMessageSpy = jest.spyOn(iframeElement.contentWindow, "postMessage");

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(postMessageSpy).toHaveBeenCalledWith(
				{ type: EPostMessageEvent.VALIDATE, payload: { isSubmit: true } },
				IFRAME_SRC
			);
		});

		it("should validate asynchronously through validate postMessage", async () => {
			renderComponent();
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).not.toHaveBeenCalled();

			sendPostMessage(EPostMessageEvent.VALIDATION_RESULT, true);
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalled();
		});

		it("should skip validation if validationTimeout < 0", async () => {
			renderComponent({ validationTimeout: -1 });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalled();
		});

		it("should fail validation if validation exceeds validationTimeout", async () => {
			jest.useFakeTimers();

			renderComponent({ validationTimeout: 1000 });
			await waitFor(() => sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world"));

			jest.advanceTimersByTime(100);
			await waitFor(() => expect(CHANGE_FN).not.toHaveBeenCalled());

			jest.advanceTimersByTime(1000);
			await waitFor(() => expect(CHANGE_FN).toHaveBeenCalledWith(false));

			jest.useRealTimers();
		});

		it("should be able to differentiate change and submit events in validation postMessage", async () => {
			renderComponent();
			const iframeElement = getIframe();
			const postMessageSpy = jest.spyOn(iframeElement.contentWindow, "postMessage");

			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");

			await waitFor(() =>
				expect(postMessageSpy).toHaveBeenCalledWith(
					{ type: EPostMessageEvent.VALIDATE, payload: { value: "hello world", isSubmit: false } },
					IFRAME_SRC
				)
			);

			fireEvent.click(getSubmitButton());
			await waitFor(() =>
				expect(postMessageSpy).toHaveBeenCalledWith(
					{ type: EPostMessageEvent.VALIDATE, payload: { value: "hello world", isSubmit: true } },
					IFRAME_SRC
				)
			);
		});
	});

	it("should be able to resize through postMessage", async () => {
		const width = 123;
		const height = 456;
		renderComponent();
		sendPostMessage(EPostMessageEvent.RESIZE, { width, height });

		const iframeElement = getIframe();
		const computedStyle = window.getComputedStyle(iframeElement);
		expect(computedStyle.width).toBe(`${width}px`);
		expect(computedStyle.height).toBe(`${height}px`);
	});

	describe("reset", () => {
		it("should clear value on reset", async () => {
			renderComponent({ validationTimeout: -1 });
			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith({});
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "hello";
			renderComponent({ validationTimeout: -1 }, { defaultValues: { [COMPONENT_ID]: defaultValue } });
			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith({ [COMPONENT_ID]: defaultValue });
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

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "hello" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "hello" } }}
					onClick={handleClick}
				/>
			);
			sendPostMessage(EPostMessageEvent.SET_VALUE, "hello world");
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});
});
