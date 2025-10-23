import { Button } from "@lifesg/react-design-system/button";
import isArray from "lodash/isArray";
import isNumber from "lodash/isNumber";
import isObject from "lodash/isObject";
import { useEffect, useRef, useState } from "react";
import sanitizeHtml, { IOptions } from "sanitize-html";
import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { TAG_MAPPING, TEXT_MAPPING, TYPOGRAPHY_MAPPING, WEIGHT_MAPPING } from "./data";
import { ITextSchema, ITypographySchema } from "./types";

export const Text = (props: IGenericElementProps<ITextSchema | ITypographySchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, uiType, maxLines, weight, ...otherSchema },
	} = props;

	const elementRef = useRef(null);
	const [expanded, setExpanded] = useState(false);
	const [showExpandButton, setShowExpandButton] = useState(false);

	const Element = TEXT_MAPPING[uiType.toUpperCase()]?.type || TYPOGRAPHY_MAPPING[uiType.toUpperCase()] || undefined;
	const Tag = TAG_MAPPING[uiType] || undefined;

	// =============================================================================
	// EFFECTS / CALLBACKS
	// =============================================================================
	/**
	 * control whether to render "View more" button and whether to expand / condense on click
	 */
	useEffect(() => {
		setExpanded(!maxLines);
		setShowExpandButton(maxLines > 0);

		if (!maxLines || !elementRef.current) return;

		const clientHeight = elementRef.current.clientHeight;
		const scrollHeight = elementRef.current.scrollHeight;
		setShowExpandButton(scrollHeight - clientHeight > 1);
	}, [children, maxLines]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const getTestId = (id: string): string => {
		return TestHelper.generateId(id, "text");
	};

	const getWeight = () => {
		if (weight) {
			return isNumber(weight) ? WEIGHT_MAPPING[weight] : weight;
		} else if (uiType.toUpperCase() in TEXT_MAPPING) {
			return TEXT_MAPPING[uiType.toUpperCase()].weight;
		}
	};

	const hasNestedFields = (): boolean => {
		const isArrayWithChild = isArray(children) && children.length > 1;
		const isObjectWithChild = isObject(children) && Object.keys(children).length > 1;
		return isArrayWithChild || isObjectWithChild;
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const sanitizeOptions: IOptions = {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
		allowedAttributes: false,
	};

	const renderText = (): React.JSX.Element[] | React.JSX.Element | string[] | string => {
		if (isArray(children)) {
			return children.map((text, index) => {
				const childrenId = `${id}-${index}`;

				return (
					<Element key={index} id={childrenId} data-testid={getTestId(childrenId)}>
						<Sanitize id={childrenId} inline sanitizeOptions={sanitizeOptions}>
							{text}
						</Sanitize>
					</Element>
				);
			});
		} else if (typeof children === "object") {
			return <Wrapper>{children}</Wrapper>;
		}
		return (
			<Sanitize inline sanitizeOptions={sanitizeOptions}>
				{children}
			</Sanitize>
		);
	};

	return (
		<>
			<Element
				id={id}
				ref={elementRef}
				maxLines={!expanded ? maxLines : undefined}
				data-testid={getTestId(id)}
				weight={getWeight()}
				{...otherSchema}
				// NOTE: Parent text body should be transformed into <div> to prevent validateDOMNesting error
				{...(Tag && !hasNestedFields() && { as: Tag })}
				{...(hasNestedFields() && { as: "div" })}
			>
				{renderText()}
			</Element>

			{showExpandButton && (
				<PlainButton styleType="link" onClick={() => setExpanded(!expanded)}>
					{expanded ? "View less" : "View more"}
				</PlainButton>
			)}
		</>
	);
};

const PlainButton = styled(Button.Small)`
	padding: 0;
`;
