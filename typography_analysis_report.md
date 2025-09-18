# Typographic Analysis Report for "Генерация теста.html"

## 1. Typographic System Reference (Agreed Upon)

This section outlines the target typographic styles for the Rus100 project.

| Level         | Desktop Size (px) | Mobile Size (px) | Font Family        | Weight          | Tailwind Utility (Primary)              | Line Height        | Notes                                     |
|---------------|-------------------|------------------|--------------------|-----------------|-----------------------------------------|--------------------|-------------------------------------------|
| **H1**        | 48 (`3rem`)       | 36 (`2.25rem`)   | Source Serif Pro   | 600 (Semibold)  | `text-app-h1` (responsive via `md:`)  | `leading-tight`    |                                           |
| **H2**        | 36 (`2.25rem`)    | 30 (`1.875rem`)  | Source Serif Pro   | 600 (Semibold)  | `text-app-h2-mobile md:text-app-h2`     | `leading-tight`    |                                           |
| **H3**        | 24 (`1.5rem`)     | 20 (`1.25rem`)   | Source Serif Pro   | 500 (Medium)    | `text-app-h3-mobile md:text-app-h3`     | `leading-snug`     |                                           |
| **Body**      | 16 (`1rem`)       | 16 (`1rem`)      | Inter              | 400 (Normal)    | `text-app-body`                         | `leading-cyr-text` | (1.6 ratio)                               |
| **Small**     | 14 (`0.875rem`)   | 14 (`0.875rem`)  | Inter              | 400 (Normal)    | `text-app-small`                        | `leading-5`        | (~1.43 ratio)                             |
| **Caption**   | 12 (`0.75rem`)    | 12 (`0.75rem`)   | Inter              | 400 (Normal)    | `text-app-caption`                      | `leading-4`        | (~1.33 ratio)                             |

**Key Tailwind Classes Defined in `tailwind.config.ts`:**
*   `fontSize`:
    *   `app-h1`: `3rem` (48px)
    *   `app-h1-mobile`: `2.25rem` (36px)
    *   `app-h2`: `2.25rem` (36px)
    *   `app-h2-mobile`: `1.875rem` (30px)
    *   `app-h3`: `1.5rem` (24px)
    *   `app-h3-mobile`: `1.25rem` (20px)
    *   `app-body`: `1rem` (16px)
    *   `app-small`: `0.875rem` (14px)
    *   `app-caption`: `0.75rem` (12px)
*   `fontFamily`:
    *   `sans`: `Inter` (via `var(--font-inter)`)
    *   `source-serif-pro`: `Source Serif Pro` (via `var(--font-source-serif-pro)`)
*   `fontWeight`: (Standard Tailwind, e.g., `font-normal`, `font-medium`, `font-semibold`)
*   `lineHeight`:
    *   `tight`: `1.25`
    *   `snug`: `1.375`
    *   `normal`: `1.5`
    *   `relaxed`: `1.625`
    *   `loose`: `2`
    *   `3`: `.75rem` (12px)
    *   `4`: `1rem` (16px)
    *   `5`: `1.25rem` (20px)
    *   `6`: `1.5rem` (24px)
    *   `cyr-text`: `1.6` (Custom for optimal Cyrillic body text readability)

## 2. Analysis of `Генерация теста.html`

Based on the provided HTML structure, here's an analysis of key text elements against the defined typographic system.

### 2.1. Page Header

**1. Page Title: "Генерация теста"**

*   **HTML:** `<h1 class="font-source-serif-pro md:text-app-h1 leading-tight font-semibold text-foreground">Генерация теста</h1>`
*   **Analysis:**
    *   Font family: `font-source-serif-pro` - **Correct.**
    *   Desktop size (`md:`): `text-app-h1` (48px) - **Correct.**
    *   Mobile size: Missing explicit `text-app-h1-mobile` (should be 36px). It will use browser default H1 or inherit `text-app-h1` if screen is wider than `md`.
    *   Weight: `font-semibold` (600) - **Correct.**
    *   Line height: `leading-tight` - **Correct.**
