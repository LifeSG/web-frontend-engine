import { BoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@lifesg/react-design-system/button";
import { useFieldEvent } from "../../../utils/hooks";
import { filterSchemaProps } from "../../../utils/prop-helper";
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
	const {
		customSchema: { button, children, title, disableContentInset, ...accordionProps },
	} = filterSchemaProps(schema);

	const { dispatchFieldEvent } = useFieldEvent();

	return (
		<BoxContainer
			id={id}
			title={typeof title === "string" ? title : <Wrapper>{title}</Wrapper>}
			{...accordionProps}
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
				<Container>
					<Wrapper id={id}>{children}</Wrapper>
				</Container>
			)}
		</BoxContainer>
	);
};
