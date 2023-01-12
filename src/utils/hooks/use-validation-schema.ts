import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { ObjectShape } from "yup/lib/object";
import { YupContext, YupHelper } from "../../components/frontend-engine/yup";

/**
 * Hook that handles the generation of the validationSchema
 */
export const useValidationSchema = () => {
	const { formValidationConfig } = useContext(YupContext);
	const [validationSchema, setValidationSchema] = useState<Yup.ObjectSchema<ObjectShape>>();

	useEffect(() => {
		if (formValidationConfig) {
			setValidationSchema(YupHelper.buildSchema(formValidationConfig));
		}
	}, [formValidationConfig]);

	return validationSchema;
};