*   **Expected Classes:** `font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground`
*   **Hypothesis for Visual Discrepancy:** May appear too large on mobile screens (if inheriting desktop size) or inconsistent with other mobile H1s if it falls back to a base browser style for H1. It needs `text-app-h1-mobile`.

**2. Page Subtitle/Description:** "Выберите задания для включения в тест..."

*   **HTML:** `<p class="font-inter leading-cyr-text font-normal text-muted-foreground mt-2 mb-6">...</p>`
*   **Analysis:**
    *   Font family: `font-inter` - **Correct.**
    *   Size: Implicit. Assumed to be base paragraph size. Expected `text-app-body` (16px).
    *   Weight: `font-normal` (400) - **Correct.**
    *   Line height: `leading-cyr-text` (1.6) - **Correct.**
*   **Expected Classes:** `font-inter text-app-body leading-cyr-text font-normal text-muted-foreground ...`
*   **Hypothesis for Visual Discrepancy:** If the default paragraph size is not 16px, the text size might be slightly off. Explicitly adding `text-app-body` would ensure consistency.

### 2.2. Form Input Area (Test Name, Group, Account)

This section covers the labels and placeholder text within the first bordered card.

**1. Label: "Название теста"** (and similar labels: "Группа тестов", "Аккаунт")

*   **HTML:** `<label ... class="block text-sm font-medium text-foreground mb-1">...</label>`
*   **Analysis:**
    *   Font family: Implicit (likely `font-sans` from body). Expected `font-inter`.
    *   Size: `text-sm` (14px) - **Correct.** (Matches `text-app-small` size).
    *   Weight: `font-medium` (500) - **Incorrect.** `text-app-small` is defined with `font-normal` (400).
    *   Line height: Implicit. Expected `leading-5` for `text-app-small`.
*   **Expected Classes:** `font-inter text-app-small leading-5 font-normal text-foreground ...`
*   **Hypothesis for Visual Discrepancy:** Labels will appear slightly bolder (`font-medium` vs `font-normal`) than the standard `app-small` style. Line height might be inconsistent if not matching `leading-5`.

**2. Placeholder Text in Dropdowns:** (e.g., "-- Выберите --", "-- Выберите аккаунт --")

*   **HTML (Button):** `<button ... class="... text-sm ..."><span style="pointer-events: none;">TEXT</span>...</button>`
*   **Analysis (for the text via `span` inheriting from button):**
    *   Font family: Implicit (likely `font-sans` from body). Expected `font-inter`.
    *   Size: `text-sm` (14px) from button - **Correct.** (Matches `text-app-small` size).
    *   Weight: Implicit (likely `font-normal` unless overridden by button styles not shown or inherited `font-medium`). `text-app-small` uses `font-normal` (400).
    *   Line height: Implicit. Expected `leading-5` for `text-app-small`.
*   **Expected Classes (for the span or button):** `font-inter text-app-small leading-5 font-normal ...`
*   **Hypothesis for Visual Discrepancy:** If the text inherits or defaults to `font-normal`, the weight is correct. If it inherits `font-medium` (e.g. from a general button style), it would be too bold for `app-small`. Line height may be inconsistent.

### 2.3. Text Block ("М.С. Строганов о судьбе поколения")

**1. Title: "М.С. Строганов о судьбе поколения"**

*   **HTML:** `<div class="font-source-serif-pro text-app-h2-mobile md:text-app-h2 font-semibold leading-tight">М.С. Строганов о судьбе поколения</div>`
*   **Analysis:**
    *   Font family: `font-source-serif-pro` - **Correct.**
    *   Mobile size: `text-app-h2-mobile` (30px) - **Correct.**
    *   Desktop size (`md:`): `text-app-h2` (36px) - **Correct.**
    *   Weight: `font-semibold` (600) - **Correct.**
    *   Line height: `leading-tight` - **Correct.**
