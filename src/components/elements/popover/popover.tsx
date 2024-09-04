import { Color } from "@lifesg/react-design-system/color";
import { PopoverTrigger } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import styled from "styled-components";
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
		schema: { children, className, icon, hint, trigger },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = () => {
		if (!icon) return null;

		const Element = Icons[icon];
		return <StyledIcon as={Element} />;
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

const StyledText = styled.span`
	color: ${Color.Primary};
	font-weight: 600;
`;

const StyledIcon = styled.span`
	height: 1lh; // align vertically
	width: 1em; // scale icon with font size
	margin-left: 0.25rem;
	vertical-align: top;
`;
