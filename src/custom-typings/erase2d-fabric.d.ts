import "fabric";

declare module "fabric" {
	interface FabricObject {
		erasable?: boolean | "deep";
	}
}