*   **Expected Classes:** Already correct as per H2 definition.
*   **Hypothesis for Visual Discrepancy:** None. Should appear as a correctly styled H2.

**2. Subtitle: "Текст для выполнения заданий ЕГЭ"**

*   **HTML:** `<div class="text-sm text-muted-foreground">Текст для выполнения заданий ЕГЭ</div>`
*   **Analysis:**
    *   Font family: Implicit (likely `font-sans`). Expected `font-inter`.
    *   Size: `text-sm` (14px) - **Correct.** (Matches `text-app-small` size).
    *   Weight: Implicit (likely `font-normal`). `text-app-small` uses `font-normal` (400).
    *   Line height: Implicit. Expected `leading-5`.
*   **Expected Classes:** `font-inter text-app-small leading-5 font-normal text-muted-foreground`
*   **Hypothesis for Visual Discrepancy:** Main issue would be if the implicit font weight is not `font-normal`. Line height might be inconsistent. Adding explicit classes `font-inter text-app-small leading-5 font-normal` is recommended.

**3. Main Content Body Text:** (e.g., "(1)Судьбу поколения неслучайно сравнивают...")

*   **HTML (Containing Div):** `<div ... class="... text-base whitespace-pre-line ...">TEXT</div>`
*   **Analysis (for the text content):**
    *   Font family: Implicit (likely `font-sans`). Expected `font-inter`.
    *   Size: `text-base` (16px) - **Correct.** (Matches `text-app-body` size).
    *   Weight: Implicit (likely `font-normal`). `text-app-body` uses `font-normal` (400).
    *   Line height: Implicit. Expected `leading-cyr-text` (1.6).
*   **Expected Classes (on the div or if text was in `<p>` tags):** `font-inter text-app-body leading-cyr-text font-normal`
*   **Hypothesis for Visual Discrepancy:** The text will likely use Inter if inherited from body, which is good. However, the **major missing piece is `leading-cyr-text`**. Without it, the line spacing will not be optimized for Cyrillic and may appear too tight or use a default that's not ideal. It should explicitly use `font-inter text-app-body leading-cyr-text font-normal`.

### 2.4. Tab Navigation and "Упражнения" Section Header

**1. Tab Button Text:** (e.g., "По заданиям", "Формат ЕГЭ", "Упражнения")

*   **HTML:** `<button ... class="... text-sm font-medium ...">TEXT</button>`
*   **Analysis:**
    *   Font family: Implicit (likely `font-sans`). Expected `font-inter`.
    *   Size: `text-sm` (14px) - **Correct.** (Matches `text-app-small` size).
    *   Weight: `font-medium` (500) - **Incorrect.** `text-app-small` is defined with `font-normal` (400).
    *   Line height: Implicit. Expected `leading-5`.
*   **Expected Classes:** `font-inter text-app-small leading-5 font-normal ...` (plus existing color/state classes).
*   **Hypothesis for Visual Discrepancy:** Tab text will appear bolder (`font-medium`) than standard `app-small`. Line height may be inconsistent.

**2. Section Title in "Упражнения" Tab: "Упражнения"**

*   **HTML:** `<h2 class="font-source-serif-pro text-xl font-semibold text-foreground mb-4">Упражнения</h2>`
*   **Analysis:**
    *   Font family: `font-source-serif-pro` - **Correct.**
    *   Size: `text-xl` (20px, from default Tailwind) - **Incorrect.** Should be H2 (`text-app-h2-mobile md:text-app-h2` - 30px/36px).
    *   Weight: `font-semibold` (600) - **Correct.**
    *   Line height: Implicit. Expected `leading-tight` for H2.
*   **Expected Classes:** `font-source-serif-pro text-app-h2-mobile md:text-app-h2 font-semibold leading-tight text-foreground ...`
*   **Hypothesis for Visual Discrepancy:** This title will appear significantly smaller than a standard H2 (20px vs 30px/36px) and will not match other H2s like "М.С. Строганов...". Line height might be inconsistent.

