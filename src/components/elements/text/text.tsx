import { Button } from "@lifesg/react-design-system/button";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { useEffect, useRef, useState } from "react";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { TEXT_MAPPING } from "./data";
import { ITextSchema } from "./types";

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
	const [showExpandButton, setShowExpandButton] = useState(true);

	const Element = TEXT_MAPPING[uiType.toUpperCase()] || undefined;

	// =============================================================================
	// EFFECTS / CALLBACKS
	// =============================================================================
	useEffect(() => {
		// expanded: true, text expanded, and view less button display, false: text collaspible, and view more button display
		setExpanded(!maxLines);
		// by default, show the view more/less button if maxLines configured
		setShowExpandButton(maxLines > 0);

		if (!maxLines || !elementRef.current) return;

		// calculate whether to show more after line-clamp is triggered
		const clientHeight = elementRef.current.clientHeight;
		const scrollHeight = elementRef.current.scrollHeight;

		// Note: the calculated scrollHeight and clientHeight differs by 1 without any overflow
		// setHideButton(!(scrollHeight - clientHeight > 1));
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
	const renderText = (): JSX.Element[] | JSX.Element | string[] | string => {
		if (isArray(children)) {
			return children.map((text, index) => {
				const childrenId = `${id}-${index}`;

				return (
					<Element key={index} id={childrenId} data-testid={getTestId(childrenId)}>
						<Sanitize id={childrenId}>{text}</Sanitize>
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
		<>
			<Element
				id={id}
				ref={elementRef}
				maxLines={maxLines > 0 && !expanded ? maxLines : undefined}
				data-testid={getTestId(id)}
				{...otherSchema}
				// NOTE: Parent text body should be transformed into <div> to prevent validateDOMNesting error
				{...(hasNestedFields() && { as: "div" })}
			>
				<Sanitize id={id}>{renderText()}</Sanitize>
			</Element>

			{showExpandButton && maxLines > 0 && (
				<Button.Small styleType="link" style={{ padding: "0" }} onClick={() => setExpanded(!expanded)}>
					{expanded ? "View less" : "View more"}
				</Button.Small>
			)}
		</>
	);
};
