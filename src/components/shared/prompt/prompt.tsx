import { useRef } from "react";
import clsx from "clsx";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { Modal } from "@lifesg/react-design-system/modal";
import { Typography } from "@lifesg/react-design-system/typography";
import { Button } from "@lifesg/react-design-system/button";
import { TestHelper } from "../../../utils";
import * as styles from "./prompt.styles";
import { IPromptProps } from "./types";

export const Prompt = (props: IPromptProps) => {
	const { id = "prompt", show, size, title, description, image, buttons } = props;
	const buttonContainerRef = useRef<HTMLButtonElement>(null);

	useApplyStyle(buttonContainerRef, {
		[styles.tokens.promptButton.width]: buttons?.length === 1 ? "16rem" : "100%",
	});

	console.log({ tokens: styles.tokens, buttonContainerRef });

	return (
		<Modal
			show={show}
			id={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			data-testid={TestHelper.generateId(id, undefined, show ? "show" : "hide")}
			className={styles.scrollableModal}
		>
			<div className={styles.growContainer}>
				<div className={clsx(styles.container, size === "large" && styles.containerLarge)}>
					<div className={clsx(styles.labelContainer, size === "large" && styles.labelContainerLarge)}>
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
							<Typography.HeadingXS weight="regular" className={styles.description}>
								{description}
							</Typography.HeadingXS>
						) : (
							description
						)}
					</div>
					<div className={clsx(styles.buttonContainer, size === "large" && styles.buttonContainerLarge)}>
						{buttons?.map((button, i) => (
							<Button
								ref={buttonContainerRef}
								id={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-${i + 1}`)}
								data-testid={TestHelper.generateId(id, button.id ? `btn-${button.id}` : `btn-${i + 1}`)}
								className={clsx(styles.promptButton, size === "large" && styles.promptButtonLarge)}
								key={button.title}
								onClick={button.onClick}
								styleType={button.buttonStyle}
							>
								{button.title}
							</Button>
						))}
					</div>
				</div>
			</div>
		</Modal>
	);
};
