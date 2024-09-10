import { PopoverTrigger } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { StyledIcon, StyledText } from "./popover.styles";
import { IPopoverSchema } from "./types";

export const Popover = (props: IGenericElementProps<IPopoverSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, className, icon, hint, trigger },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = () => {
		if (!icon) return null;

		const Element = Icons[icon];
		return <StyledIcon as={Element} $standalone={!children} />;
	};

	return (
		<PopoverTrigger
			id={id}
			data-testid={TestHelper.generateId(id, "popover")}
			className={className}
			popoverContent={<Sanitize inline>{hint.content}</Sanitize>}
			trigger={trigger}
			zIndex={hint.zIndex}
		>
			<StyledText>
				<Sanitize inline>{children}</Sanitize>
				{renderIcon()}
			</StyledText>
		</PopoverTrigger>
	);
};
