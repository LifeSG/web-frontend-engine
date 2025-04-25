import { Typography } from "@lifesg/react-design-system/typography";

export const TEXT_MAPPING = {
	"TEXT-D1": Typography.HeadingXXL,
	"TEXT-D2": Typography.HeadingXL,
	"TEXT-DBODY": Typography.HeadingSM,
	"TEXT-H1": Typography.HeadingLG,
	"TEXT-H2": Typography.HeadingMD,
	"TEXT-H3": Typography.HeadingSM,
	"TEXT-H4": Typography.HeadingXS,
	"TEXT-H5": Typography.BodyMD,
	"TEXT-H6": Typography.BodySM,
	"TEXT-BODY": Typography.BodyBL,
	"TEXT-BODYSMALL": Typography.BodyMD,
	"TEXT-XSMALL": Typography.BodyXS,
};

export const WEIGHT_MAPPING: Record<number, string> = {
	300: "light",
	400: "regular",
	500: "medium",
	700: "bold",
	900: "bold",
};
