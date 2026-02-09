import { ReactElement } from "react";
import { CustomComponentsProvider } from "./custom-components";
import { EventProvider } from "./event";
import { FormSchemaProvider } from "./form-schema";
import { FormValuesProvider } from "./form-values";
import { FrontendEngineFormProvider } from "./frontend-engine-form";
import { YupProvider } from "./yup";
import { CallbacksProvider, ICallbacks } from "./callback";
interface IProps {
	children: ReactElement;
	callbacks?: ICallbacks;
}

export const ContextProviders = ({ children, callbacks }: IProps) => {
	return (
		<YupProvider>
			<EventProvider>
				<FormSchemaProvider>
					<FormValuesProvider>
						<CustomComponentsProvider>
							<FrontendEngineFormProvider>
								<CallbacksProvider callbacks={callbacks}>{children}</CallbacksProvider>
							</FrontendEngineFormProvider>
						</CustomComponentsProvider>
					</FormValuesProvider>
				</FormSchemaProvider>
			</EventProvider>
		</YupProvider>
	);
};
