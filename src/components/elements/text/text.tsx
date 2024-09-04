import { Button } from "@lifesg/react-design-system/button";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { useEffect, useRef, useState } from "react";
import sanitizeHtml, { IOptions } from "sanitize-html";
import styled from "styled-components";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { TEXT_MAPPING } from "./data";
import { ITextSchema } from "./types";
import { Wrapper } from "../wrapper";

export const Text = (props: IGenericElementProps<ITextSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, uiType, maxLines, ...otherSchema },
	} = props;

	const elementRef = useRef(null);
	const [expanded, setExpanded] = useState(false);
	const [showExpandButton, setShowExpandButton] = useState(false);

	const Element = TEXT_MAPPING[uiType.toUpperCase()] || undefined;

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

	const renderText = (): JSX.Element[] | JSX.Element | string[] | string => {
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
				{...otherSchema}
				// NOTE: Parent text body should be transformed into <div> to prevent validateDOMNesting error
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
