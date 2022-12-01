import { Text } from "@lifesg/react-design-system/text";
import React, { useEffect, useState } from "react";
import WarningIcon from "../../../../../assets/img/icons/warning-white.svg";
import { FileHelper, TestHelper } from "../../../../../utils";
import { ERROR_MESSAGES } from "../../../../shared";
import { EImageStatus, IImage, TImageUploadAcceptedFileType } from "../../types";
import { BodyText, Content, ErrorIcon, NameWrapper, OkButton, Wrapper } from "./image-error.styles";

interface IProps {
	id?: string;
	image: IImage;
	accepts: TImageUploadAcceptedFileType[];
	maxSizeInKb: number;
	onClickOk: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ImageError = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		id = "photo-error",
		image: { name, status },
		accepts,
		maxSizeInKb,
		onClickOk,
	} = props;
	const [errorTitle, setErrorTitle] = useState<string>();
	const [errorDescription, setErrorDescription] = useState<JSX.Element>();

	//  =============================================================================
	// EFFECTS
	//  =============================================================================
	useEffect(() => {
		const filename = <NameWrapper>{FileHelper.truncateFileName(name || "", 300)}</NameWrapper>;
		switch (status) {
			case EImageStatus.ERROR_FORMAT:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("photo").MODAL.INCORRECT_DOC_TYPE.TITLE);
				setErrorDescription(
					ERROR_MESSAGES.UPLOAD("photo").MODAL.INCORRECT_DOC_TYPE.DESCRIPTION(filename, accepts)
				);
				break;
			case EImageStatus.ERROR_GENERIC:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("photo").MODAL.GENERIC_ERROR.TITLE);
				setErrorDescription(ERROR_MESSAGES.UPLOAD("photo").MODAL.GENERIC_ERROR.DESCRIPTION(filename));
				break;
			case EImageStatus.ERROR_SIZE:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("photo").MODAL.EXCEEDS_MAX_FILE_SIZE.TITLE);
				setErrorDescription(
					ERROR_MESSAGES.UPLOAD("photo").MODAL.EXCEEDS_MAX_FILE_SIZE.DESCRIPTION(filename, maxSizeInKb)
				);
				break;
		}
	}, [accepts, maxSizeInKb, name, status]);

	//  =============================================================================
	// RENDER FUNCTIONS
	//  =============================================================================
	return (
		<Wrapper>
			<ErrorIcon src={WarningIcon} alt={errorTitle} />
			<Content>
				<BodyText
					as={Text.H4}
					id={TestHelper.generateId(id, "title")}
					data-testid={TestHelper.generateId(id, "title")}
				>
					{errorTitle}
				</BodyText>
				<BodyText as={Text.Body}>{errorDescription}</BodyText>
				<OkButton
					onClick={onClickOk}
					id={TestHelper.generateId(id, "ok-button")}
					data-testid={TestHelper.generateId(id, "ok-button")}
				>
					OK
				</OkButton>
			</Content>
		</Wrapper>
	);
};
