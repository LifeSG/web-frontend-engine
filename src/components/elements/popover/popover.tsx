import { PopoverInline } from "@lifesg/react-design-system/popover-v2";
import * as Icons from "@lifesg/react-icons";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { IPopoverSchema } from "./types";
import sanitizeHtml, { IOptions } from "sanitize-html";

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

	const renderPopoverContent = () => {
		const sanitizeOptions: IOptions = {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			allowedAttributes: false,
		};
		if (typeof hintContent === "string") {
			return (
				<Sanitize inline sanitizeOptions={sanitizeOptions}>
					{hintContent}
				</Sanitize>
			);
		}
		return <Wrapper>{hintContent}</Wrapper>;
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
