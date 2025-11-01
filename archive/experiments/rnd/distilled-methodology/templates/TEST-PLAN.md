# TEST PLAN — [Feature/Component]

**Task ID:** [PREFIX-###]  
**Contract:** CONTRACT-[NAME]-[NNN]  
**Owner:** @user  
**Date:** [YYYY-MM-DD]

---

## 1. Goals & Risks

- Business goals this test plan protects
- Key risks (UI breakage, a11y, perf, cross-browser)
- Refactor sensitivity (how likely code changes will break tests)

---

## 2. User Scenarios (Given/When/Then)

- Scenario 1
- Scenario 2
- Edge case

Map each scenario to acceptance criteria in the contract.

---

## 3. Coverage Matrix

| Area | What to verify | Test type | Stories | Notes |
|------|-----------------|-----------|---------|-------|
| API/Props | Required/optional props, defaults | Unit/Contract | — | From contract |
| Variants | CVA variants render/compose | Unit/Story | Primary, Secondary | |
| Interactions | Click/keyboard/focus | Story interaction | Primary | |
| A11y | Roles, names, tab order | a11y check | All stories | axe |
| Visual | Critical states look correct | Visual regression | *.critical | limit scope |

---

## 4. Visual Coverage (Critical Only)

List stories requiring visual snapshots:
- Component.critical.stories.tsx — Primary
- Component.critical.stories.tsx — Disabled

---

## 5. Test Artifacts

- Unit/Contract tests: `path/to/*.test.ts[x]`
- Story interaction tests: `path/to/*.stories.tsx`
- Visual snapshots: Chromatic/Playwright config

---

## 6. A11y Requirements

- No critical axe violations
- Keyboard access for all interactive elements
- Proper ARIA where applicable

---

## 7. Maintenance Budget

- Cost expectation: low | medium | high
- Known brittle areas and mitigation
- Deletion criteria for tests (when to remove/downgrade)

---

## 8. Exit Criteria (DoD — Testing)

- [ ] Acceptance criteria covered by tests
- [ ] Story interaction tests pass
- [ ] Visual snapshots for critical states pass
- [ ] A11y checks pass
- [ ] Traceability matrix updated (Test_Files, Visual_Coverage, A11y_Checked)
