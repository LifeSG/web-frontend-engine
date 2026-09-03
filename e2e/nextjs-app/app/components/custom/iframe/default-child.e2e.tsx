"use client";

import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import styles from "./iframe.module.css";

export default function IframeDefaultChildPage() {
	return (
		<div className={styles["iframe-child"]}>
			<Typography.BodyBL>This is inside the iframe</Typography.BodyBL>
			<Button>Submit</Button>
		</div>
	);
}
