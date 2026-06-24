import { useRef } from "react";
import clsx from "clsx";
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
	tokens,
} from "./prompt.styles";
import { IPromptProps } from "./types";
import { useApplyStyle } from "@lifesg/react-design-system/theme";

export const Prompt = (props: IPromptProps) => {
	const { id = "prompt", show, size, title, description, image, buttons } = props;
	const buttonContainerRef = useRef<HTMLDivElement>(null);

	useApplyStyle(buttonContainerRef, {
		[tokens.promptButton.width]: buttons?.length === 1 ? "16rem" : "100%",
	});

	return (
		<ScrollableModal
			show={show}
			id={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			data-testid={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
		>
			<GrowContainer>
				<Container className={clsx(size === "large" && "containerLarge")}>
					<LabelContainer className={clsx(size === "large" && "labelContainerLarge")}>
						{typeof image === "string" ? <PromptImage src={image} alt={title} /> : image}
						<Title
							id={TestHelper.generateId(id, "title")}
							data-testid={TestHelper.generateId(id, "title")}
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
					<ButtonContainer
						ref={buttonContainerRef}
						className={clsx(size === "large" && "buttonContainerLarge")}
					>
						{buttons?.map((button, i) => (
							<PromptButton
								id={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-${i + 1}`)}
								data-testid={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-${i + 1}`)}
								className={clsx(size === "large" && "promptButtonLarge")}
								key={button.title}
								onClick={button.onClick}
								styleType={button.buttonStyle}
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
