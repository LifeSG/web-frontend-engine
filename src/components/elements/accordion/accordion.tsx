import { BoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@lifesg/react-design-system/button";
import { V2_Layout } from "@lifesg/react-design-system/v2_layout";
import { useFieldEvent } from "../../../utils/hooks";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { Container } from "./accordion.styles";
import { IAccordionSchema } from "./types";

/**
 * this component is meant to render fields that are nested in a box / accordion
 */
export const Accordion = (props: IGenericElementProps<IAccordionSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { schema, id } = props;
	const { children, button, title, disableContentInset, ...otherSchema } = schema;

	const { dispatchFieldEvent } = useFieldEvent();

	return (
		<BoxContainer
			id={id}
			title={typeof title === "string" ? title : <Wrapper>{title}</Wrapper>}
			{...otherSchema}
			callToActionComponent={
				button ? (
					<Button.Default
						styleType="light"
						type="button"
						onClick={() => dispatchFieldEvent("accordion", "edit", id)}
					>
						{typeof button === "object" ? button.label : "Edit"}
					</Button.Default>
				) : undefined
			}
		>
			{disableContentInset ? (
				<Wrapper id={id}>{children}</Wrapper>
			) : (
				<V2_Layout.Content>
					<Container>
						<Wrapper id={id}>{children}</Wrapper>
					</Container>
				</V2_Layout.Content>
			)}
		</BoxContainer>
	);
};
