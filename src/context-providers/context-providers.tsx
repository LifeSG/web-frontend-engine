import { ReactElement } from "react";
import { CustomComponentsProvider } from "./custom-components";
import { EventProvider } from "./event";
import { FormSchemaProvider } from "./form-schema";
import { FormValuesProvider } from "./form-values";
import { FrontendEngineFormProvider } from "./frontend-engine-form";
import { RecaptchaProvider } from "./recaptcha";
import { YupProvider } from "./yup";

interface IProps {
	children: ReactElement;
	recaptchaSiteKey?: string | undefined;
}

export const ContextProviders = ({ children, recaptchaSiteKey }: IProps) => {
	return (
		<RecaptchaProvider recaptchaSiteKey={recaptchaSiteKey}>
			<YupProvider>
				<EventProvider>
					<FormSchemaProvider>
						<FormValuesProvider>
							<CustomComponentsProvider>
								<FrontendEngineFormProvider>{children}</FrontendEngineFormProvider>
							</CustomComponentsProvider>
						</FormValuesProvider>
					</FormSchemaProvider>
				</EventProvider>
			</YupProvider>
		</RecaptchaProvider>
	);
};
