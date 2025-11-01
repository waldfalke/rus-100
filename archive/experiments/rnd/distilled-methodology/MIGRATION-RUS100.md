# Migration Guide — rus100 Project

**Goal:** Integrate task management system into rus100 without disrupting existing work.

**Time Required:** 1-2 hours initial setup

---

## Current State

rus100 already has:
- ✅ Contract-driven development (CONTRACT-REGISTRY.md)
- ✅ Design tokens system
- ✅ Component library with shadcn/ui
- ✅ Storybook integration
- ❌ Task management system (backlog, tasks, logs, traceability)

---

## Migration Steps

### Step 1: Copy Methodology (5 min)

```bash
# In rus100 project root
mkdir -p .methodology
cp -r ../fit-lead-test-assignment/rnd/distilled-methodology/* .methodology/

# Or create symlink
ln -s ../fit-lead-test-assignment/rnd/distilled-methodology .methodology
```

---

### Step 2: Create Task Management Structure (5 min)

```bash
# In rus100 project root
mkdir -p tasks
mkdir -p logs
touch master-backlog.md
touch traceability-matrix.csv
```

---

### Step 3: Initialize Master Backlog (15 min)

Create `master-backlog.md` based on existing contracts:

```markdown
# Master Backlog — rus100

> One task — one row.  
> Primary = module owning implementation. Affected = other modules touched.

**Last Updated:** 2025-10-08

---

## Sprint Focus — Design System Foundation

| Order | ID | Title | Status | Notes |
|-------|----|----|--------|-------|
| 1 | TOK-010 | Complete token migration audit | IN_PROGRESS | 60% done |
| 2 | CMP-015 | Migrate remaining components to tokens | TODO | 🔺 TOK-010 |
| 3 | STY-008 | Fix high-specificity CSS overrides | TODO | 🔴 Blocking theme |

---

## Master Task List

| ID | Priority | Title | Status | Primary | Affected | Dependencies |
|----|----------|-------|--------|---------|----------|--------------|
| **EPIC-TOKENS** | **EPIC** | Design Token System | IN_PROGRESS | Design-System | All-Modules | |
| TOK-001 | P1 | Base tokens implementation | DONE | Design-System | | |
| TOK-002 | P1 | Semantic tokens implementation | DONE | Design-System | | 🔺 TOK-001 |
| TOK-003 | P1 | Component tokens implementation | DONE | Design-System | | 🔺 TOK-002 |
| TOK-010 | P1 | Complete token migration audit | IN_PROGRESS | Design-System | | 🔺 TOK-003 |
| **EPIC-COMPONENTS** | **EPIC** | Component Library | IN_PROGRESS | Components | | |
| CMP-001 | P1 | shadcn/ui integration | DONE | Components | | |
| CMP-015 | P2 | Migrate components to tokens | TODO | Components | Design-System | 🔺 TOK-010 |
| **EPIC-STORYBOOK** | **EPIC** | Storybook Integration | IN_PROGRESS | Storybook | | |
| STB-001 | P1 | Storybook setup | DONE | Storybook | DevOps | |
| STB-002 | P2 | Token preview addon | TODO | Storybook | Design-System | |
| **EPIC-TYPOGRAPHY** | **EPIC** | Typography System | DONE | Design-System | | |
| TYP-001 | P1 | Source Serif Pro + Inter setup | DONE | Design-System | | |
```

---

### Step 4: Create Retroactive Task Files (30 min)

For DONE tasks from CONTRACT-REGISTRY.md, create retroactive task files:

**Example: `tasks/TOK-001.md`**

