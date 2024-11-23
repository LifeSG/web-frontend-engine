import { Text } from "@lifesg/react-design-system/text";
import { EyeIcon } from "@lifesg/react-icons/eye";
import { PencilIcon } from "@lifesg/react-icons/pencil";
import { TabletIcon } from "@lifesg/react-icons/tablet";
import { FormBuilder, IFormBuilderMethods } from "@lifesg/web-form-builder";
import { ISchemaProps } from "@lifesg/web-form-builder/translator";
import { Unstyled } from "@storybook/blocks";
import { useRef, useState } from "react";
import { ContentWrapper, FrontendEnginePreview, ModeButton, Toolbar, Wrapper } from "./form-builder-tool.styles";
import { SchemaView } from "./schema-view";

export type TFormBuilderMode = "form-builder" | "preview" | "schema";

export const FormBuilderTool = () => {
	// =========================================================================
	// CONST, STATE, REFS
	// =========================================================================
	const formBuilderRef = useRef<IFormBuilderMethods>(null);
	const [formBuilderMode, setFormBuilderMode] = useState<TFormBuilderMode>("form-builder");
	const [formBuilderOutput, setFormBuilderOutput] = useState<ISchemaProps | null>(null);

	// =========================================================================
	// EVENT HANDLERS
	// =========================================================================
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
	const renderToolbar = () => (
		<Toolbar>
			<ModeButton
				$active={formBuilderMode === "form-builder"}
				onClick={() => handleClickToolbarButton("form-builder")}
				type="button"
			>
				<PencilIcon />
			</ModeButton>
			<ModeButton
				$active={formBuilderMode === "preview"}
				onClick={() => handleClickToolbarButton("preview")}
				type="button"
			>
				<EyeIcon />
			</ModeButton>
			<ModeButton
				$active={formBuilderMode === "schema"}
				onClick={() => handleClickToolbarButton("schema")}
				type="button"
			>
				<TabletIcon />
			</ModeButton>
		</Toolbar>
	);

	const renderPreview = () => {
		if (formBuilderMode !== "preview") return;
		return (
			<ContentWrapper $flexbox={true}>
				<Text.H2>Generate Form</Text.H2>
				{formBuilderOutput && <FrontendEnginePreview data={formBuilderOutput.schema} />}
			</ContentWrapper>
		);
	};

	const renderSchemaPreview = () => {
		if (formBuilderMode !== "schema") return;
		return (
			<ContentWrapper $flexbox={true}>
				<SchemaView
					schema={formBuilderOutput.schema}
					onChange={setFormBuilderOutput}
					formBuilderRef={formBuilderRef}
				/>
			</ContentWrapper>
		);
	};

	return (
		<Unstyled>
			<Wrapper>
				{renderToolbar()}
				<ContentWrapper $hidden={formBuilderMode !== "form-builder"}>
					<FormBuilder
						ref={formBuilderRef}
						offset={5.1}
						config={{
							attributes: { prefill: { shouldShow: false } },
							panels: { pages: { shouldShow: false } },
						}}
					/>
				</ContentWrapper>
				{renderPreview()}
				{renderSchemaPreview()}
			</Wrapper>
		</Unstyled>
	);
};
