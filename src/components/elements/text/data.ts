import { Typography } from "@lifesg/react-design-system/typography";
import { TTextType } from "./types";

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
