---
name: "migrate-styled-component"
description: "Migrates a component from Styled Components-based styling to Linaria"
---

You are tasked with migrating a component to Linaria.

## Input Requirements

The user must provide:

1. **Component**, specified as
    - Path to the component folder, OR
    - Main component folder of the current open file

## Your Responsibilities

Perform the migration in phases. At each phase, the component should remain functional. Pause and allow the user to commit the changes before proceeding to the next phase. Suggest a commit message that reflects the completed step. The commit message should follow this template:

```
[CCUBE-XXXX][<initials>] <ComponentName> - <Description of the completed step>
```

where CCUBE-XXXX is the relevant JIRA ticket number.

Before you begin, create the outline for a step-by-step plan you would have to take to complete your task accurately. Pause and allow the user to review the plan.

## Phases

### 1. Convert Styled Components interpolations to class names within the `styled` tags

-   In `<component>.styles.ts`, convert the function interpolations to nested css classes. Apply a logical class name scoped to the component name and variant.
-   In `<component>.tsx`, convert the style props to conditionally applied classes using `clsx`. Example:

    ```
    // before
    const Container = styled.div`
      background: red;
      ${props => props.disabled && ...}
      ${props => props.$isOpen && ...}
    `

    <Container disabled={disabled} $isOpen={isOpen} />

    // after
    const Container = styled.div`
      background: red;

      &.containerDisabled {
        ...
      }

      &.containerIsOpen {
        ...
      }
    `

    <Container className={clsx(disabled && "containerDisabled", isOpen && "containerIsOpen", className)} />
    ```

-   Ensure the consumer `className` prop is chained last to the top-level element using `clsx` to allow for external overrides
-   For props used as CSS values, convert them to CSS variables and apply them with `useApplyStyle` on a ref (do not use the JSX `style` prop / inline styles). The CSS variable name should be formatted as `--fds-internal-componentName-subComponent-propertyType`. For example:

    ```
    // before
    const Container = styled.div`
      background: ${props => props.backgroundColor};
    `;

    // after
    const tokens = {
      container: { backgroundColor: "--fds-internal-myComponent-container-backgroundColor" }
    }

    const Container = styled.div`
      /* reset variable to prevent leaking to child components */
      ${tokens.container.backgroundColor}: initial;
      background: var(${tokens.container.backgroundColor});
    `;

    const MyComponent = ({ backgroundColor, ...rest }) => {
      const containerRef = useRef(null);

      useApplyStyle(containerRef, {
        [tokens.container.backgroundColor]: backgroundColor
      });

      return <Container ref={containerRef} {...rest} />
    }
    ```

### 2. Convert Styled Components `styled` tags to Linaria `css` tags

-   In `<component>.styles.ts`, extract the nested css classes to standalone `css` tags
-   In `<component>.tsx`, replace the Styled Component and hardcoded class name references to the new Linaria references. Import the styles as `import * as styles from "./<component>.styles"` to avoid collision with actual variable names or props. Example:

    ```
    const container = css`
      background: red;
    `

    const containerDisabled = css`
      ...
    `

    <div className={clsx(styles.container, disabled && styles.containerDisabled, className)} />
    ```

-   If the `css` tag is empty, it can be removed

## Constraints

-   Only implement the specific portion assigned to you
-   Do not modify or implement tasks that were not assigned
-   Maintain backward compatibility unless explicitly stated otherwise in the plan
-   Follow the existing architecture and patterns in the codebase
-   Ensure your changes don't break existing functionality
