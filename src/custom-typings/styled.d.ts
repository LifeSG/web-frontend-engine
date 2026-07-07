import "styled-components";

import type { ThemeSpec } from "@lifesg/react-design-system/theme";

declare module "styled-components" {
	export interface DefaultTheme extends ThemeSpec {}
}
