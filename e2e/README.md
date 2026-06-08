# E2E Workspace

This directory contains end-to-end assets split by responsibility:

-   `nextjs-app/`: Next.js demo application used by Playwright
-   `tests/`: Playwright test suite - `components/`: component-level specs - `frontend-engine/`: frontend-engine behavior specs - `utils/`: shared test helpers (fixtures, StoryPage, screenshot utils)

## Route Convention

-   Story routes are served from `/components/<component-path>/<story>`.
-   Example: `/components/elements/divider/default` maps to
    `nextjs-app/app/components/elements/divider/default.e2e.tsx`.

## Test Patterns

-   Use `forComponent(...)` from `tests/utils/fixtures` to bind one component path and set stories per block.
-   Use a file-local subclass of `StoryPage` when you need `story.locators` ergonomics.
