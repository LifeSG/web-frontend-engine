import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import { useCallback, useContext } from "react";
import { IFrontendEngineData } from "../../components";
import { FormSchemaContext } from "../../context-providers";
import { ObjectHelper } from "../object-helper";

export const useFormSchema = () => {
	const { setFormSchema, formSchema } = useContext(FormSchemaContext);

	const overrideSchema = useCallback(<T>(children: T, overrides: IFrontendEngineData["overrides"]): T => {
		if (isEmpty(overrides) || typeof children === "string") return children;

		let filteredOverrides = {};
		Object.keys(children).forEach((childId) => {
			const overrideEntry = ObjectHelper.getNestedValueByKey(overrides, childId, {
				searchIn: ["children"],
			});
			if (!isEmpty(overrideEntry)) {
				filteredOverrides = { ...filteredOverrides, ...overrideEntry };
			}
		});

		if (!isEmpty(filteredOverrides)) {
			const clonedChildren = cloneDeep(children);
			const overriddenChildren = merge(clonedChildren, filteredOverrides);
			const noNil = ObjectHelper.removeNil(overriddenChildren);
			return noNil;
		}

		return children;
	}, []);

	return { setFormSchema, formSchema, overrideSchema };
};
