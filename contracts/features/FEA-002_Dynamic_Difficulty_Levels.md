# Feature Contract: FEA-002 Dynamic Difficulty Levels

**Version:** 1.0
**Date:** 2025-07-25
**Author:** Gemini 2.5 Pro
**Status:** Proposed

## 1. Overview

**ID:** FEA-002
**Name:** Dynamic Difficulty Levels for Test Generation
**Description:** Implement a more granular and data-driven approach to selecting question difficulty levels during test generation, moving beyond the fixed "any", "easy", "hard" categories.

**Source:** Customer Request (via chat on 2025-07-25)

## 2. Goals

*   Provide users (teachers/admins) with finer control over the difficulty of generated tests.
*   Utilize available question performance statistics to offer relevant difficulty tiers.
*   Improve the pedagogical value of generated tests by allowing more precise targeting of student levels.

## 3. Current State

*   The system currently offers three fixed difficulty options for selecting questions:
    *   "любая" (any)
    *   "лёгкие" (easy)
    *   "сложные" (hard)
*   These categories are likely based on predefined, static assignments or simple heuristics, not detailed performance data.

## 4. Proposed Enhancement

*   **Data-Driven Levels:** Introduce difficulty levels based on statistical analysis of accumulated performance data **(initial data provided by the customer)** for each question or question type (e.g., average score, solve time, common errors).
*   **Dynamic Levels:** The available difficulty levels for a specific question type in the UI should depend on the amount and distribution of the available statistical data.
    *   If sufficient data exists to differentiate statistically significant tiers, offer more granular options like:
        *   "Самые лёгкие" (e.g., top 10-20% easiest based on stats)
        *   "Лёгкие" (e.g., 20-40% percentile)
        *   "Средние" (e.g., 40-60% percentile)
        *   "Сложные" (e.g., 60-80% percentile)
        *   "Самые сложные" (e.g., bottom 10-20% hardest based on stats)
    *   If data is insufficient for fine-grained analysis, fall back to broader categories (e.g., "Легче среднего", "Сложнее среднего") or the original "Лёгкие"/"Сложные".
    *   An "Любая" option should remain available.
*   **UI Adaptation:** The test generation interface needs to dynamically display the available difficulty levels for each task/question type based on the underlying data analysis.
    *   **Difficulty Chips/Buttons:** Each available difficulty level (including "Любая") should be presented as a distinct selectable element (e.g., a chip or button).
        *   **Content:** Each chip should display the difficulty level name (e.g., "Лёгкие", "Средние", "Любая").
        *   **Question Count:** Each chip must also display the number of available questions matching that specific difficulty level (e.g., "Лёгкие (25)", "Средние (42)"). This count should update dynamically if other filters affecting question availability are changed.
        *   **Icon:** The "Любая" chip should include a dice icon.
        *   **Disabled State:** If the question count for a specific difficulty level is 0, the corresponding chip must be visually disabled (e.g., greyed out) and non-interactive.
    *   **Multi-Select Logic:** Users should be able to select multiple specific difficulty levels simultaneously. Selecting "Любая" deselects others, and selecting a specific level deselects "Любая". Disabled chips cannot be selected.
*   **Backend Logic:** Requires implementation of:
    *   Logic to interpret and utilize the **provided** difficulty data.
    *   Logic to map statistical results to discrete difficulty tiers.
    *   API adjustments to expose available dynamic levels **and their corresponding question counts** per question type and handle incoming selections.

## 5. Requirements & Dependencies

*   **Data Integration:** Requires a mechanism for ingesting, storing, and accessing the **customer-provided** question performance/difficulty statistics.
*   **Statistical Model Definition:** Need to agree on the specific statistical measures and thresholds used by the customer or define a mapping if their data format differs from the proposed tiers.
*   **UI/UX Design:** Requires careful design of the UI to clearly present the dynamic options, the dice icon for "Любая", and the multi-select functionality without overwhelming the user.
*   **Icon Library:** Ensure Feather Icons or a suitable alternative is available in the project frontend stack.

## 6. Acceptance Criteria

*   Users can see dynamically generated difficulty levels (beyond easy/hard) for question types where sufficient data exists.
*   Selecting a specific difficulty level (e.g., "Самые сложные") results in a test containing questions predominantly from that statistical tier.
*   The system gracefully handles questions with insufficient data, offering broader or default difficulty options.
*   The UI clearly indicates the basis for the available difficulty levels.
*   Selecting the "Любая" option deselects all other difficulty levels.
*   Selecting one or more specific difficulty levels deselects the "Любая" option.
*   The "Любая" UI element displays a dice icon.
*   Each difficulty level chip/button displays the count of available questions for that level (e.g., "Сложные (15)").
*   The question counts displayed in the chips update dynamically based on other applied filters (e.g., selecting a specific text or topic).
*   Difficulty chips/buttons corresponding to levels with 0 available questions are displayed in a disabled state and cannot be selected.

## 7. Open Questions & Considerations

*   What is the exact format and structure of the customer-provided difficulty data?
*   How should the system handle newly added questions with no performance data provided yet? (Default difficulty? Exclude from granular selection initially? Hide?)
*   How frequently will the customer provide updated difficulty data, and what is the process for updating it in the system?
*   How will this interact with existing "Формат ЕГЭ" / "Упражнения" selections? (Does difficulty selection apply before or after these filters?)

## 8. Priority (Initial Assessment)

*   Medium-High. Addresses a direct customer request and offers significant potential value. Focus is on UI implementation using provided data. 