```markdown
# TOK-001: Base Tokens Implementation

**Contract:** TD-IMP-002  
**Epic:** EPIC-TOKENS  
**Status:** DONE  
**Completed:** 2025-10-01 (retroactive)  
**Owner:** @team

## Overview (Retroactive)

Implemented base token layer for colors, typography, spacing, shadows, and radii.

**Note:** This task was completed before task management system was introduced. 
Created retroactively for traceability.

## Acceptance Criteria

- [x] Base color tokens defined
- [x] Typography tokens (font families, sizes, weights)
- [x] Spacing scale tokens
- [x] Shadow tokens
- [x] Border radius tokens

## Implementation Files

- `design-system/tokens/base/colors.json`
- `design-system/tokens/base/typography.json`
- `design-system/tokens/base/spacing.json`
- `design-system/tokens/base/shadows.json`
- `design-system/tokens/base/radii.json`

## Validation

✅ Verified: All base tokens accessible via Tailwind  
✅ Verified: Token build script working  
✅ Verified: CSS variables generated correctly

## Notes

Part of initial design system setup. See CONTRACT-REGISTRY.md TD-IMP-002 for full contract.
```

---

### Step 5: Initialize Traceability Matrix (15 min)

Create `traceability-matrix.csv`:

```csv
Task_ID,Contract_ID,Epic_ID,Implementation_Files,Test_Files,Documentation,Status,Last_Verified,Notes
TOK-001,TD-IMP-002,EPIC-TOKENS,"design-system/tokens/base/*.json","","README-DesignTokens.md",DONE,2025-10-08,Retroactive - base tokens
TOK-002,TD-IMP-003,EPIC-TOKENS,"design-system/tokens/themes/*.json","","README-DesignTokens.md",DONE,2025-10-08,Retroactive - semantic tokens
TOK-003,TD-IMP-004,EPIC-TOKENS,"design-system/tokens/components/*.json","","README-DesignTokens.md",DONE,2025-10-08,Retroactive - component tokens
CMP-001,TD-COMP-001,EPIC-COMPONENTS,"components.json,components/ui/*","","docs/components.md",DONE,2025-10-08,Retroactive - shadcn/ui setup
STB-001,Storybook-Integration-Contract,EPIC-STORYBOOK,".storybook/*","","project-docs/contracts/storybook/",DONE,2025-10-08,Retroactive - Storybook setup
TYP-001,typography-contract-rus100,EPIC-TYPOGRAPHY,"styles/fonts.css,tailwind.config.ts","","typography_analysis_report.md",DONE,2025-10-08,Retroactive - typography system
```

---

### Step 6: Install Scripts (5 min)

```bash
# Copy scripts to project (or use from .methodology/)
cp .methodology/scripts/validate-backlog.js scripts/
cp .methodology/scripts/validate-traceability.js scripts/
cp .methodology/scripts/find-orphaned-tasks.js scripts/

# Or add to package.json
npm pkg set scripts.validate:backlog="node scripts/validate-backlog.js"
npm pkg set scripts.validate:traceability="node scripts/validate-traceability.js"
npm pkg set scripts.find:orphaned="node scripts/find-orphaned-tasks.js"
```

---

### Step 7: Validate Setup (5 min)

```bash
# Validate backlog
node scripts/validate-backlog.js master-backlog.md

# Validate traceability
node scripts/validate-traceability.js traceability-matrix.csv

# Find any orphans
node scripts/find-orphaned-tasks.js
```

**Expected:** All validations pass, no errors.

---

### Step 8: Create First Real Task (10 min)

Now create your FIRST new task using the system:

**In `master-backlog.md`:**
```markdown
| TOK-010 | P1 | Complete token migration audit | TODO | Design-System | | 🔺 TOK-003 |
```

**Create `tasks/TOK-010.md`:**
```markdown
# TOK-010: Complete Token Migration Audit

**Contract:** TD-PREP-001, TD-BUG-001  
**Epic:** EPIC-TOKENS  
**Status:** TODO  
**Owner:** @you  
**Created:** 2025-10-08

## Overview

Complete audit of all components to identify remaining hardcoded values and 
high-specificity CSS that needs migration to tokens.

## Acceptance Criteria

- [ ] All components scanned for hardcoded colors/spacing
- [ ] List of high-specificity CSS overrides documented
- [ ] Migration plan created for each violation
- [ ] Prioritized list of components to fix

## Implementation Plan

1. Run token validator: `pnpm build:tokens && node scripts/validate-tokens.js`
2. Scan components/ directory for @token-status comments
3. Document findings in token-audit-registry.md
4. Create follow-up tasks for each component needing migration

## Validation

- [ ] Token validator reports <5 violations
- [ ] All components have @token-status annotation
- [ ] Audit registry updated

## Dependencies

🔺 TOK-003 (Component tokens must be complete first)

## Related Contracts

- TD-PREP-001: Implementation Preparation
- TD-BUG-001: Token Application Fix
```

