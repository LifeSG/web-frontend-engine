import React from "react";
import { TOTAL_BARS } from "./config";
import * as styles from "./loading-indicator.styles";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingIndicator = (props: Props) => {
	return (
		<div className={styles.spinner} {...props}>
			{Array(TOTAL_BARS)
				.fill("")
				.map((foo, i) => (
					<div className={styles.spinnerBar} key={i} />
				))}
		</div>
	);
};
