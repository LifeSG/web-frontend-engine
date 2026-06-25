---
name: "test-component-functional"
description: "Creates functional test specs for the specified component"
---

You are tasked with writing functional test specs for a Frontend Engine (FEE) component.

## Input Requirements

The user must provide:

1. **Component**, specified as
    - Path to the component folder, OR
    - Main component folder of the current open file

## Test Scope

FEE is a JSON schema-driven form engine, so the stories should be created with hardcoded JSON schemas that demonstrate the functionality of the component. The stories should not rely on any external data or APIs.

Refer to `e2e/README.md` on the existing test structure and patterns for guidance on how to set up the story and test files. The story should be added to `e2e/nextjs-app/app/components/<component-type>/<component>/<story>.e2e.tsx` and should include the necessary schema to demonstrate the component's functionality. Each story should test 1 specific scenario or use case.

Refer to `src/stories/<component-path>/<component-type>/<component>.stories.tsx` for examples of the schema configuration for the component.

For components that are wrappers around the `@lifesg/react-design-system` components, only a basic rendering story is needed to demonstrate that the component renders correctly. For custom-built components, the stories and tests should cover the key functionalities and use cases of the component. Focus on writing functional tests that cover any additional behaviour or edge cases that are not already covered by unit tests, rather than trying to cover every possible scenario. This may include:

-   Browser-environment dependent behaviour (e.g. file upload, canvas, etc.)
-   Accessibility (e.g. focus trapping, screen reader support, etc.)
-   Visual regressions (e.g. screenshot testing)

## Your Responsibilities

Create isolated component examples (stories) and write Playwright test cases that run against each story.

First, suggest a list of possible test specs for the component, e.g.

-   "All size and style variants"
-   "Disabled state"
-   "Keyboard navigation"

Next, prompt the user to review the list before you proceed. Generate the functional tests for the component using the existing Playwright setup.

## Best Practices

### Locators

Refer to the `Locating elements` section in https://playwright.dev/docs/locators#locating-elements on when to use different locator strategies. In general:

-   Prefer using `getByRole` for locating elements
-   Use `getByTestId` if there are no suitable locators, and add a `data-testid` attribute to the relevant element in the story

### Test Structure

-   `test.describe("xxx", () => { ... })` will add a "folder" level to the tests. Avoid unnecessary nesting of describe blocks by using the anonymous form `test.describe(() => { ... })`. Use this to group together related tests only if the file has many test cases
-   Based on the description provided by the user, derive a succinct test title for `test("xxx")`. Avoid using dashes as it will be used as part of the screenshot file name
-   Use `test.step()` if the test involves multiple steps. Avoid unnecessary nesting of steps.
