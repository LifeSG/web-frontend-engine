import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { TEXT_MAPPING } from "./data";
import { ITextSchema } from "./types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@lifesg/react-design-system";

export const Text = (props: IGenericElementProps<ITextSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, uiType, maxLines, ...otherSchema },
	} = props;

	const contentDivRef = useRef(null);
	const [isMore, setIsMore] = useState<boolean>(false);
	const [hideButton, setHideButton] = useState<boolean>(true);

	const Element = TEXT_MAPPING[uiType.toUpperCase()] || undefined;

	// =============================================================================
	// EFFECTS / CALLBACKS
	// =============================================================================
	useEffect(() => {
		// isMore: true, text expanded, and view less button display, false: text collaspible, and view more button display
		setIsMore(!maxLines);
		// hide the view more/less button
		setHideButton(!maxLines);

		if (!maxLines || !contentDivRef.current) return;

		// calculate whether to show more after line-clamp is triggered
		const clientHeight = contentDivRef.current.clientHeight;
		const scrollHeight = contentDivRef.current.scrollHeight;

		// Note: the calculated scrollHeight and clientHeight differs by 1 without any overflow
		// setHideButton(!(scrollHeight - clientHeight > 1));
		setHideButton(!(scrollHeight - clientHeight > 1));
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
				ref={contentDivRef}
				maxLines={maxLines > 0 && !isMore ? maxLines : undefined}
				data-testid={getTestId(id)}
				{...otherSchema}
				// NOTE: Parent text body should be transformed into <div> to prevent validateDOMNesting error
				{...(hasNestedFields() && { as: "div" })}
			>
				<Sanitize id={id}>{renderText()}</Sanitize>
			</Element>

			<div>
				{!hideButton && maxLines > 0 && (
					<Button.Small styleType="link" onClick={() => setIsMore(!isMore)}>
						{isMore ? "View less" : "View more"}
					</Button.Small>
				)}
			</div>
		</>
	);
};