**3. Description under "Упражнения" H2: "Выберите упражнения для включения в тест:"**

*   **HTML:** `<p class="text-sm text-muted-foreground mb-6">...</p>`
*   **Analysis:**
    *   Font family: Implicit (likely `font-sans`). Expected `font-inter`.
    *   Size: `text-sm` (14px) - **Correct.** (Matches `text-app-small` size).
    *   Weight: Implicit (likely `font-normal`). `text-app-small` uses `font-normal` (400).
    *   Line height: Implicit. Expected `leading-5`.
*   **Expected Classes:** `font-inter text-app-small leading-5 font-normal text-muted-foreground ...`
*   **Hypothesis for Visual Discrepancy:** This should appear as `app-small`. If implicit font is not Inter or weight is not normal, it will be off. Explicit classes are better.

### 2.5. "Упражнения" Tab Content Details

**1. Category Titles: "Орфография", "Пунктуация"**

*   **HTML:** `<h3 class="font-source-serif-pro text-lg font-medium text-foreground mb-4">Орфография</h3>`
*   **Analysis:**
    *   Font family: `font-source-serif-pro` - **Correct.**
    *   Size: `text-lg` (18px, from default Tailwind) - **Incorrect.** Should be H3 (`text-app-h3-mobile md:text-app-h3` giving 20px/24px).
    *   Weight: `font-medium` (500) - **Correct** (Matches H3 definition).
    *   Line height: Implicit. Expected `leading-snug` for H3.
*   **Expected Classes:** `font-source-serif-pro text-app-h3-mobile md:text-app-h3 font-medium leading-snug text-foreground ...`
*   **Hypothesis for Visual Discrepancy:** Titles will appear smaller (18px) than the defined H3 sizes (20px mobile, 24px desktop). Line height might be inconsistent.

**2. Collapsible Section Titles:** (e.g., "Правила, №12, Правописание НЕ и НИ")

*   **HTML:** `<h4 class="font-source-serif-pro font-medium text-foreground">Правила, №12, Правописание НЕ и НИ</h4>`
*   **Analysis:**
    *   Font family: `font-source-serif-pro` - **Incorrect.** For non-H1/H2/H3 titles/labels, `font-inter` is expected.
    *   Size: Implicit (no `text-size` class). If inherits `text-base` (16px), it's `app-body` size. If `text-sm` (14px), it's `app-small` size.
    *   Weight: `font-medium` (500) - **Potentially incorrect.** If considered body/small, this is too heavy (`font-normal` expected).
    *   Line height: Implicit.
*   **Recommendation & Hypothesis:** This styling is ambiguous. It uses H4 tag but with `font-source-serif-pro` and `font-medium` without explicit size. This is likely inconsistent.
    *   If it should be **distinct small heading/label (Recommended)**: `font-inter text-app-small font-medium leading-5 text-foreground` (14px, Inter Medium, specific line height). This gives emphasis but uses Inter.
    *   If it should be **standard body text (less likely for a title)**: `font-inter text-app-body font-normal leading-cyr-text`.
    *   **Visual Discrepancy:** Likely looks out of place due to `Source Serif Pro` on a small, non-H1/H2/H3 element, and `font-medium` might make it too heavy depending on its rendered size.

**3. Item Titles within Collapsible Sections:** (e.g., "1. Слитное/раздельное написание НЕ с глаголами...")

*   **HTML:** `<div class="jsx-c696041180d24c76 font-sans text-base font-medium text-foreground ...">1. Слитное/раздельное...</div>`
*   **Analysis:**
    *   Font family: `font-sans` (Inter) - **Correct.**
    *   Size: `text-base` (16px) - **Correct** (Matches `app-body` size).
    *   Weight: `font-medium` (500) - **Incorrect.** Our system defines `app-body` (and these titles specifically as per previous discussion) as `font-normal` (400).
    *   Line height: Implicit. Expected `leading-cyr-text` for `app-body`.
