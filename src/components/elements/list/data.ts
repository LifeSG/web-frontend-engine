import { TypographySizeType } from "@lifesg/react-design-system/theme/font/types";
import { V2_TextSizeType } from "@lifesg/react-design-system/v2_text/types";

export const SIZE_MAPPING: Record<V2_TextSizeType, TypographySizeType> = {
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

const V2_TEXT_SIZE_TYPES: readonly V2_TextSizeType[] = [
	"D1",
	"D2",
	"D3",
	"D4",
	"DBody",
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6",
	"Body",
	"BodySmall",
	"XSmall",
];

export const V2_TEXT_SIZE_SET = new Set<string>(V2_TEXT_SIZE_TYPES);
