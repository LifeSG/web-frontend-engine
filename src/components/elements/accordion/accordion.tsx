import { BoxContainer, Button } from "@lifesg/react-design-system";
import { useFieldEvent } from "../../../utils/hooks";
import { Wrapper } from "../wrapper";
import { IAccordionProps } from "./types";

/**
 * this component is meant to render fields that are nested in a box / accordion
 */
export const Accordion = (props: IAccordionProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { schema, id } = props;
	const { children, buttonLabel, title, ...otherProps } = schema;

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
					buttonLabel === undefined ? undefined : (
						<Button.Default styleType="light" type="button" onClick={() => dispatchFieldEvent("edit", id)}>
							{buttonLabel ?? "Edit"}
						</Button.Default>
					)
				}
			>
				<Wrapper id={id}>{children}</Wrapper>
			</BoxContainer>
		);
	};

	return <>{renderAccordion()}</>;
};
