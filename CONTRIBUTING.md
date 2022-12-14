# Contributing

When contributing components, do discuss with the designers as well as the team managing this repository.

Do also adhere to the guidelines mentioned below.

-   <a href="#convention">File / folder conventions</a>
-   <a href="#contributor">As a contributor</a>
    -   <a href="#creating-branch">Creating a branch</a>
    -   <a href="#adding-components">Adding components</a>
    -   <a href="#previewing-components">Previewing components</a>
    -   <a href="#writing-stories">Writing stories</a>
    -   <a href="#pull-request">Creating pull requests</a>
-   <a href="#repo-owner">As a repository owner</a>
    -   <a href="#versioning">Version Management</a>
    -   <a href="#documenting-change">Documenting change</a>
    -   <a href="#updating">How to update this library?</a>

---

<a id="convention"></a>

## Conventions

-   All folder and file names should kebab-lower-cased
-   Interface names should be prepended with `I`
-   Type names should be prepended with `T`
-   Adhere to the folder structure

```
├── src
	│── __mocks__
	│── __tests__
	│── assets
	│── components
	│	├── shared								// shared components for internal use only
	│	│	├── component-name
	│	│	│	├── component-name.tsx
	│	│	│	├── component-name.styles.tsx
	│	│	│	├── index.ts					// barrel export
	│	│	│	└── types.ts					// only necessary if the typings need to be exported / there are a lot of typings
	│	│	├── index.ts						// barrel export
	│	│	└── types.ts
	│	├── fields								// frontend engine fields that can be used in the schema
	│	│	├── field-name
	│	│	│	├── field-name.tsx
	│	│	│	├── field-name.styles.tsx
	│	│	│	├── index.ts					// barrel export
	│	│	│	└── types.ts					// only necessary if the typings need to be exported / there are a lot of typings
	│	│	├── index.ts						// barrel export
	│	│	└── types.ts
	│	└── frontend-engine						// main exported component
	│		├── frontend-engine.tsx
	│		├── index.ts						// barrel export
	│		├── types.ts
	│		└── validation-schema				// validation schema
	│── custom-types
	│── services
	│── stories
	└── utils									// common stateless functions
		└── hooks								// common hooks
```

---

<a id="contributor"></a>

## As a contributor

<a id="creating-branch"></a>
<br />

### **1. Creating a branch**

Now that you are starting off, first create a branch following these conventions:

-   If you have a ticket, `<ticket_num>-a-short-description` (e.g. `MOL-1234-fix-navbar`)
-   If you do not have a ticket, `just-a-short-description` (e.g. `fix-navbar`)

> Note that branches are to be created in kebab-case

<a id="adding-components"></a>
<br />

### **2. Adding components**

Components are to be added in the `src/components` directory in a structure like this

```
├── src
   ├── __tests__
   └── components
		├── component-name
    	│   ├── component-name.tsx
    	│   ├── component-name.styles.tsx
		│	├── index.tsx
		│   └── types.ts
 	 	└── dir-2
```

Where

-   `component-name.tsx` contains the component src
-   `component-name.styles.tsx` contains the styled components of the component
-   `index.ts` the exportable file of the component which should be re-exported in the `src/components/index.ts`
-   `types.ts` the type definitions which should be re-exported in the `src/components/types.ts`

Tests files will sit in the `__tests__` folder bearing the same folder name as the component.

<a id="previewing-components"></a>
<br />

### **3. Previewing components**

You can preview the components you have created via Storybook.

Run Storybook

> `npm run storybook`

If the web page does not load automatically, you may go to this url

> `http://localhost:6006`

<a id="writing-stories"></a>
<br />

### **4. Writing stories**

It is very important to provide enough information for potential users to understand and use the components.

Some principles include:

-   Properly describing and documenting your props
-   If need, create a Usage document for advanced usages
-   Have enough examples and provide controls only if deemed necessary/logical

<a id="pull-request"></a>
<br />

### **5. Creating pull requests**

Once you have committed and pushed your code, you are to create a pull request to have it approved to be in the `master` branch.

Simply create a pull request with a meaningful title and description of the change. This will be used in the `Changelog` document when the code owner publishes a new version.

An example of a good title is

```
Add a new event handler prop for <ComponentName>
```

Some of the changes could result in some breaking changes or things to note for users of the component. You can add the `[WARNING]` or `[BREAKING]` indicator so that the repository owner can help indicate these in the `Changelog` document.

```
[BREAKING] Rename `data` prop for <ComponentName> for better clarity
```

---

<a id="repo-owner"></a>
<br />

## As a repository owner

<a id="versioning"></a>
<br />

### **1. Version management**

In terms of versioning, you may follow the guidelines as such:

-   If it is breaking change (not backward compatible), increase the major version (e.g. `x.0.0`)
-   If it is a regular enhancement, increase the minor version (e.g. `6.x.0`)
-   If it is a bug fix, increase thepatch version (e.g. `6.1.x`)

<a id="documenting-change"></a>
<br />

### **2. Documenting change**

Like all libraries, documenting changes are extremely important for users to note of the changes being made in the code. This is done in `CHANGELOG.md`. Some principles include:

-   Indicate version number and date of release
-   State the type if it is `Fixes` or `Changes`
-   State purpose clearly. Indicate if it is Breaking change by indicating the tag `[BREAKING]`
-   If you would warn users of the change you can indicate using the tag `[WARNING]`

Here is an example of the changelog entry

```markdown
## v6.0.1-canary.1 (27 June, 2022)

### Changes

-   Introduce `Masonry` component

### Fixes

-   Fix fonts not being accessible on `index.css` of library
```

#### **Updating the version in storybook**

As we have a Storybook documentation to document the components, it is required to also update the `VersionTag` component's `currentStable` prop in `src/stories/intro/intro-stories.mdx`. The beta will always reference the `package.json` version. So your job is just to indicate the stable version.

<a id="updating"></a>
<br />

### **3. How to update this library?**

1. Create a branch with a signature as such `bump-v6.0.1-canary.1`
2. Update the `CHANGELOG.md`
3. Create a pull request to have it merged
