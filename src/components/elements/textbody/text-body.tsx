import { Text } from "@lifesg/react-design-system/text";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { ITextBodySchema } from "./types";

export const TextBody = (props: IGenericFieldProps<ITextBodySchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, ...otherSchema },
	} = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getTestId = (id: string): string => {
		return TestHelper.generateId(id, "textbody");
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderTextBody = (): JSX.Element[] | string[] | string => {
		if (Array.isArray(children)) {
			return children.map((text, index) => (
				<Text.Body key={index} id={id} data-testid={getTestId(id)}>
					{text}
				</Text.Body>
			));
		} else if (typeof children === "object") {
			return Object.entries(children).map(([id, childSchema], index) => {
				return <TextBody key={index} id={id} data-testid={getTestId(id)} schema={childSchema} />;
			});
		}
		return children;
	};

	return (
		<Text.Body id={id} data-testid={getTestId(id)} {...otherSchema} as="div">
			{renderTextBody()}
		</Text.Body>
	);
};
