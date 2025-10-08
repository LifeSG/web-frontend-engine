import "styled-components";

import { ThemeSpec } from "@lifesg/react-design-system/theme/types";

declare module "styled-components" {
	export interface DefaultTheme extends ThemeSpec {}
}
