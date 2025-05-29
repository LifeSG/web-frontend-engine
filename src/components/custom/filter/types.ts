import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";

interface IPopoverHint extends Pick<FormLabelAddonProps, "content" | "zIndex"> {}

export interface IFilterItemLabel {
	mainLabel: string;
	hint?: IPopoverHint | undefined;
}
