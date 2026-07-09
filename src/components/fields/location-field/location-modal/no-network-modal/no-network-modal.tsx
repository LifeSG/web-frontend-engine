import React from "react";
import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import * as styles from "./no-network-modal.styles";
import { TestHelper } from "../../../../../utils";

interface INoNetworkModal {
	id: string;
	cachedImage: string;
	refreshNetwork: () => void;
}

const NoNetworkModal = ({ id, cachedImage, refreshNetwork }: INoNetworkModal) => {
	return (
		<div
			className={styles.container}
			id={TestHelper.generateId(id, "no-internet-connectivity")}
			data-testid={TestHelper.generateId(id, "no-internet-connectivity")}
		>
			<img className={styles.image} src={cachedImage} alt="no-connectivity" />
			<Typography.BodyBL className={styles.contentTitle} weight="semibold">
				No connection found
			</Typography.BodyBL>
			<Typography.BodyBL className={styles.contentBody}>
				Check your internet connection and try again.
			</Typography.BodyBL>
			<Button className={styles.buttonWrapper} onClick={refreshNetwork}>
				Try again
			</Button>
		</div>
	);
};

export default NoNetworkModal;
