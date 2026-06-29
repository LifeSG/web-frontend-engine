import clsx from "clsx";
import { ModalV2 } from "@lifesg/react-design-system/modal-v2";
import { Typography } from "@lifesg/react-design-system/typography";
import { Button } from "@lifesg/react-design-system/button";
import { TestHelper } from "../../../utils";
import * as styles from "./prompt.styles";
import { IPromptProps, TPromptButton } from "./types";

export const Prompt = ({ id = "prompt", show, size, title, description, image, buttons }: IPromptProps) => {
	const renderButton = (button: TPromptButton) => (
		<Button
			id={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-1`)}
			data-testid={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-1`)}
			key={button.title}
			onClick={button.onClick}
			styleType={button.buttonStyle}
		>
			{button.title}
		</Button>
	);

	return (
		<ModalV2
			show={show}
			id={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			data-testid={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
		>
			<ModalV2.Content>
				<ModalV2.Card className={clsx(styles.container, size === "large" && styles.containerLarge)}>
					<ModalV2.Content
						className={clsx(styles.labelContainer, size === "large" && styles.labelContainerLarge)}
					>
						{typeof image === "string" ? (
							<img src={image} alt={title} className={styles.promptImage} />
						) : (
							image
						)}
						<Typography.HeadingXS
							id={TestHelper.generateId(id, "title")}
							data-testid={TestHelper.generateId(id, "title")}
							weight="semibold"
							className={styles.title}
						>
							{title}
						</Typography.HeadingXS>
						{typeof description === "string" ? (
							<Typography.HeadingXS as="p" weight="regular" className={styles.description}>
								{description}
							</Typography.HeadingXS>
						) : (
							description
						)}
					</ModalV2.Content>
					{!!buttons && buttons.length > 0 && (
						<ModalV2.Footer
							className={clsx(styles.buttonContainer, size === "large" && styles.buttonContainerLarge)}
							primaryButton={renderButton(buttons[0])}
							secondaryButton={buttons.length > 1 && renderButton(buttons[1])}
						/>
					)}
				</ModalV2.Card>
			</ModalV2.Content>
		</ModalV2>
	);
};
