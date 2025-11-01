# Master Backlog — [Project Name]

> One task — one row.  
> Primary = module owning implementation. Affected = other modules touched.

**Last Updated:** [ISO8601]

---

<!-- SPRINT_FOCUS_[DATE] -->
## Sprint Focus — [Sprint Goal]

| Order | ID | Title | Status | Notes |
|-------|----|----|--------|-------|
| 1 | BUG-050 | Fix hardcoded colors in components | **IN_PROGRESS** | 🔴 Blocking THM-001, THM-002 |
| 2 | TOK-003 | Generate CSS variables from tokens | **IN_PROGRESS** | 🔺 Required by BUG-050 |
| 3 | CMP-002 | Implement Button with CVA variants | **TODO** | 🔺 Depends on TOK-003 |
| 4 | THM-001 | Implement ThemeProvider | **TODO** | ⛔ Blocked by BUG-050 |

---

## Master Task List

**Conventions:**
- Status: `DONE` | `IN_PROGRESS` | `TODO` | `BLOCKED` | `BACKLOG` | `IDEA` | `DEFERRED`
- Priority: `P0` (Critical) | `P1` (High) | `P2` (Medium) | `P3` (Low)
- Dependencies: `🔺 Depends on` | `🔴 Blocks` | `⛔ Blocked by`

| ID | Priority | Title | Status | Primary | Affected | Dependencies |
|----|----------|-------|--------|---------|----------|--------------|
| **EPIC-TOKENS** | **EPIC** | Design Token System | IN_PROGRESS | Design-System | All-Modules | |
| TOK-001 | P0 | Create tokens.json schema | **DONE** | Design-System | | |
| TOK-002 | P1 | Validate tokens against schema | **DONE** | Design-System | | 🔺 TOK-001 |
| TOK-003 | P1 | Generate CSS from tokens | **IN_PROGRESS** | Design-System | Tailwind | 🔺 TOK-002 |
| TOK-004 | P2 | Add missing breakpoints & z-index | TODO | Design-System | | 🔺 TOK-003 |
| TOK-005 | P2 | Token validation CI check | TODO | Design-System | DevOps | 🔺 TOK-002 |
| **EPIC-COMPONENTS** | **EPIC** | Component Library | TODO | Components | | |
| CMP-001 | P1 | Create Button component contract | **DONE** | Components | | |
| CMP-002 | P1 | Implement Button with CVA variants | TODO | Components | | 🔺 TOK-003, CMP-001 |
| CMP-003 | P2 | Add Button Storybook stories | TODO | Components | Storybook | 🔺 CMP-002 |
| CMP-004 | P2 | Create Card component | BACKLOG | Components | | 🔺 TOK-003 |
| **EPIC-THEME** | **EPIC** | Theme System (Light/Dark) | TODO | Theme | | |
| THM-001 | P1 | Implement ThemeProvider | TODO | Theme | | 🔺 TOK-003 | ⛔ BUG-050 |
| THM-002 | P1 | Add dark mode CSS variables | TODO | Theme | Design-System | 🔺 TOK-003 | ⛔ BUG-050 |
| THM-003 | P2 | Update components for dark mode | TODO | Theme | Components | 🔺 THM-001, THM-002, CMP-002 |
| THM-004 | P3 | Theme persistence (localStorage) | BACKLOG | Theme | | 🔺 THM-001 |
| **BUGS & CRITICAL** | | | | | | |
| BUG-050 | P0 | Fix hardcoded colors in components | **IN_PROGRESS** | Components | Design-System | 🔺 TOK-003 | 🔴 Blocks: THM-001, THM-002, THM-003 |
| BUG-051 | P1 | Theme flash on page load (FOUC) | TODO | Theme | | 🔺 THM-001 |
| BUG-052 | P2 | Inconsistent spacing in mobile | BACKLOG | Components | | |
| **INFRASTRUCTURE** | | | | | | |
| INF-010 | P1 | Setup Storybook with theme addon | TODO | Storybook | DevOps | 🔺 THM-001 |
| INF-011 | P2 | Add visual regression tests | BACKLOG | QA | Storybook | 🔺 INF-010 |

---

## Dependency Graph (Current Sprint)

```
TOK-003 (CSS Gen) 🔄
  ├─→ BUG-050 (Fix hardcoded) 🔄  [Blocks: THM-001, THM-002, THM-003]
  ├─→ CMP-002 (Button) ⏳
  └─→ THM-001 (ThemeProvider) ⛔ [Blocked by BUG-050]
        └─→ THM-002 (Dark CSS) ⛔ [Blocked by BUG-050]
```

**Legend:** ✅ Done | 🔄 In Progress | ⏳ Pending | ⛔ Blocked | 🔴 Blocks others

---

## Critical Issues Summary

### 🔥 BUG-050: Hardcoded Colors (P0)
**Status:** IN_PROGRESS | **Owner:** @bob  
**Issue:** 12 instances of hardcoded hex colors preventing theme system.  
**Blocks:** THM-001, THM-002, THM-003  
**Detail:** See `tasks/BUG-050.md` | **Tasklog:** `logs/2025-01-06-bug-050.md`

---

## Related Files

- **Task Details:** `tasks/TASK-[ID].md` (contracts, acceptance criteria, implementation plans)
- **Daily Logs:** `logs/[DATE]-tasklog.md` (work done, decisions, blockers)
- **Contracts:** `contracts/CONTRACT-[NAME]-001.yml`
- **Traceability:** `traceability-matrix.csv` (task → contract → implementation)
- **Reports:** `artifacts/[DATE]-sprint-report.md`

---

**Last Review:** [DATE] | **Next Review:** [DATE] | **Maintained by:** [Team]
