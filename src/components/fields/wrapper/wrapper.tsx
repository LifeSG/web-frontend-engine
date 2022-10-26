import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { EFieldType, IGenericFieldProps, TFrontendEngineFieldSchema } from "src/components/frontend-engine/types";
import * as FrontendEngineFields from "../";
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
	useEffect(() => {
		const renderChildren = schemaChildren || children;
		if (typeof renderChildren === "object") {
			const fieldTypeKeys = Object.keys(EFieldType);
			const fieldComponents: JSX.Element[] = [];
			Object.entries(renderChildren).forEach(([id, child]) => {
				if (isEmpty(child)) return;
				const fieldType = child.fieldType?.toUpperCase();
				if (typeof child === "object" && fieldTypeKeys.includes(fieldType)) {
					const Field = (FrontendEngineFields[EFieldType[fieldType]] ||
						Wrapper) as React.ForwardRefExoticComponent<IGenericFieldProps<TFrontendEngineFieldSchema>>;

					fieldComponents.push(
						<Controller
							control={control}
							key={id}
							name={id}
							render={({ field, fieldState }) => {
								const fieldProps = { ...field, id, ref: undefined }; // not passing ref because not all components have fields to be manipulated
								return <Field schema={child} {...fieldProps} {...fieldState} />;
							}}
						/>
					);
				} else if (fieldType) {
					// need fieldType check to ignore other storybook args
					fieldComponents.push(<>This component is not supported by the engine</>);
				}
			});
			setFields(fieldComponents);
		} else if (typeof renderChildren === "string") {
			setFields(renderChildren);
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
		<Element {...otherSchema} {...{ id }}>
			{fields}
		</Element>
	);
};
