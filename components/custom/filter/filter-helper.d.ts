import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";
import { IFilterItemLabel } from "./types";
export declare namespace FilterHelper {
    const constructFormattedLabel: (label: string | IFilterItemLabel, id: string) => {
        title: string;
        addon?: FormLabelAddonProps;
    };
}
