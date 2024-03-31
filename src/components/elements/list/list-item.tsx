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
	const renderText = (): JSX.Element[] | JSX.Element => {
		if (typeof children === "string") {
			return <Sanitize>{children}</Sanitize>;
		}
		return <Wrapper>{children}</Wrapper>;
	};

	return (
		<li id={id} {...otherSchema}>
			{renderText()}
		</li>
	);
};
