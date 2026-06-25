import { Alert } from "@lifesg/react-design-system/alert";
import clsx from "clsx";
import { TestHelper } from "../../../utils";
import * as styles from "./warning.styles";

export interface IWarningProps {
	className?: string | undefined;
	id: string;
	message?: string | undefined;
}

export const Warning = ({ id, message, className }: IWarningProps) => {
	if (!message) return null;

	return (
		<Alert
			type="warning"
			data-testid={TestHelper.generateId(id, "warning")}
			className={clsx(styles.warningAlert, className)}
		>
			{message}
		</Alert>
	);
};