**Start work:**
```markdown
# Update backlog status
| TOK-010 | P1 | Complete token migration audit | IN_PROGRESS | Design-System | | 🔺 TOK-003 |
```

**Create `logs/2025-10-08-tasklog.md`:**
```markdown
# Task Log — 2025-10-08

**Developer:** @you  
**Sprint:** Foundation Sprint  
**Focus:** TOK-010

---

## Work Summary

**Hours Logged:** 2h  
**Primary Task:** TOK-010  
**Status Change:** TODO → IN_PROGRESS

---

## Tasks Worked On

### TOK-010: Complete Token Migration Audit
**Time:** 2h  
**Status:** TODO → IN_PROGRESS (30% complete)

**What was done:**
- Set up task management system (backlog, tasks, logs)
- Created retroactive tasks for completed work
- Started component scan for hardcoded values
- Found 12 components with @token-status: partial

**What's next:**
- Complete component scan
- Document findings in audit registry
- Create follow-up tasks

**Blockers:** None

---

## Tomorrow's Plan

1. Finish component scan (2h)
2. Update audit registry (1h)
3. Create CMP-015 task for component migration (30min)
```

---

## Daily Workflow (Going Forward)

### Morning (5 min)
1. Check `master-backlog.md` Sprint Focus
2. Review yesterday's tasklog
3. Plan today's tasks

### During Work
1. Work on task
2. Document decisions in tasklog
3. Update task status in backlog if changed

### End of Day (10 min)
1. Create/update `logs/[DATE]-tasklog.md`
2. Update task progress in backlog
3. Commit: `feat(TOK-010): scan 12 components for token usage`

### Task Completion
1. Mark DONE in backlog
2. Update task file with completion notes
3. Add entry to traceability-matrix.csv
4. Run validations

---

## Integration with Existing Workflow

### Contracts
**Keep:** CONTRACT-REGISTRY.md as is  
**Add:** Reference contract IDs in task files

### Storybook
**Keep:** .stories.tsx files  
**Add:** Link stories in traceability matrix

### Design Tokens
**Keep:** Existing token build process  
**Add:** Token-related tasks in backlog

### Git Commits
**Update:** Include task ID in commit messages  
```bash
# Before
git commit -m "add button component"

# After
git commit -m "feat(CMP-015): migrate Button to use design tokens"
```

---

## What NOT to Change

❌ Don't rename existing contracts  
❌ Don't restructure project folders  
❌ Don't change existing workflows (dev, build, etc.)  
❌ Don't force retroactive tasklogs for old work

✅ Add task system alongside existing structure  
✅ Use going forward for new work  
✅ Create retroactive tasks only for traceability

---

## Quick Reference

**Files Created:**
- `master-backlog.md` - Task tracking
- `tasks/*.md` - Task specifications
- `logs/*.md` - Daily work logs
- `traceability-matrix.csv` - Task→Code links

**Scripts Available:**
```bash
node scripts/validate-backlog.js
node scripts/validate-traceability.js
node scripts/find-orphaned-tasks.js
```

**Naming Convention:**
- Tasks: `[PREFIX]-[NNN]` (e.g., TOK-010, CMP-015)
- Commits: `type(TASK-ID): description`

---

## Success Criteria

After migration, you should have:

- [x] `master-backlog.md` with current and completed tasks
- [x] `tasks/` directory with retroactive + current tasks
- [x] `traceability-matrix.csv` with all major work
- [x] Validation scripts passing
- [x] First real task (TOK-010) in progress

**Next:** Continue normal work, using task system for all new work.

---

**Questions?** See `.methodology/QUICK-START.md` or `.methodology/workflows/task-management.md`
