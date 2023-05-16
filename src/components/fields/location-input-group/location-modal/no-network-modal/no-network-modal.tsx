import React from "react";
import { ButtonWrapper, Container, ContentBody, ContentTitle, Image } from "./no-network-modal.styles";

interface INoNetworkModal {
	cachedImage: string;
	refreshNetwork: () => void;
}

const NoNetworkModal = ({ cachedImage, refreshNetwork }: INoNetworkModal) => {
	return (
		<Container>
			<Image src={cachedImage} alt="no-connectivity" />
			<ContentTitle weight="semibold">No connection found</ContentTitle>
			<ContentBody>Check your internet connection and try again.</ContentBody>
			<ButtonWrapper onClick={refreshNetwork}>Try again</ButtonWrapper>
		</Container>
	);
};

export default NoNetworkModal;
