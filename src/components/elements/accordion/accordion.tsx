import { BoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@lifesg/react-design-system/button";
import { Layout } from "@lifesg/react-design-system/layout";
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
	const { children, button, useDefaultContentInset = true, title, ...otherSchema } = schema;

	const { dispatchFieldEvent } = useFieldEvent();

	return (
		<BoxContainer
			id={id}
			title={title}
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
			{useDefaultContentInset ? (
				<Layout.Content>
					<Container>
						<Wrapper id={id}>{children}</Wrapper>
					</Container>
				</Layout.Content>
			) : (
				<Wrapper id={id}>{children}</Wrapper>
			)}
		</BoxContainer>
	);
};
