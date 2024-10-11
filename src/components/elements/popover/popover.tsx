import { PopoverInline } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { IPopoverSchema } from "./types";

export const Popover = (props: IGenericElementProps<IPopoverSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: {
			children,
			className,
			icon,
			hint: { content: hintContent, ...hintProps },
			...otherSchema
		},
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = () => {
		if (!icon) return null;

		const Element = Icons[icon];
		return <Element />;
	};

	return (
		<PopoverInline
			id={id}
			data-testid={TestHelper.generateId(id, "popover")}
			className={className}
			icon={renderIcon()}
			content={children && <Sanitize inline>{children}</Sanitize>}
			popoverContent={<Sanitize inline>{hintContent}</Sanitize>}
			{...hintProps}
			{...otherSchema}
		/>
	);
};
