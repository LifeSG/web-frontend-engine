import isEmpty from "lodash/isEmpty";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import * as FrontendEngineElements from "..";
import { TestHelper } from "../../../utils";
import * as FrontendEngineFields from "../../fields";
import { EElementType, EFieldType, IGenericFieldProps, TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { ERROR_MESSAGES } from "../../shared";
import { ConditionalRenderer } from "./conditional-renderer";
import { IWrapperProps } from "./types";
import { DSAlert } from "./wrapper.styles";

export const Wrapper = (props: IWrapperProps): JSX.Element | null => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema, children, warnings } = props;
	const { showIf, uiType, children: schemaChildren, ...otherSchema } = schema || {};
	const [components, setComponents] = useState<React.ReactNode>(null);
	const { control } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	/**
	 * render direct descendants according to the type of children
	 * - conditionally render components through Controller
	 * - render strings directly
	 * - otherwise show field not supported error
	 */
	useEffect(() => {
		const wrapperChildren = schemaChildren || children;
		if (typeof wrapperChildren === "object") {
			const fieldTypeKeys = Object.keys(EFieldType);
			const elementTypeKeys = Object.keys(EElementType);
			const renderComponents: JSX.Element[] = [];

			Object.entries(wrapperChildren).forEach(([id, child]) => {
				if (isEmpty(child) || typeof child !== "object") return;
				if ("referenceKey" in child) {
					// referenceKey : filer => <Child schema={child.schema}> </Child>
					// referenceKey : filter-item => <Child children={child.fields}> <
					// 1. How should we render
					// 2. How to render nested
					console.log(child);
					return;
				}
				const uiType = child.uiType?.toUpperCase();
				const frontendEngineComponents = { ...FrontendEngineFields, ...FrontendEngineElements };

				if (fieldTypeKeys.includes(uiType)) {
					// render fields with controller to register them into react-hook-form
					const Field = frontendEngineComponents[EFieldType[uiType]];
					renderComponents.push(
						<ConditionalRenderer id={id} key={id} renderRules={child.showIf} schema={child}>
							<Controller
								control={control}
								name={id}
								shouldUnregister={true}
								render={({ field, fieldState }) => {
									const fieldProps = { ...field, id, ref: undefined }; // not passing ref because not all components have fields to be manipulated
									const warning = warnings ? warnings[id] : "";

									if (!warning) {
										return <Field schema={child} {...fieldProps} {...fieldState} />;
									}
									return (
										<>
											<Field schema={child} {...fieldProps} {...fieldState} />
											<DSAlert type="warning">{warning}</DSAlert>
										</>
									);
								}}
							/>
						</ConditionalRenderer>
					);
				} else if (elementTypeKeys.includes(uiType)) {
					// render other elements as normal components
					const Element = (frontendEngineComponents[EElementType[uiType]] ||
						Wrapper) as React.ForwardRefExoticComponent<IGenericFieldProps<TFrontendEngineFieldSchema>>;
					renderComponents.push(
						<ConditionalRenderer id={id} key={id} renderRules={child.showIf} schema={child}>
							<Element schema={child} id={id} />
						</ConditionalRenderer>
					);
				} else {
					// need uiType check to ignore other storybook args
					renderComponents.push(<Fragment key={id}>{ERROR_MESSAGES.GENERIC.UNSUPPORTED}</Fragment>);
				}
			});
			setComponents(renderComponents);
		} else if (typeof wrapperChildren === "string") {
			setComponents(wrapperChildren);
		} else {
			setComponents(ERROR_MESSAGES.GENERIC.UNSUPPORTED);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schemaChildren || children, control, warnings]);

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
