import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { IListItemSchema } from "./types";

export const ListItem = (props: IGenericElementProps<IListItemSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, uiType: _uiType, showIf: _showIf, columns: _columns, ...otherSchema },
	} = props;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderText = (): React.JSX.Element[] | React.JSX.Element => {
		if (typeof children === "string") {
			return <Sanitize inline>{children}</Sanitize>;
		}
		return <Wrapper>{children}</Wrapper>;
	};

	return (
		<li id={id} {...otherSchema}>
			{renderText()}
		</li>
	);
};
