# Contract: Embedded Code Contracts Standard

**Version:** 1.0
**Date:** 2024-07-28 
**Authors:** User, Gemini Assistant

## 1. Purpose

This document defines the standard for implementing and verifying contracts directly within the source code of UI components and potentially other modules. The goal is to create reliable, maintainable, and AI-analysable code while minimizing redundant testing efforts, aligning with the "Minimalist and Elegant Solution" principle.

## 2. Scope

This standard applies primarily to UI components developed using TypeScript and React (or the relevant framework) within this project. It may be adapted for other types of code modules where applicable.

## 3. Core Principles

*   **Contracts are Embedded:** The primary specification and verification logic reside directly within the component's source code.
*   **TypeScript is Foundational:** Strict typing and detailed TSDoc are the first line of contract definition and static verification.
*   **Runtime Checks are Safety Nets:** Used for validations not expressible via types, primarily logging warnings (`console.warn`) rather than throwing errors.
*   **Storybook is Demonstrative Proof:** Used for visual and interactive validation that the component behaves according to its embedded contracts.
*   **Minimize Redundant Tests:** Avoid separate unit tests (`*.test.ts`) that merely duplicate checks already covered by types, TSDoc, runtime checks, and Storybook stories.

---

### ### Preconditions

*   The component's source code file exists or is being created.
*   The development environment is configured with TypeScript and Storybook.
*   High-level requirements or a corresponding Markdown contract (if available) for the component are understood.
*   Tooling for static analysis (TypeScript compiler `tsc`, linters) is functional.

### ### Postconditions

*   **Static Contracts:**
    *   Component props, state, and function signatures use strict TypeScript types.
    *   Public APIs (props, custom hooks, context values, exported functions) are documented with comprehensive TSDoc comments, including relevant tags like `@param`, `@returns`, `@precondition`, `@postcondition`, `@invariant`, `@throws`, `@default`, `@status`, `@design`, `@example`.
*   **Dynamic Contracts:**
    *   Runtime checks are implemented within the component code for critical invariants, preconditions, or postconditions not guaranteed by TypeScript types (e.g., string formats, number ranges, complex state relationships).
    *   Runtime checks primarily use `console.warn` with clear, structured messages (e.g., `[Contract Violation][ComponentName]: Message. (Received: value)`). `throw Error` is reserved for unrecoverable situations.
*   **Demonstrative Validation:**
    *   Storybook stories exist for the component, covering:
        *   Rendering with typical valid props.
        *   States representing boundary conditions (e.g., empty list, full capacity, disabled states triggered by props/state).
        *   Demonstration of visual variants.
        *   Cases designed to trigger runtime `console.warn` messages (verifiable in the browser console).
*   **Testing Strategy:**
    *   Explicit `*.test.ts` files for the component are minimal or absent if their purpose would be covered by the above mechanisms. Unit tests may still be used for complex, pure logic functions decoupled from the UI rendering framework if necessary.

### ### Invariants

*   The component's code (TypeScript types, TSDoc, runtime checks) is the single source of truth for its detailed contract.
*   Any change to the component's logic or public API requires a corresponding update to its embedded contracts (types, TSDoc, runtime checks) and its Storybook stories.
*   Focus remains on ensuring the component itself enforces its contract boundaries.

### ### Exceptions

*   **Complex Contracts:** Some complex business logic or state interactions may be difficult to fully express or verify solely through static types and simple runtime checks. This might necessitate more traditional unit tests for specific logic segments.
*   **Integration Aspects:** This standard focuses on component-level contracts. Integration points between components or with external systems might require separate integration tests.
*   **Legacy Code:** Applying this standard retroactively to complex legacy code without types or TSDoc may require significant refactoring effort.
*   **Performance:** Overly numerous or complex runtime checks could potentially impact performance in production builds (mitigation: ensure checks are development-only if necessary).
*   **Tooling Limitations:** Static analysis or Storybook might have limitations in representing or verifying certain types of contracts.

---

## 4. Process Adherence

Both the development team and AI assistants involved in coding should adhere to this standard when creating or modifying applicable code. Reviews (manual or automated) should check for compliance with these principles. 