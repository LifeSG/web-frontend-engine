interface INoNetworkModal {
    id: string;
    cachedImage: string;
    refreshNetwork: () => void;
}
declare const NoNetworkModal: ({ id, cachedImage, refreshNetwork }: INoNetworkModal) => import("react/jsx-runtime").JSX.Element;
export default NoNetworkModal;
