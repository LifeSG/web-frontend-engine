import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import * as FrontendEngineFields from "../";
import { TestHelper } from "../../../utils";
import { EFieldType, IGenericFieldProps, TFrontendEngineFieldSchema } from "../../frontend-engine/types";
import { ConditionalRenderer } from "./conditional-renderer";
import { IWrapperSchema } from "./types";

interface IWrapperProps {
	id?: string;
	schema?: IWrapperSchema | undefined;
	/** only used internally by FrontendEngine */
	children?: Record<string, TFrontendEngineFieldSchema>;
}

export const Wrapper = (props: IWrapperProps): JSX.Element | null => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema, children } = props;
	const { fieldType, children: schemaChildren, ...otherSchema } = schema || {};
	const [fields, setFields] = useState<React.ReactNode>(null);
	const { control } = useFormContext();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	/**
	 * render direct descendants according to the type of children
	 * - conditionally render fields through Controller
	 * - render strings directly
	 * - otherwise show field not supported error
	 */
	useEffect(() => {
		const wrapperChildren = schemaChildren || children;
		if (typeof wrapperChildren === "object") {
			const fieldTypeKeys = Object.keys(EFieldType);
			const fieldComponents: JSX.Element[] = [];

			Object.entries(wrapperChildren).forEach(([id, child]) => {
				if (isEmpty(child)) return;

				const fieldType = child.fieldType?.toUpperCase();

				if (typeof child === "object" && fieldTypeKeys.includes(fieldType)) {
					const Field = (FrontendEngineFields[EFieldType[fieldType]] ||
						Wrapper) as React.ForwardRefExoticComponent<IGenericFieldProps<TFrontendEngineFieldSchema>>;

					fieldComponents.push(
						<ConditionalRenderer id={id} key={id} renderRules={child.showIf}>
							<Controller
								control={control}
								name={id}
								shouldUnregister={true}
								render={({ field, fieldState }) => {
									const fieldProps = { ...field, id, ref: undefined }; // not passing ref because not all components have fields to be manipulated
									return <Field schema={child} {...fieldProps} {...fieldState} />;
								}}
							/>
						</ConditionalRenderer>
					);
				} else if (fieldType) {
					// need fieldType check to ignore other storybook args
					fieldComponents.push(<>This component is not supported by the engine</>);
				}
			});
			setFields(fieldComponents);
		} else if (typeof wrapperChildren === "string") {
			setFields(wrapperChildren);
		} else {
			setFields("This component is not supported by the engine");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schemaChildren || children, control]);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const Element = fieldType as string | React.FunctionComponent;

	if (!Element) {
		return <>{fields}</>;
	}
	return (
		<Element {...otherSchema} {...{ id, "data-testid": TestHelper.generateId(id, fieldType), "aria-label": id }}>
			{fields}
		</Element>
	);
};
