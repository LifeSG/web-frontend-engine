import { Typography } from "@lifesg/react-design-system/typography";
import { TTextType } from "./types";

export const TEXT_MAPPING = {
	"TEXT-D1": { type: Typography.HeadingXXL, weight: "bold" },
	"TEXT-D2": { type: Typography.HeadingXL, weight: "bold" },
	"TEXT-D3": { type: Typography.HeadingMD, weight: "bold" },
	"TEXT-D4": { type: Typography.HeadingSM, weight: "bold" },
	"TEXT-DBODY": { type: Typography.HeadingSM, weight: "light" },
	"TEXT-H1": { type: Typography.HeadingLG, weight: "bold" },
	"TEXT-H2": { type: Typography.HeadingMD, weight: "bold" },
	"TEXT-H3": { type: Typography.HeadingSM, weight: "bold" },
	"TEXT-H4": { type: Typography.HeadingXS, weight: "bold" },
	"TEXT-H5": { type: Typography.BodyMD, weight: "bold" },
	"TEXT-H6": { type: Typography.BodySM, weight: "bold" },
	"TEXT-BODY": { type: Typography.BodyBL, weight: "regular" },
	"TEXT-BODYSMALL": { type: Typography.BodyMD, weight: "regular" },
	"TEXT-XSMALL": { type: Typography.BodyXS, weight: "regular" },
};

export const TYPOGRAPHY_MAPPING = {
	"HEADING-XXL": Typography.HeadingXXL,
	"HEADING-XL": Typography.HeadingXL,
	"HEADING-MD": Typography.HeadingMD,
	"HEADING-SM": Typography.HeadingSM,
	"HEADING-LG": Typography.HeadingLG,
	"HEADING-XS": Typography.HeadingXS,
	"BODY-MD": Typography.BodyMD,
	"BODY-SM": Typography.BodySM,
	"BODY-BL": Typography.BodyBL,
	"BODY-XS": Typography.BodyXS,
};

export const WEIGHT_MAPPING: Record<number, string> = {
	300: "light",
	400: "regular",
	500: "medium",
	700: "bold",
	900: "bold",
};
export const TAG_MAPPING: Record<TTextType, string> = {
	"text-d1": "h1",
	"text-d2": "h1",
	"text-dbody": "h1",
	"text-h1": "h1",
	"text-h2": "h2",
	"text-h3": "h3",
	"text-h4": "h4",
	"text-h5": "h5",
	"text-h6": "h6",
	"text-body": "p",
	"text-bodysmall": "p",
	"text-xsmall": "p",
};
