import { Text as DSText } from "@lifesg/react-design-system/text";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { TestHelper } from "../../../utils";
import { IGenericFieldProps } from "../../frontend-engine";
import { Sanitize } from "../../shared";
import { ITextSchema } from "./types";

export const Text = (props: IGenericFieldProps<ITextSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, fieldType, ...otherSchema },
	} = props;

	const Element = DSText[fieldType] || undefined;
	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getTestId = (id: string): string => {
		return TestHelper.generateId(id, "text");
	};

	const hasNestedFields = (): boolean => {
		const isArrayWithChild = isArray(children) && children.length > 1;
		const isObjectWithChild = isObject(children) && Object.keys(children).length > 1;
		return isArrayWithChild || isObjectWithChild;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderText = (): JSX.Element[] | JSX.Element | string[] | string => {
		if (isArray(children)) {
			return children.map((text, index) => {
				const childrenId = `${id}-${index}`;

				return (
					<Element key={index} id={childrenId} data-testid={getTestId(childrenId)}>
						<Sanitize id={childrenId} content={text} />
					</Element>
				);
			});
		} else if (typeof children === "object") {
			return Object.entries(children).map(([id, childSchema], index) => (
				<Text key={index} id={id} schema={childSchema} />
			));
		}
		return children;
	};

	return (
		<Element
			id={id}
			data-testid={getTestId(id)}
			{...otherSchema}
			// NOTE: Parent text body should be transformed into <div> to prevent validateDOMNesting error
			{...(hasNestedFields() && { as: "div" })}
		>
			<Sanitize id={id} content={renderText()} />
		</Element>
	);
};
