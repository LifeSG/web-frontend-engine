interface IRefTypes extends HTMLTextAreaElement {}

export namespace InteractionHelper {
	export const scrollRefToTop = (element: React.MutableRefObject<IRefTypes>) => {
		element?.current?.scroll({ top: 0, behavior: "smooth" });
	};
}
