import { BoxContainer, Button, Layout } from "@lifesg/react-design-system";
import { useFieldEvent } from "../../../utils/hooks";
import { Wrapper } from "../wrapper";
import { IAccordionProps } from "./types";
import { Container } from "./accordion.styles";

/**
 * this component is meant to render fields that are nested in a box / accordion
 */
export const Accordion = (props: IAccordionProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { schema, id } = props;
	const { children, button, title, ...otherProps } = schema;

	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderAccordion = () => {
		return (
			<BoxContainer
				id={id}
				title={title}
				{...otherProps}
				callToActionComponent={
					button === false ? undefined : (
						<Button.Default styleType="light" type="button" onClick={() => dispatchFieldEvent("edit", id)}>
							{button?.label ?? "Edit"}
						</Button.Default>
					)
				}
			>
				<Layout.Content>
					<Container>
						<Wrapper id={id}>{children}</Wrapper>
					</Container>
				</Layout.Content>
			</BoxContainer>
		);
	};

	return <>{renderAccordion()}</>;
};
