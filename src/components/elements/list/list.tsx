import { TextList as DSTextList } from "@lifesg/react-design-system/text-list";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { IOrderedListSchema, IUnorderedListSchema } from "./types";

export const List = (props: IGenericElementProps<IUnorderedListSchema | IOrderedListSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, uiType, ...otherSchema },
	} = props;

	const Element = uiType === "ordered-list" ? DSTextList.Ol : DSTextList.Ul;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderText = (): JSX.Element[] | JSX.Element => {
		return children.map((childSchema, index) => {
			if (typeof childSchema === "string") {
				return (
					<li key={index}>
						<Sanitize>{childSchema}</Sanitize>
					</li>
				);
			}
			return <Wrapper key={index}>{childSchema}</Wrapper>;
		});
	};

	return (
		<Element
			{...{ id }} // pass id prop without Typescript error
			data-testid={TestHelper.generateId(id, uiType)}
			{...otherSchema}
		>
			{renderText()}
		</Element>
	);
};
