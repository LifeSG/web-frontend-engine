import { Dispatch, ReactElement, SetStateAction, createContext, useState } from "react";
import { IFrontendEngineData } from "../../components/frontend-engine/types";

interface IFormSchemaContext {
	formSchema: IFrontendEngineData;
	setFormSchema: Dispatch<SetStateAction<IFrontendEngineData>>;
}

interface IProps {
	children: ReactElement;
}

export const FormSchemaContext = createContext<IFormSchemaContext>({
	formSchema: null,
	setFormSchema: null,
});

export const FormSchemaProvider = ({ children }: IProps) => {
	const [formSchema, setFormSchema] = useState<IFrontendEngineData>({ sections: {} });

	return <FormSchemaContext.Provider value={{ formSchema, setFormSchema }}>{children}</FormSchemaContext.Provider>;
};
