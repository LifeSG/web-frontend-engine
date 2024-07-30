# LifeSG Web Frontend Engine [![npm version](https://img.shields.io/npm/v/@lifesg/web-frontend-engine.svg?style=flat)](https://www.npmjs.com/package/@lifesg/web-frontend-engine)

Repository for the web frontend engine

-   UI components based on <a href="https://github.com/LifeSG/react-design-system" target="_blank" rel="noopener noreferrer">React design system</a>
-   Form generation via JSON schema
-   To see the schema and fields available, visit our <a href="https://designsystem.life.gov.sg/web-frontend-engine/index.html?path=/story/introduction-getting-started--page" target="_blank" rel="noopener noreferrer">Storybook documentation</a>.

The intention of frontend engine is to take out the heavy lifting of form development and offer a collection of common fields so engineers can develop forms quickly. The form will be defined through a JSON schema so non-engineers can customise the form as well.

## Dependencies

Developers are expected to have the following packages installed:

-   @lifesg/react-design-system 2.7.0-canary.3
-   @lifesg/react-icons 1.2.0
-   react 17.0.2 or 18
-   react-dom 17.0.2 or 18
-   styled-components 5.3.5

## Installation

`npm i @lifesg/web-frontend-engine`

## Usage

```tsx
import { FrontendEngine } from "@lifesg/web-frontend-engine";

const App = () => {
	return (
		<FrontendEngine
			data={{
				sections: {
					mySection: {
						uiType: "section",
						children: {
							myField: {
								uiType: "text-field",
								label: "My field",
							},
							submit: {
								uiType: "submit",
								label: "Submit",
							},
						},
					},
				},
			}}
		/>
	);
};

export default App;
```

## Contributing to the repo

To contribute to the frontend engine

-   Refer to [Contributing](CONTRIBUTING.md)
-   Understand [how it works](https://github.com/LifeSG/web-frontend-engine/wiki/How-It-Works)
-   Familiarise with the [JSON schema](https://github.com/LifeSG/web-frontend-engine/wiki/JSON-Schema)
