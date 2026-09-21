import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import { Component, PropsWithChildren, ReactNode } from "react";
import * as styles from "./schema-playground.styles";

interface IState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<PropsWithChildren, IState> {
	state: IState = { hasError: false, error: null };

	static getDerivedStateFromError(error: Error): IState {
		return { hasError: true, error };
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className={styles.errorBoundaryFallback}>
					<Typography.BodyBL weight="semibold">Something went wrong</Typography.BodyBL>
					<pre className={styles.errorDetails}>{this.state.error?.message}</pre>
					<Button
						styleType="secondary"
						sizeType="small"
						onClick={() => this.setState({ hasError: false, error: null })}
					>
						Retry
					</Button>
				</div>
			);
		}
		return this.props.children;
	}
}
