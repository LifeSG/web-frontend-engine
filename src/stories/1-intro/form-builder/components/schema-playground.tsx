import { Button } from "@lifesg/react-design-system/button";
import { ThemeProvider } from "@lifesg/react-design-system/theme";
import { Unstyled } from "@storybook/addon-docs/blocks";
import { useState } from "react";
import { IFrontendEngineData } from "../../../../components";
import { FrontendEngine } from "../../../common";
import { ErrorBoundary } from "./error-boundary";
import * as styles from "./schema-playground.styles";

const SAMPLE_SCHEMA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				name: {
					uiType: "text-field",
					label: "Name",
				},
				fruit: {
					uiType: "select",
					label: "Favourite fruit",
					options: [
						{ label: "Apple", value: "apple" },
						{ label: "Banana", value: "banana" },
						{ label: "Cherry", value: "cherry" },
					],
				},
				agree: {
					uiType: "checkbox",
					label: "Preferences",
					options: [
						{ label: "Subscribe to newsletter", value: "newsletter" },
						{ label: "I agree to the terms", value: "terms" },
					],
				},
				submit: {
					uiType: "submit",
					label: "Submit",
				},
			},
		},
	},
};

export const SchemaPlayground = () => {
	const [schemaText, setSchemaText] = useState(JSON.stringify(SAMPLE_SCHEMA, null, 2));
	const [parsedData, setParsedData] = useState<IFrontendEngineData>(SAMPLE_SCHEMA);
	const [parseError, setParseError] = useState<string | null>(null);
	const [renderKey, setRenderKey] = useState(0);

	const handleRender = () => {
		try {
			const data = JSON.parse(schemaText) as IFrontendEngineData;
			setParsedData(data);
			setParseError(null);
			setRenderKey((k) => k + 1);
		} catch (e) {
			setParseError((e as Error).message);
		}
	};

	return (
		<ThemeProvider theme="lifesg" mode="light">
			<Unstyled>
				<div className={styles.wrapper}>
					<div className={styles.editorPanel}>
						<textarea
							className={styles.textarea}
							value={schemaText}
							onChange={(e) => setSchemaText(e.target.value)}
							spellCheck={false}
						/>
						<Button styleType="secondary" onClick={handleRender}>
							Render
						</Button>
					</div>
					<div className={styles.previewPanel}>
						{parseError ? (
							<pre className={styles.parseError}>{parseError}</pre>
						) : (
							<ErrorBoundary key={renderKey}>
								<FrontendEngine data={parsedData} />
							</ErrorBoundary>
						)}
					</div>
				</div>
			</Unstyled>
		</ThemeProvider>
	);
};
