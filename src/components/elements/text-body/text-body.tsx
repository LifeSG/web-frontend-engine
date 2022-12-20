import { Text } from "@lifesg/react-design-system/text";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { ITextbodySchema } from "./types";

export const TextBody = (props: IGenericFieldProps<ITextbodySchema>) => {
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

	const hasNestedFields = (): boolean => {
		return typeof children !== "string";
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderTextBody = (): JSX.Element[] | string[] | string => {
		if (Array.isArray(children)) {
			return children.map((text, index) => {
				const childrenId = `${id}-${index}`;

				return (
					<Text.Body key={index} id={childrenId} data-testid={getTestId(childrenId)}>
						{text}
					</Text.Body>
				);
			});
		} else if (typeof children === "object") {
			return Object.entries(children).map(([id, childSchema], index) => (
				<TextBody key={index} id={id} schema={childSchema} />
			));
		}
		return children;
	};

	return (
		<Text.Body
			id={id}
			data-testid={getTestId(id)}
			{...otherSchema}
			// NOTE: Parent text body should be transformed into <div> to prevent validateDOMNesting error
			{...(hasNestedFields() && { as: "div" })}
		>
			{renderTextBody()}
		</Text.Body>
	);
};
