import { Typography } from "@lifesg/react-design-system/typography";

export const TYPOGRAPHY_MAPPING = {
	"HEADING-XXL": Typography.HeadingXXL,
	"HEADING-XL": Typography.HeadingXL,
	"HEADING-LG": Typography.HeadingLG,
	"HEADING-MD": Typography.HeadingMD,
	"HEADING-SM": Typography.HeadingSM,
	"HEADING-XS": Typography.HeadingXS,
	"BODY-BL": Typography.BodyBL,
	"BODY-MD": Typography.BodyMD,
	"BODY-SM": Typography.BodySM,
	"BODY-XS": Typography.BodyXS,
};

import { TypographyWeight } from "@lifesg/react-design-system/typography/types";

export const WEIGHT_MAPPING: Record<number, TypographyWeight> = {
	300: "light",
	400: "regular",
	500: "semibold",
	700: "bold",
	900: "bold",
};
