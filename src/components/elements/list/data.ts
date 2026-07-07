import { UnorderedListProps } from "@lifesg/react-design-system/text-list";
import { V2_TextSizeType } from "@lifesg/react-design-system/v2_text";

export const SIZE_MAPPING: Record<V2_TextSizeType, UnorderedListProps["size"]> = {
	D1: "heading-xxl",
	D2: "heading-xl",
	D3: "heading-md",
	D4: "heading-sm",
	DBody: "heading-sm",
	H1: "heading-lg",
	H2: "heading-md",
	H3: "heading-sm",
	H4: "heading-xs",
	H5: "body-md",
	H6: "body-sm",
	Body: "body-baseline",
	BodySmall: "body-md",
	XSmall: "body-xs",
};
