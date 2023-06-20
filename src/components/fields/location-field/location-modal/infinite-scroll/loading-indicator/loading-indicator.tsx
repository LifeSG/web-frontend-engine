import React from "react";
import { TOTAL_BARS } from "./config";
import { Spinner, SpinnerBar } from "./loading-indicator.styles";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingIndicator = (props: Props) => {
	return (
		<Spinner {...props}>
			{Array(TOTAL_BARS)
				.fill("")
				.map((foo, i) => (
					<SpinnerBar key={i} />
				))}
		</Spinner>
	);
};
