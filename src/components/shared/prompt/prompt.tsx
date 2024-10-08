import { TestHelper } from "../../../utils";
import {
	ButtonContainer,
	Container,
	Description,
	GrowContainer,
	LabelContainer,
	PromptButton,
	PromptImage,
	ScrollableModal,
	Title,
} from "./prompt.styles";
import { IPromptProps } from "./types";

export const Prompt = (props: IPromptProps) => {
	const { id = "prompt", show, size, title, description, image, buttons } = props;

	return (
		<ScrollableModal
			show={show}
			id={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			data-testid={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
		>
			<GrowContainer>
				<Container size={size}>
					<LabelContainer size={size}>
						{typeof image === "string" ? <PromptImage src={image} alt={title} /> : image}
						<Title
							id={TestHelper.generateId(id, "title")}
							data-testid={TestHelper.generateId(id, "title")}
							size={size}
							weight="semibold"
						>
							{title}
						</Title>
						{typeof description === "string" ? (
							<Description weight="regular">{description}</Description>
						) : (
							description
						)}
					</LabelContainer>
					<ButtonContainer size={size}>
						{buttons?.map((button, i) => (
							<PromptButton
								id={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-${i + 1}`)}
								data-testid={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-${i + 1}`)}
								size={size}
								key={button.title}
								onClick={button.onClick}
								styleType={button.buttonStyle}
								width={buttons.length === 1 ? "16rem" : undefined}
							>
								{button.title}
							</PromptButton>
						))}
					</ButtonContainer>
				</Container>
			</GrowContainer>
		</ScrollableModal>
	);
};
