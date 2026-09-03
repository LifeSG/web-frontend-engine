import { Typography } from "@lifesg/react-design-system/typography";
import { Alert } from "@lifesg/react-design-system/alert";
import { Button } from "@lifesg/react-design-system/button";
import { Textarea } from "@lifesg/react-design-system/input-textarea";
import clsx from "clsx";
import { IFormBuilderMethods } from "@lifesg/web-form-builder";
import { ISchemaProps } from "@lifesg/web-form-builder/translator";
import { useEffect, useState } from "react";
import { IFrontendEngineData } from "../../../../components";
import * as styles from "./form-builder-tool.styles";

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
		<div className={styles.actionWrapper}>
			{isDirty && (
				<>
					{hasError ? (
						<Alert className={styles.alertWrapper} type="error" showIcon>
							Unable to save changes because there’s a syntax error. Amend the error or{" "}
							<Button
								className={styles.refreshButton}
								type="button"
								sizeType="small"
								styleType="link"
								onClick={handleReset}
							>
								refresh to sync with the form builder.
							</Button>
						</Alert>
					) : (
						<Alert className={styles.alertWrapper} type="warning" showIcon>
							To reflect changes on preview, save changes first.
						</Alert>
					)}
				</>
			)}
			<Button className={clsx(styles.saveButton)} onClick={onSubmit}>
				{isDirty ? "Save Changes" : "Saved"}
			</Button>
		</div>
	);

	return (
		<>
			<Typography.HeadingMD weight="bold">Generate Schema</Typography.HeadingMD>
			{renderActionPanel()}
			<div className={styles.schemaEditorWrapper}>
				<Textarea className={styles.schemaEditor} value={stringifiedSchema} onChange={handleSchemaChange} />
			</div>
		</>
	);
};
