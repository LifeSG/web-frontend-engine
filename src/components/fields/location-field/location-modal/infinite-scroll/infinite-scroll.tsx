import useInfiniteScroll from "react-infinite-scroll-hook";
import { LoadingIndicator } from "./loading-indicator";
import * as styles from "./infinite-scroll.style";

export type InfiniteScrollProp = {
	loading: boolean;
	hasNextPage: boolean;
	loadMore: VoidFunction;
	items: JSX.Element[];

	disabled?: boolean;
	delayInMs?: number;
	rootMargin?: string;
	error?: boolean | undefined;
};

export const InfiniteScrollList = (props: InfiniteScrollProp): JSX.Element => {
	const { loading, items, hasNextPage, error, loadMore, rootMargin = "0px 0px 50px 0px" } = props;

	const [sentryRef] = useInfiniteScroll({
		loading,
		hasNextPage,
		onLoadMore: loadMore,
		// When there is an error, we stop infinite loading.
		// It can be reactivated by setting "error" state as undefined.
		disabled: !!error,
		// `rootMargin` is passed to `IntersectionObserver`.
		// We can use it to trigger 'onLoadMore' when the sentry comes near to become
		// visible, instead of becoming fully visible on the screen.
		rootMargin: rootMargin,
	});
	return (
		<>
			{items}
			{(loading || hasNextPage) && (
				<div
					className={styles.infiniteIndicator}
					data-testid={"InfiniteScrollList__InfiniteListItem-sentryRef"}
					ref={sentryRef}
				>
					<LoadingIndicator />
				</div>
			)}
		</>
	);
};
