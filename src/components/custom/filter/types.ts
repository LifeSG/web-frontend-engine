import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";
import { TElementSchema } from "../../elements";

interface IPopoverHint extends Pick<FormLabelAddonProps, "zIndex"> {
	content: string | Record<string, TElementSchema>;
}

export interface IFilterItemLabel {
	mainLabel: string;
	hint?: IPopoverHint | undefined;
}
