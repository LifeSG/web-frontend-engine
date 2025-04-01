import { V2_Text } from "@lifesg/react-design-system/v2_text";
import { IFormBuilderMethods } from "@lifesg/web-form-builder";
import { ISchemaProps } from "@lifesg/web-form-builder/translator";
import { useEffect, useState } from "react";
import { IFrontendEngineData } from "../../../../components";
import {
	ActionWrapper,
	AlertWrapper,
	RefreshButton,
	SaveButton,
	SchemaEditor,
	SchemaEditorWrapper,
} from "./form-builder-tool.styles";

interface IProps {
	schema?: IFrontendEngineData | undefined;
	onChange?: ((schema: ISchemaProps) => void) | undefined;
	formBuilderRef: React.MutableRefObject<IFormBuilderMethods>;
}

export const SchemaView = ({ schema, onChange, formBuilderRef }: IProps) => {
	// ===========================================================================
	// CONST, STATE, REFS
	// ===========================================================================
	const [stringifiedSchema, setStringifiedSchema] = useState("");
	const [hasError, setHasError] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		if (schema) {
			const schemaString = JSON.stringify(schema, null, 2);
			setStringifiedSchema(schemaString);
		}
	}, [schema]);

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const handleSchemaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setStringifiedSchema(event.target.value);
		setIsDirty(true);
	};

	const onSubmit = () => {
		let newSchema: ISchemaProps;
		try {
			newSchema = { schema: JSON.parse(stringifiedSchema), prefill: null };
			formBuilderRef.current.parseSchema(newSchema);

			setHasError(false);
			setIsDirty(false);
		} catch (error) {
			console.error(error);
			setHasError(true);
			return;
		}
		onChange(newSchema);
	};

	const handleReset = () => {
		if (schema) {
			const schemaString = JSON.stringify(schema, null, 2);
			setStringifiedSchema(schemaString);
			setHasError(false);
			setIsDirty(false);
		}
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================

	const renderActionPanel = () => (
		<ActionWrapper>
			{isDirty && (
				<>
					{hasError ? (
						<AlertWrapper type="error" showIcon>
							Unable to save changes because there’s a syntax error. Amend the error or{" "}
							<RefreshButton type="button" styleType="link" onClick={handleReset}>
								refresh to sync with the form builder.
							</RefreshButton>
						</AlertWrapper>
					) : (
						<AlertWrapper type="warning" showIcon>
							To reflect changes on preview, save changes first.
						</AlertWrapper>
					)}
				</>
			)}
			<SaveButton onClick={onSubmit}>{isDirty ? "Save Changes" : "Saved"}</SaveButton>
		</ActionWrapper>
	);

	return (
		<>
			<V2_Text.H2>Generate Schema</V2_Text.H2>
			{renderActionPanel()}
			<SchemaEditorWrapper>
				<SchemaEditor value={stringifiedSchema} onChange={handleSchemaChange} />
			</SchemaEditorWrapper>
		</>
	);
};
