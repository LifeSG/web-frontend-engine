import { ReactElement } from "react";
import { EventProvider } from "./event";
import { FormSchemaProvider } from "./form-schema";
import { FormValuesProvider } from "./form-values";
import { YupProvider } from "./yup";

interface IProps {
	children: ReactElement;
}

export const ContextProviders = ({ children }: IProps) => {
	return (
		<YupProvider>
			<EventProvider>
				<FormSchemaProvider>
					<FormValuesProvider>{children}</FormValuesProvider>
				</FormSchemaProvider>
			</EventProvider>
		</YupProvider>
	);
};
