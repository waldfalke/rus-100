# Project Contract Registry

## Design Tokens Contracts

| Contract ID | Title | Description |
|-------------|-------|-------------|
| TD-MS-001 | Design Token System | Master contract defining the multi-layer token architecture (base → semantic → component), integration with Tailwind, theming support, and implementation roadmap |
| TD-API-001 | Design Tokens Guide | Comprehensive guide for using the design token API, with examples for CSS variables, Tailwind classes, TypeScript, and theming |
| TD-IMP-001 | Infrastructure Setup | Style Dictionary configuration, build scripts, directory structure, and transformer setup |
| TD-IMP-002 | Base Tokens | Implementation of primitive token layer for colors, typography, spacing, shadows, and radii |
| TD-IMP-003 | Semantic Tokens | Implementation of theme-specific semantic tokens that reference base tokens (light/dark themes) |
| TD-IMP-004 | Component Tokens | Implementation of component-specific tokens that reference semantic tokens |
| TD-FMT-001 | Tailwind Formatter | Custom formatter that transforms hierarchical tokens to flat CSS variables compatible with Tailwind config |
| TD-BUG-001 | Token Application Fix | Fixes for token application issues and high-specificity CSS overrides |
| TD-PREP-001 | Implementation Preparation | Preparation steps for token implementation including audit of existing styles |
| TOK-SPC-001 | Layout Spacing Standards | Standards for consistent layout spacing using the token system |

## Component Contracts

| Contract ID | Title | Description |
|-------------|-------|-------------|
| TD-COMP-001 | Component Library Master | Master contract for component library with shadcn/ui integration |
| TD-COMP-002 | Component Inventory | Inventory of available components with token status tracking |

## Layout Contracts

| Contract ID | Title | Description |
|-------------|-------|-------------|
| LYT-CNTR-001 | Page Container Standard | Standards for page container components with responsive behavior |

## User Experience Contracts

| Contract ID | Title | Description |
|-------------|-------|-------------|
| USR-001 | Profile Page | Requirements for user profile page implementation |

## Typography Contracts

| Contract | Description |
|----------|-------------|
| [Typography Contract Rus100](project-docs/typography-contract-rus100.md) | Implementation of typographic system with Source Serif Pro for headings and Inter for body text |

## Test Generator Contracts

| Contract | Description |
|----------|-------------|
| [TestGenerator-UI-Contract](project-docs/contracts/TestGenerator-UI-Contract.md) | UI requirements for the test generator feature |
| [TestGenerator-Product-Contract](project-docs/contracts/TestGenerator-Product-Contract.md) | Product specifications for the test generator |
| [TestGenerator-UX-TabPanel-Contract](project-docs/contracts/TestGenerator-UX-TabPanel-Contract.md) | UX design for the tab panel component |
| [TestGenerator-UX-TaskSelection-Contract](project-docs/contracts/TestGenerator-UX-TaskSelection-Contract.md) | UX design for task selection interface |
| [TestGenerator-Component-TaskCard-Contract](project-docs/contracts/TestGenerator-Component-TaskCard-Contract.md) | Requirements for the TaskCard component |

## Storybook Contracts

| Contract | Description |
|----------|-------------|
| [Storybook-Integration-Contract](project-docs/contracts/Storybook-Integration-Contract.md) | General Storybook integration guidelines |
| [Storybook-Component-Structure-Contract](project-docs/contracts/storybook/Storybook-Component-Structure-Contract.md) | Structure standards for Storybook components |
| [Storybook-Tokens-And-Theming-Contract](project-docs/contracts/storybook/Storybook-Tokens-And-Theming-Contract.md) | Integration of design tokens with Storybook theming |
| [Storybook-Deploy-Contract](project-docs/contracts/storybook/Storybook-Deploy-Contract.md) | Deployment guidelines for Storybook |

## Token Documentation

| Document | Description |
|----------|-------------|
| token-audit-registry.md | Registry tracking the audit of existing styles and conversion to tokens |
| token-prototype-definitions.md | Detailed specifications for token prototypes and naming conventions |
| token-migration-plan.md | Step-by-step migration plan from legacy styles to the token system |