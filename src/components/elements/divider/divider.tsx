import { useRef } from "react";
import { Divider as DSDivider } from "@lifesg/react-design-system/divider";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { TestHelper, filterSchemaProps } from "../../../utils";
import { IGenericElementProps } from "../types";
import { IDividerSchema } from "./types";
import * as styles from "./divider.styles";
import clsx from "clsx";

export const Divider = (props: IGenericElementProps<IDividerSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const {
		customSchema: { verticalMargin, className, ...dividerProps },
	} = filterSchemaProps(schema);
	const containerRef = useRef<HTMLDivElement>(null);

	useApplyStyle(containerRef, {
		[styles.tokens.container.verticalMargin]: verticalMargin ? `${verticalMargin}rem 0` : undefined,
	});

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<div ref={containerRef} className={clsx(styles.container, className)}>
			<DSDivider id={id} data-testid={TestHelper.generateId(id, "divider")} {...dividerProps} />
		</div>
	);
};
