import { useCallback, useEffect, useRef, useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import styled from "styled-components";
import * as Yup from "yup";
import { useIframeMessage, useValidationConfig } from "../../../utils/hooks";
import { IGenericCustomFieldProps } from "../types";
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
	const {
		error,
		id,
		schema: { "data-testid": testId, src, validationTimeout = 2000, ...otherSchema },
		value,
	} = props;
	const formContext = useFormContext();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const deferredRef = useRef<{
		resolve?: ((v: boolean | PromiseLike<boolean>) => void) | undefined;
		reject?: ((v: boolean | PromiseLike<boolean>) => void) | undefined;
	}>({});
	const promiseTimeoutRef = useRef<NodeJS.Timeout>();
	const [dimensions, setDimensions] = useState<{ width?: number; height?: number }>({});
	const { setFieldValidationConfig } = useValidationConfig();

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const getTargetOriginFromSrc = useCallback(() => {
		try {
			const parsedUrl = new URL(src);
			return `${parsedUrl.protocol}//${parsedUrl.host}`;
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
		iframePostMessage({ type: EPostMessageEvent.SYNC, payload: { error, id, value } });
	}, [error, id, value, iframePostMessage]);

	// =========================================================================
	// POSTMESSAGE HANDLERS
	// =========================================================================
	useIframeMessage(
		EPostMessageEvent.TRIGGER_SYNC,
		useCallback(() => {
			iframePostMessage({ type: EPostMessageEvent.SYNC, payload: { error, id, value } });
		}, [error, id, value, iframePostMessage])
	);

	useIframeMessage<{ width?: number | undefined; height?: number | undefined }>(
		EPostMessageEvent.RESIZE,
		useCallback((e) => {
			setDimensions({
				width: e.data.payload?.width,
				height: e.data.payload?.height,
			});
		}, [])
	);

	useIframeMessage<unknown>(
		EPostMessageEvent.SET_VALUE,
		useCallback(
			(e) => {
				formContext.setValue(id, e.data.payload, { shouldDirty: true });
			},
			[formContext, id]
		)
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
		)
	);

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<FluidIframe
			{...otherSchema}
			ref={iframeRef}
			src={src}
			id={id}
			data-testid={testId || id}
			$width={dimensions.width}
			$height={dimensions?.height}
		/>
	);
};

const FluidIframe = styled.iframe<{ $width?: number | undefined; $height?: number | undefined }>`
	width: ${({ $width }) => ($width >= 0 ? `${$width}px` : "100%")};
	height: ${({ $height }) => ($height >= 0 ? `${$height}px` : "100%")};
	border: none;
`;
