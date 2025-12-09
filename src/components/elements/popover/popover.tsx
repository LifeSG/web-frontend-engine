import { PopoverInline } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { IPopoverSchema, PopoverHintType } from "./types";

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
			hint: { content: hintContent, type: hintContentType, ...hintProps },
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

	const renderPopoverContent = () => {
		switch (hintContentType) {
			case PopoverHintType.IMAGE:
				return <img src={hintContent as string} alt="popover content" />;
			case PopoverHintType.COMPONENT:
				return hintContent as React.ReactElement;
			default:
				return <Sanitize inline>{hintContent as string}</Sanitize>;
		}
	};

	return (
		<PopoverInline
			id={id}
			data-testid={TestHelper.generateId(id, "popover")}
			className={className}
			icon={renderIcon()}
			content={children && <Sanitize inline>{children}</Sanitize>}
			popoverContent={renderPopoverContent()}
			{...hintProps}
			{...otherSchema}
		/>
	);
};
