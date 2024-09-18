import { Alert } from "@lifesg/react-design-system/alert";
import styled from "styled-components";
import { TestHelper } from "../../../utils";

export interface IWarningProps {
	className?: string | undefined;
	id: string;
	message?: string | undefined;
}

export const Warning = ({ id, message, className }: IWarningProps) => {
	if (!message) return null;

	return (
		<DSAlert type="warning" data-testid={TestHelper.generateId(id, "warning")} className={className}>
			{message}
		</DSAlert>
	);
};

const DSAlert = styled(Alert)`
	margin: -1rem 0rem 2rem;
`;
