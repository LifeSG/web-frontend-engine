import { useContext } from "react";
import { FormSchemaContext } from "../../components/frontend-engine/form-schema";

export const useFormSchema = () => {
	const { setFormSchema, formSchema } = useContext(FormSchemaContext);

	return { setFormSchema, formSchema };
};
