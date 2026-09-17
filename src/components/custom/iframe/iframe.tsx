import { useCallback, useEffect, useRef, useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import * as Yup from "yup";
import clsx from "clsx";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { useFieldEvent, useIframeMessage, useValidationConfig } from "../../../utils/hooks";
import { filterSchemaProps } from "../../../utils/prop-helper";
import { IGenericCustomFieldProps } from "../types";
import * as styles from "./iframe.styles";
import { EPostMessageEvent, IIframeSchema } from "./types";

type TIframePostMessageOptions =
	| {
			type: EPostMessageEvent.SYNC;
			payload: { error: FieldError; id: string; value: unknown };
	  }
	| {
			type: EPostMessageEvent.VALIDATE;
			payload: { value: unknown; isSubmit: boolean };
	  };

export const Iframe = (props: IGenericCustomFieldProps<IIframeSchema>) => {
	// =========================================================================
	// CONST, STATE, REF
	// =========================================================================
	const { error, id, schema, value } = props;
	const {
		customSchema: { "data-testid": testId, src, validationTimeout = 2000, className, title, ...iframeProps },
	} = filterSchemaProps(schema);
	const formContext = useFormContext();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const deferredRef = useRef<{
		resolve?: ((v: boolean | PromiseLike<boolean>) => void) | undefined;
		reject?: ((v: boolean | PromiseLike<boolean>) => void) | undefined;
	}>({});
	const promiseTimeoutRef = useRef<NodeJS.Timeout>();
	const [dimensions, setDimensions] = useState<{ width?: number; height?: number }>({});
	const { setFieldValidationConfig } = useValidationConfig();
	const { dispatchFieldEvent } = useFieldEvent();

	// Apply dynamic dimensions via CSS variables
	useApplyStyle(iframeRef, {
		[styles.tokens.fluidIframe.width]:
			dimensions.width !== undefined && dimensions.width >= 0 ? `${dimensions.width}px` : undefined,
		[styles.tokens.fluidIframe.height]:
			dimensions.height !== undefined && dimensions.height >= 0 ? `${dimensions.height}px` : undefined,
	});

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const getTargetOriginFromSrc = useCallback(() => {
		try {
			// resolve against the embedding page so relative/protocol-relative src values (e.g. "/embedded/form",
			// "//partner.example/form") derive a real origin instead of throwing — new URL(src) with no base
			// always throws for those, which previously caused the origin check to fail open (accept any origin)
			// for any iframe configured with a same-origin-relative src, a completely ordinary configuration
			const parsedUrl = new URL(src, window.location.href);
			if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
				return null;
			}
			return parsedUrl.origin;
		} catch (error) {
			console.error("Invalid URL:", error);
			return null;
		}
	}, [src]);

	const iframePostMessage = useCallback(
		(options: TIframePostMessageOptions) => {
			const { type, payload } = options;
			const targetOrigin = getTargetOriginFromSrc();
			if (targetOrigin) {
				iframeRef.current.contentWindow.postMessage({ type, payload }, targetOrigin);
			} else {
				console.warn(`invalid targetOrigin, iframe ${type} postMessage for ${id} aborted.`);
			}
		},
		[getTargetOriginFromSrc, id]
	);

	const clearAsyncValidation = useCallback(() => {
		if (promiseTimeoutRef.current) clearTimeout(promiseTimeoutRef.current);
	}, []);

	const asyncValidation = useCallback(
		async (value: unknown, isSubmit: boolean): Promise<boolean> => {
			clearAsyncValidation();
			iframePostMessage({ type: EPostMessageEvent.VALIDATE, payload: { value, isSubmit } });
			try {
				return await new Promise((resolve, reject) => {
					deferredRef.current.resolve = resolve;
					deferredRef.current.reject = reject;
					promiseTimeoutRef.current = setTimeout(() => {
						reject(false);
						console.warn(
							`validation timeout for iframe component: ${id}. does child iframe have the validation handler? eiher extend validationTimeout value of set to -1 to skip it.`
						);
					}, validationTimeout);
				});
			} catch (error) {
				return false;
			}
		},
		[clearAsyncValidation, id, iframePostMessage, validationTimeout]
	);
	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setFieldValidationConfig(
			id,
			Yup.mixed().test("validation", async (value, context) => {
				if (validationTimeout >= 0) {
					// abortEarly is undefined (true) by default
					// on submit, it is set to false
					// we determine a submit action through that flag
					return await asyncValidation(value, context.options.abortEarly === false);
				}
				return true;
			})
		);

		return () => {
			clearAsyncValidation();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [asyncValidation, validationTimeout]);

	useEffect(() => {
		dispatchFieldEvent("loading", id);
	}, [dispatchFieldEvent, id, src]);

	useEffect(() => {
		iframePostMessage({ type: EPostMessageEvent.SYNC, payload: { error, id, value } });
	}, [error, id, value, iframePostMessage]);
	// =========================================================================
	// POSTMESSAGE HANDLERS
	// =========================================================================
	// only messages from the origin derived from `src` are accepted; a child iframe that
	// navigates to a different origin before posting back will need to do so via the
	// original src origin's window, or the message is dropped
	const allowedOrigin = getTargetOriginFromSrc();

	useIframeMessage(
		EPostMessageEvent.TRIGGER_SYNC,
		useCallback(() => {
			iframePostMessage({ type: EPostMessageEvent.SYNC, payload: { error, id, value } });
		}, [error, id, value, iframePostMessage]),
		allowedOrigin
	);

	useIframeMessage<{ width?: number | undefined; height?: number | undefined }>(
		EPostMessageEvent.RESIZE,
		useCallback((e) => {
			setDimensions({
				width: e.data.payload?.width,
				height: e.data.payload?.height,
			});
		}, []),
		allowedOrigin
	);

	useIframeMessage<unknown>(
		EPostMessageEvent.SET_VALUE,
		useCallback(
			(e) => {
				formContext.setValue(id, e.data.payload, { shouldDirty: true });
			},
			[formContext, id]
		),
		allowedOrigin
	);

	useIframeMessage<boolean>(
		EPostMessageEvent.VALIDATION_RESULT,
		useCallback(
			(e) => {
				if (e.data.payload) {
					deferredRef.current.resolve(e.data.payload);
				} else {
					deferredRef.current.reject(e.data.payload);
				}
				clearAsyncValidation();
			},
			[clearAsyncValidation]
		),
		allowedOrigin
	);

	useIframeMessage(
		EPostMessageEvent.LOADED,
		useCallback(() => {
			dispatchFieldEvent("loaded", id);
		}, [dispatchFieldEvent, id]),
		allowedOrigin
	);

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<iframe
			{...iframeProps}
			className={clsx(styles.fluidIframe, className)}
			ref={iframeRef}
			src={src}
			id={id}
			data-testid={testId || id}
			title={title}
		/>
	);
};
