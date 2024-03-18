import isEmpty from "lodash/isEmpty";
import React, { Fragment, ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import * as FrontendEngineElements from "..";
import { TestHelper } from "../../../utils";
import {
	useCustomComponents,
	useFormSchema,
	useIsomorphicDeepLayoutEffect,
	useValidationSchema,
} from "../../../utils/hooks";
import * as FrontendEngineCustomComponents from "../../custom";
import { ECustomElementType, ECustomFieldType } from "../../custom";
import { EElementType } from "../../elements";
import * as FrontendEngineFields from "../../fields";
import { EFieldType } from "../../fields";
import { TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared";
import { ColWrapper } from "./col-wrapper";
import { ConditionalRenderer } from "./conditional-renderer";
import { FieldWrapper } from "./field-wrapper";
import { IWrapperProps } from "./types";
import { DSAlert } from "./wrapper.styles";

const fieldTypeKeys = Object.keys(EFieldType);
const elementTypeKeys = Object.keys(EElementType);

export const Wrapper = (props: IWrapperProps): JSX.Element | null => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema, children } = props;
	const { showIf: _showIf, uiType, children: schemaChildren, ...otherSchema } = schema || {};
	const { warnings } = useValidationSchema();

	const [components, setComponents] = useState<React.ReactNode>(null);
	const { control } = useFormContext();
	const { getCustomComponent } = useCustomComponents();
	const {
		formSchema: { overrides },
		overrideSchema,
	} = useFormSchema();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	/**
	 * render direct descendants according to the type of children
	 * - conditionally render components through Controller
	 * - render strings directly
	 * - otherwise show field not supported error
	 */
	useIsomorphicDeepLayoutEffect(() => {
		const wrapperChildren = overrideSchema(schemaChildren || children, overrides);
		if (typeof wrapperChildren === "object") {
			const renderComponents: JSX.Element[] = [];

			Object.keys(wrapperChildren).forEach((childId) => {
				const childSchema = wrapperChildren[childId];
				if (isEmpty(childSchema) || typeof childSchema !== "object") return;
				let renderComponent: ReactNode = (
					<Fragment key={childId}>{ERROR_MESSAGES.GENERIC.UNSUPPORTED}</Fragment>
				);
				if ("referenceKey" in childSchema) {
					const referenceKey = childSchema.referenceKey.toUpperCase();
					if (getCustomComponent(childSchema.referenceKey)) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildField);
					} else if (FrontendEngineCustomComponents[ECustomFieldType[referenceKey]]) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildField);
					} else if (FrontendEngineCustomComponents[ECustomElementType[referenceKey]]) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildElement);
					} else {
						// let custom components fail silently
						renderComponent = <Fragment key={childId} />;
					}
				} else if ("uiType" in childSchema) {
					if (fieldTypeKeys.includes(childSchema.uiType.toUpperCase())) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildField);
					} else if (elementTypeKeys.includes(childSchema.uiType.toUpperCase())) {
						renderComponent = buildConditionalRenderer(childId, childSchema)(buildElement);
					}
				}
				renderComponents.push(renderComponent);
			});
			setComponents(renderComponents);
		} else if (typeof wrapperChildren === "string") {
			setComponents(wrapperChildren);
		} else {
			setComponents(ERROR_MESSAGES.GENERIC.UNSUPPORTED);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schemaChildren || children, overrides, control, warnings, getCustomComponent]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	/* eslint-disable indent */
	const buildConditionalRenderer =
		(childId: string, childSchema: TFrontendEngineFieldSchema) =>
		(buildFn: (childId: string, child: TFrontendEngineFieldSchema) => JSX.Element) =>
			(
				<ConditionalRenderer
					id={childId}
					key={childId}
					{...(childSchema && "showIf" in childSchema && { renderRules: childSchema.showIf })}
					schema={childSchema}
				>
					{buildFn(childId, childSchema)}
				</ConditionalRenderer>
			);
	/* eslint-enable indent */

	const buildField = (childId: string, childSchema: TFrontendEngineFieldSchema) => {
		let Field;
		if ("uiType" in childSchema) {
			Field = FrontendEngineFields[EFieldType[childSchema.uiType?.toUpperCase()]];
		} else if ("referenceKey" in childSchema) {
			Field =
				FrontendEngineCustomComponents[ECustomFieldType[childSchema.referenceKey?.toUpperCase()]] ||
				getCustomComponent(childSchema.referenceKey);
		}

		if (!Field) return null;

		const warning = warnings?.[childId];

		return (
			<ColWrapper id={childId} childSchema={childSchema}>
				<FieldWrapper id={childId} schema={childSchema} Field={Field} />
				{warning && (
					<DSAlert type="warning" data-testid={TestHelper.generateId(childId, "warning")}>
						{warning}
					</DSAlert>
				)}
			</ColWrapper>
		);
	};

	const buildElement = (childId: string, childSchema: TFrontendEngineFieldSchema) => {
		let Element;
		if ("uiType" in childSchema) {
			Element = FrontendEngineElements[EElementType[childSchema.uiType?.toUpperCase()]] || Wrapper;
		} else if ("referenceKey" in childSchema) {
			Element = FrontendEngineCustomComponents[ECustomElementType[childSchema.referenceKey?.toUpperCase()]];
		}

		return (
			<ColWrapper id={childId} childSchema={childSchema}>
				<Element schema={childSchema} id={childId} />
			</ColWrapper>
		);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const Component = uiType as string | React.FunctionComponent;

	if (!Component) {
		return <>{components}</>;
	}
	return (
		<Component {...otherSchema} {...{ id, "data-testid": TestHelper.generateId(id, uiType) }}>
			{components}
		</Component>
	);
};
