import { Text } from "@lifesg/react-design-system/text";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { Sanitize } from "../../shared";
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
		const isArrayWithChild = isArray(children) && children.length > 1;
		const isObjectWithChild = isObject(children) && Object.keys(children).length > 1;
		return isArrayWithChild || isObjectWithChild;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderTextBody = (): JSX.Element[] | JSX.Element | string[] | string => {
		if (isArray(children)) {
			return children.map((text, index) => {
				const childrenId = `${id}-${index}`;

				return (
					<Text.Body key={index} id={childrenId} data-testid={getTestId(childrenId)}>
						<Sanitize id={childrenId} content={text} />
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
			<Sanitize id={id} content={renderTextBody()} />
		</Text.Body>
	);
};