*   **Expected Classes:** `font-sans text-app-body font-normal leading-cyr-text text-foreground ...`
*   **Hypothesis for Visual Discrepancy:** These titles will appear bolder (`font-medium`) than the intended `font-normal` for body text. Line height might be inconsistent if not `leading-cyr-text`. This suggests a previous fix to `TaskCardBlock.tsx` might not be in effect here or this is a different component.

### 2.6. Fixed Bottom Panel (Progress Bar Area)

**1. Label Text: "Выбрано заданий:"**

*   **HTML:** `<span class="text-app-caption font-normal text-muted-foreground">Выбрано заданий:</span>`
*   **Analysis:**
    *   Font family: Implicit (likely `font-sans`). Expected `font-inter` to be part of `text-app-caption` or applied separately.
    *   Size: `text-app-caption` (12px) - **Correct.**
    *   Weight: `font-normal` (400) - **Correct.**
    *   Line height: Implicit. Expected `leading-4` to be part of `text-app-caption` or applied separately.
*   **Expected Classes:** `font-inter text-app-caption leading-4 font-normal text-muted-foreground`
*   **Hypothesis for Visual Discrepancy:** Size and weight are likely correct. Font family (Inter) and line height (`leading-4`) should be ensured, ideally by the `text-app-caption` utility or by adding them explicitly.

**2. Value Text: "0 / 50"**

*   **HTML:** `<span class="text-app-caption font-semibold text-primary">0 / 50</span>`
*   **Analysis:**
    *   Font family: Implicit (likely `font-sans`). Expected `font-inter`.
    *   Size: `text-app-caption` (12px) - **Correct.**
    *   Weight: `font-semibold` (600) - **Incorrect** for base `app-caption` style (which is `font-normal`). This is an emphasized caption.
    *   Line height: Implicit. Expected `leading-4`.
*   **Expected Classes (for an intentionally emphasized caption):** `font-inter text-app-caption leading-4 font-semibold text-primary`
*   **Hypothesis for Visual Discrepancy:** Will appear bolder than standard caption text due to `font-semibold`. This may be intentional. Font family and line height concerns are similar to the label above. If the goal is consistency with `app-caption` but only color and weight change, the base `font-inter` and `leading-4` are still important.

---

## 3. Summary of Potential Issues & Recommendations

Based on the HTML analysis:

1.  **Missing Mobile Sizes:** The main H1 (`<h1>Генерация теста</h1>`) is missing its `text-app-h1-mobile` class.
2.  **Incorrect Heading Sizes:**
    *   The H2 "Упражнения" uses `text-xl` instead of `text-app-h2-mobile md:text-app-h2`.
    *   H3s like "Орфография" use `text-lg` instead of `text-app-h3-mobile md:text-app-h3`.
3.  **Incorrect Font Weights:**
    *   Form labels (`<label>`) use `font-medium` but should use `font-normal` for `app-small` style.
    *   Tab button text uses `font-medium` but should use `font-normal` for `app-small` style.
    *   Item titles (like "1. Слитное/раздельное...") use `font-medium` but should be `font-normal` for `app-body` style (this was a previous fix, might be a regression or different component source).
4.  **Ambiguous Styling for H4:** The `<h4>Правила, №12...</h4>` uses `font-source-serif-pro` and `font-medium` without a text size. This needs clarification. Recommendation is to use `font-inter text-app-small font-medium leading-5` if it's a sub-label/title.
5.  **Missing Explicit Line Heights & Font Families:**
    *   Many elements relying on implicit line heights should have explicit classes (e.g., `leading-cyr-text` for body, `leading-5` for small, `leading-4` for caption).
    *   Crucially, the main text block ("(1)Судьбу поколения...") is missing `leading-cyr-text`.
    *   Elements intended to be `Inter` often rely on inheritance; explicit `font-inter` (or `font-sans`) is safer where specific Inter styling is part of the typographic level (Body, Small, Caption).

