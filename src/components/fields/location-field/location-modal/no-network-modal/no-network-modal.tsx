import React from "react";
import { ButtonWrapper, Container, ContentBody, ContentTitle, Image } from "./no-network-modal.styles";
import { TestHelper } from "../../../../../utils";

interface INoNetworkModal {
	id: string;
	cachedImage: string;
	refreshNetwork: () => void;
}

const NoNetworkModal = ({ id, cachedImage, refreshNetwork }: INoNetworkModal) => {
	return (
		<Container
			id={TestHelper.generateId(id, "no-internet-connectivity")}
			data-testid={TestHelper.generateId(id, "no-internet-connectivity")}
		>
			<Image src={cachedImage} alt="no-connectivity" />
			<ContentTitle weight="semibold">No connection found</ContentTitle>
			<ContentBody>Check your internet connection and try again.</ContentBody>
			<ButtonWrapper onClick={refreshNetwork}>Try again</ButtonWrapper>
		</Container>
	);
};

export default NoNetworkModal;
