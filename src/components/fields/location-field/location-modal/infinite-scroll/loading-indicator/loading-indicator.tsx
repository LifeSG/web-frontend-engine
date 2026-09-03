import clsx from "clsx";
import React from "react";
import { TOTAL_BARS } from "./config";
import * as styles from "./loading-indicator.styles";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingIndicator = ({ className, ...props }: Props) => {
	return (
		<div className={clsx(styles.spinner, className)} {...props}>
			{Array(TOTAL_BARS)
				.fill("")
				.map((foo, i) => (
					<div className={styles.spinnerBar} key={i} />
				))}
		</div>
	);
};