**General Recommendation:** Review all listed elements and update their classes to precisely match the defined typographic system tokens for font family, size (including mobile), weight, and line height. This will ensure visual consistency with the design goals.

## 4. UX Design Review & Synthesis with Screenshot Feedback (Desktop)

This section incorporates the user's direct feedback from screenshots and offers a broader UX perspective on the typography of the "Генерация теста" page, focusing on the desktop view as requested.

### 4.1. Addressing Screenshot Feedback

Based on the provided screenshots and annotations:

1.  **Bottom Panel Text ("Выбрано заданий:" and "0 / 50")**
    *   **Observation:** Currently 12px (`text-app-caption`). "0/50" is also `font-semibold`.
    *   **User Feedback:** Both text elements should be significantly larger, at least 16px.
    *   **UX Takeaway:** The 12px caption size is perceived as too small for this functional summary area. This is a **design recommendation** to change the typographic level for these elements, possibly to `app-small` (14px) or `app-body` (16px), rather than a bug in applying the current `app-caption` spec.

2.  **Main Text Block Content (e.g., "(1)Судьбу поколения...")**
    *   **Observation:** Rendered at 15px (HTML has `text-base` for 16px), Inter 400. Line height appears correct (1.6 ratio).
    *   **User Feedback:** Desired size is 14px (`text-app-small`).
    *   **UX Takeaway:** The 1px discrepancy is minor. The key feedback is a **design recommendation** to use `text-app-small` (14px) for this specific text block, diverging from the general `app-body` (16px) if that was the original intent. Consideration for `leading-cyr-text` remains crucial for readability if the size changes.

3.  **Item Titles (e.g., "№1. Средства связи...")**
    *   **Observation:** Rendered at 16px, Inter 500 (`font-medium`).
    *   **User Feedback:** Weight is too heavy (appears like semibold), should be `font-normal`.
    *   **UX Takeaway:** This is a **confirmed bug** against our agreed style for these items (which should be `app-body` with `font-normal`). The `font-medium` class needs to be changed to `font-normal`.

4.  **Form Labels (e.g., "Название теста")**
    *   **Observation:** Rendered at 14px, Inter 500 (`font-medium`).
    *   **User Feedback:** Implied this is part of general font issues.
    *   **UX Takeaway:** This is a **confirmed bug**. Labels are `text-app-small` (14px) but incorrectly use `font-medium` instead of the specified `font-normal`.

5.  **Subtitle under H2 "М.С. Строганов..." ("Текст для выполнения заданий ЕГЭ")**
    *   **Observation:** Rendered at 14px (`text-sm`), Inter 400.
    *   **User Feedback:** Desired size is 16px (`text-app-body`).
    *   **UX Takeaway:** This is a **design recommendation** to elevate this subtitle from `app-small` to `app-body`.

### 4.2. Broader UX Typographic Observations (Desktop)

Beyond the specific screenshot points, looking at the overall page structure from the HTML:

*   **Hierarchy Breaks:**
    *   The H1 "Генерация теста" is correctly prominent (assuming mobile class fix from section 2.1). The main H2 "М.С. Строганов о судьбе поколения" is also correctly styled.
    *   However, the subsequent section title "Упражнения" in the tab panel is styled with `text-xl` (20px) but is semantically an `<h2>`. This creates a visual inconsistency and diminishes its hierarchical importance compared to other H2s. It **should be `text-app-h2-mobile md:text-app-h2`**.
    *   Similarly, category titles like "Орфография" (an `<h3>`) use `text-lg` (18px). These also break the established H3 style (`text-app-h3-mobile md:text-app-h3` - 20px/24px) and should be updated.

*   **Ambiguous `<h4>` Styling:**
    *   The `<h4>` elements (e.g., "Правила, №12, Правописание НЕ и НИ") using `font-source-serif-pro` and `font-medium` without a specific size create confusion. They don't align with the Inter-based body/small text styles or the Source Serif Pro H1-H3 styles.
    *   **UX Recommendation:** For clarity and consistency, these should likely be restyled. If they are titles for clickable/expandable items, using `font-inter text-app-small font-medium leading-5` (as suggested in 2.5) would provide emphasis while maintaining family consistency with other UI text. Alternatively, if less emphasis is needed, `font-inter text-app-small font-normal leading-5`.

