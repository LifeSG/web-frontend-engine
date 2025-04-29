import { TextList } from "@lifesg/react-design-system/text-list";
import { TypographySizeType } from "@lifesg/react-design-system/theme/font/types";
import { V2_TextSizeType } from "@lifesg/react-design-system/v2_text/types";
import { TestHelper } from "../../../utils";
import { Sanitize } from "../../shared";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { SIZE_MAPPING } from "./data";
import { IOrderedListSchema, IUnorderedListSchema, IV2OrderedListSchema, IV2UnorderedListSchema } from "./types";

export const List = (
	props: IGenericElementProps<
		IUnorderedListSchema | IOrderedListSchema | IV2UnorderedListSchema | IV2OrderedListSchema
	>
) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { children, uiType, size, ...otherSchema },
	} = props;

	const Element = uiType === "ordered-list" ? TextList.Ol : TextList.Ul;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================

	const isV2TextSizeType = (size: TypographySizeType | V2_TextSizeType): size is V2_TextSizeType =>
		size in SIZE_MAPPING;

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderChildren = (): JSX.Element[] | JSX.Element => {
		return children.map((childSchema, index) => {
			if (typeof childSchema === "string") {
				return (
					<li key={index}>
						<Sanitize inline>{childSchema}</Sanitize>
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
			size={isV2TextSizeType(size) ? SIZE_MAPPING[size] : size}
			{...otherSchema}
		>
			{renderChildren()}
		</Element>
	);
};
