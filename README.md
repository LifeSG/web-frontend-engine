# web-frontend-engine

Repository for the web frontend engine

-   UI components based on <a href="https://github.com/LifeSG/react-design-system" target="_blank" rel="noopener noreferrer">React design system</a>
-   Form generation via JSON schema

The intention of frontend engine is to take out the heavy lifting of form development and offer a collection of common fields so engineers can develop forms quickly. The form will be defined through a JSON schema so non-engineers can customise the form as well.

## Dependencies

Developers are expected to have the following packages installed:

-   @lifesg/react-design-system alpha.14
-   react 17.0.2 or 18
-   react-dom 17.0.2 or 18
-   styled-components 5.3.5

## Installation

`npm i @lifesg/web-frontend-engine`

## Usage

```tsx
import { FrontendEngine } from "web-frontend-engine";

const App = () => {
	return (
		<FrontendEngine
			data={{
				fields: {
					myField: {
						fieldType: "text",
						label: "My field",
					},
					submit: {
						fieldType: "submit",
						label: "Submit",
					},
				},
			}}
		/>
	);
};

export default App;
```

## Component Documentation

The components are documented using Storybook. To see the stories, upon pulling this repository to your system, do these steps:

Install all dependencies

> `npm ci`

Run Storybook

> `npm run storybook`

If the web page does not load automatically, you may go to this url

> `http://localhost:6006`

## Adding Components

To contribute to the frontend engine, view [Contributing](CONTRIBUTING.md).