*   **Readability & Clarity:**
    *   **Main Text Block:** The most critical issue for the main text content (e.g., "(1)Судьбу поколения...") is ensuring it uses `leading-cyr-text`. The size (16px vs. user preference for 14px) is a design choice to be finalized.
    *   **Item Titles:** Correcting these from `font-medium` to `font-normal` will significantly improve scannability and align them with standard text expectations.

*   **Consistency in Interactive Elements:**
    *   **Form Labels & Tab Texts:** These use `font-medium` where `font-normal` is specified for their `app-small` level. Fixing this will improve overall visual consistency for smaller interactive text.

### 4.3. Limitations

This UX review is based on:
*   The HTML content of `Генерация теста.html` (primarily the structure and the "Упражнения" tab's visible content).
*   The user-provided screenshots and annotations.
*   I do not have visibility into the content or styling of the other two tabs ("По заданиям", "Формат ЕГЭ") beyond the tab buttons themselves.
*   Mobile responsiveness issues are acknowledged but not deeply analyzed here, per user focus on desktop.

### 4.4. Revised Recommendations (UX-Informed)

1.  **Immediate Bug Fixes (Align with current spec where screenshot confirms error):**
    *   **Item Titles** (e.g., "№1. Средства связи..."): Change `font-medium` to `font-normal`. Ensure `leading-cyr-text` (or `leading-6` for 16px) and `font-inter` (likely `font-sans`). Class should be `font-sans text-app-body font-normal leading-cyr-text`.
    *   **Form Labels** (e.g., "Название теста"): Change `font-medium` to `font-normal`. Ensure `font-inter` and `leading-5`. Class should be `font-inter text-app-small font-normal leading-5`.
    *   **Tab Text:** Change `font-medium` to `font-normal`. Ensure `font-inter` and `leading-5`. Class should be `font-inter text-app-small font-normal leading-5`.
    *   **H2 "Упражнения"**: Change `text-xl` to `text-app-h2-mobile md:text-app-h2` and add `leading-tight`.
    *   **H3 "Орфография" / "Пунктуация"**: Change `text-lg` to `text-app-h3-mobile md:text-app-h3` and add `leading-snug`.
    *   **Main H1 "Генерация теста"**: Add `text-app-h1-mobile` for responsive sizing.
    *   **Main Text Block Content:** Ensure `font-inter text-app-body leading-cyr-text font-normal` if 16px is chosen. If 14px is chosen (see point 2), use `font-inter text-app-small leading-5 font-normal`.

2.  **Address Design Change Requests (Requires updating spec/components):**
    *   **Bottom Panel Text ("Выбрано заданий:" & "0 / 50"):** Consider changing from `app-caption` (12px) to `app-small` (14px) or `app-body` (16px). Adjust weight for "0/50" as needed (e.g. `font-semibold` is fine if text is larger).
    *   **Main Text Block Content Size:** Decide if this should be `app-body` (16px) or `app-small` (14px, per user screenshot note). Update classes accordingly.
    *   **Subtitle "Текст для выполнения заданий ЕГЭ"**: Decide if this should be `app-small` (14px) or `app-body` (16px, per user screenshot note). Update classes.

3.  **Styling Clarification & Refinement:**
    *   **`<h4>` elements ("Правила, №12..."):** Define a clear, consistent style. Recommended: `font-inter text-app-small font-medium leading-5` for a slightly emphasized label, or `font-normal` if less emphasis is needed. Update classes on these elements.

4.  **Ensure Explicit Font Family and Line Heights:** For all typographic elements, explicitly include the font family (`font-inter` or `font-source-serif-pro` as appropriate) and the correct line height utility (`leading-...`) rather than relying on inheritance, to guarantee consistency. 