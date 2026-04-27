/// <reference types="react" />
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
export declare const InfiniteScrollList: (props: InfiniteScrollProp) => JSX.Element;
