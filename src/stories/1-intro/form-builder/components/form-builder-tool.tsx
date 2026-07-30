import { Typography } from "@lifesg/react-design-system/typography";
import { EyeIcon } from "@lifesg/react-icons/eye";
import { PencilIcon } from "@lifesg/react-icons/pencil";
import { TabletIcon } from "@lifesg/react-icons/tablet";
import { FormBuilder, IFormBuilderMethods } from "@lifesg/web-form-builder";
import { ISchemaProps } from "@lifesg/web-form-builder/translator";
import { Unstyled } from "@storybook/addon-docs/blocks";
import clsx from "clsx";
import { useRef, useState } from "react";
import * as styles from "./form-builder-tool.styles";
import { SchemaView } from "./schema-view";
import { IFrontendEngineData } from "../../../../components";
import { FrontendEngine } from "../../../common";
import { ThemeProvider } from "@lifesg/react-design-system/theme";

export type TFormBuilderMode = "form-builder" | "preview" | "schema";

export const FormBuilderTool = () => {
	// =========================================================================
	// CONST, STATE, REFS
	// =========================================================================
	const formBuilderRef = useRef<IFormBuilderMethods>(null);
	const [formBuilderMode, setFormBuilderMode] = useState<TFormBuilderMode>("form-builder");
	const [formBuilderOutput, setFormBuilderOutput] = useState<ISchemaProps | null>(null);
	// // =========================================================================
	// // EVENT HANDLERS
	// // =========================================================================
	const handleClickToolbarButton = (mode: TFormBuilderMode) => {
		switch (mode) {
			case "form-builder":
				if (formBuilderRef.current && formBuilderOutput) {
					formBuilderRef.current.parseSchema(formBuilderOutput);
				}
				break;
			case "preview":
				if (formBuilderMode === "form-builder") {
					const generatedSchema = formBuilderRef.current.generateSchema();
					console.log(generatedSchema);
					setFormBuilderOutput(generatedSchema);
				} else if (formBuilderMode === "schema") {
					formBuilderRef.current.parseSchema(formBuilderOutput);
				}
				break;
			case "schema": {
				setFormBuilderOutput(formBuilderRef.current.generateSchema());
				break;
			}
		}
		setFormBuilderMode(mode);
	};
	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	const getContentWrapperClassName = (hidden?: boolean, flexbox?: boolean) =>
		clsx(styles.contentWrapper, hidden && styles.contentWrapperHidden, flexbox && styles.contentWrapperFlexbox);

	const renderToolbar = () => (
		<div className={styles.toolbar}>
			<button
				className={clsx(styles.modeButton, formBuilderMode === "form-builder" && styles.modeButtonActive)}
				onClick={() => handleClickToolbarButton("form-builder")}
				type="button"
			>
				<PencilIcon />
			</button>
			<button
				className={clsx(styles.modeButton, formBuilderMode === "preview" && styles.modeButtonActive)}
				onClick={() => handleClickToolbarButton("preview")}
				type="button"
			>
				<EyeIcon />
			</button>
			<button
				className={clsx(styles.modeButton, formBuilderMode === "schema" && styles.modeButtonActive)}
				onClick={() => handleClickToolbarButton("schema")}
				type="button"
			>
				<TabletIcon />
			</button>
		</div>
	);

	const renderPreview = () => {
		if (formBuilderMode !== "preview") return;
		return (
			<div className={getContentWrapperClassName(false, true)}>
				<Typography.HeadingMD weight="bold">Generate Form</Typography.HeadingMD>
				{formBuilderOutput && (
					<FrontendEngine
						className={styles.frontendEnginePreview}
						data={formBuilderOutput.schema as IFrontendEngineData}
					/>
				)}
			</div>
		);
	};

	const renderSchemaPreview = () => {
		if (formBuilderMode !== "schema") return;
		return (
			<div className={getContentWrapperClassName(false, true)}>
				<SchemaView
					schema={formBuilderOutput.schema as IFrontendEngineData}
					onChange={setFormBuilderOutput}
					formBuilderRef={formBuilderRef}
				/>
			</div>
		);
	};

	return (
		<ThemeProvider theme="lifesg" mode="light">
			<Unstyled>
				<div className={styles.wrapper}>
					{renderToolbar()}
					<div className={getContentWrapperClassName(formBuilderMode !== "form-builder")}>
						<FormBuilder
							ref={formBuilderRef}
							offset={5.1}
							config={{
								attributes: { prefill: { shouldShow: false } },
								panels: { pages: { shouldShow: false } },
							}}
						/>
					</div>
					{renderPreview()}
					{renderSchemaPreview()}
				</div>
			</Unstyled>
		</ThemeProvider>
	);
};
