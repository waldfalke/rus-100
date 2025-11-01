# Workflow: Task Management System

**Purpose:** Structured approach to managing work through backlog, tasks, and traceability.

---

## Overview

Contract-Driven Development uses a **three-layer task management system**:

1. **Master Backlog** (`master-backlog.md`) - Single source of truth for all work
2. **Task Files** (`tasks/TASK-[ID].md`) - Detailed specifications per task
3. **Task Logs** (`logs/[DATE]-tasklog.md`) - Daily work records

**Key Principle:** One task = one row in backlog. Details live in separate files.

---

## File Structure

```
project/
├── master-backlog.md          # Active work + full backlog
├── tasks/
│   ├── TOK-001.md             # Task: Create token schema
│   ├── TOK-002.md             # Task: Validate tokens
│   ├── BUG-050.md             # Bug: Hardcoded colors
│   └── EPIC-TOKENS.md         # Epic: Token system
├── logs/
│   ├── 2025-01-04-tasklog.md  # Daily work log
│   ├── 2025-01-05-tasklog.md
│   └── 2025-01-06-tasklog.md
├── contracts/
│   └── CONTRACT-TOKENS-001.yml
└── traceability-matrix.csv     # Task → Contract → Implementation
```

---

## Step 1: Create Task in Backlog

### Add to `master-backlog.md`

**Sprint Focus section (if active):**
```markdown
| 1 | TOK-003 | Generate CSS from tokens | IN_PROGRESS | 🔺 TOK-002 |
```

**Master Task List:**
```markdown
| TOK-003 | P1 | Generate CSS from tokens | IN_PROGRESS | Design-System | Tailwind | 🔺 TOK-002 |
```

**Rules:**
- One task = one row
- Include dependencies (🔺 depends on, 🔴 blocks, ⛔ blocked by)
- Keep it scannable - no details in backlog

---

## Step 2: Create Detailed Task File

### File: `tasks/TOK-003.md`

Use template: `templates/TASK-TEMPLATE.md`

**Required sections:**
- Overview (summary, context, acceptance criteria)
- Scope (in/out of scope)
- Contract reference
- Dependencies
- Implementation plan
- Validation steps
- Deliverables

**Example:**
```markdown
# TOK-003: Generate CSS Variables from Tokens

**Contract:** CONTRACT-TOKENS-001  
**Epic:** EPIC-TOKENS  
**Status:** IN_PROGRESS  
**Owner:** @alice

## Overview
Create script to transform design-tokens/tokens.json into CSS custom properties.

## Acceptance Criteria
- [ ] Script generates valid CSS
- [ ] Supports nested tokens
- [ ] Handles light/dark themes
- [ ] Deterministic output (same input = same output)

## Implementation Plan
1. Parse tokens.json
2. Transform to CSS variables
3. Generate :root and .dark sections
4. Write to build/css/variables.css
```

---

## Step 3: Daily Task Log

### File: `logs/2025-01-06-tasklog.md`

Use template: `templates/tasklog-template.md`

**Log each day's work:**
- Tasks worked on (with time)
- Progress made
- Decisions
- Blockers
- Bugs found
- Tomorrow's plan

**Example:**
```markdown
# Task Log — 2025-01-06

## Work Summary
**Hours:** 6.5h  
**Primary Task:** TOK-003

## Tasks Worked On

### TOK-003: Generate CSS from Tokens
**Time:** 4h  
**Status:** IN_PROGRESS (40% → 80%)

**What was done:**
- Implemented CSS generation logic
- Added support for nested tokens
- Tested with real tokens.json

**What's next:**
- Add dark theme support
- Write unit tests

**Blockers:** None
```

---

## Step 4: Update Traceability Matrix

### File: `traceability-matrix.csv`

Link tasks to contracts and implementation files.

**Format:**
```csv
Task_ID,Contract_ID,Epic_ID,Implementation_Files,Test_Files,Documentation,Status,Last_Verified,Notes
TOK-003,CONTRACT-TOKENS-001,EPIC-TOKENS,"scripts/generate-css.js","scripts/generate-css.test.js","scripts/README.md",IN_PROGRESS,2025-01-06,"80% complete"
```

**Update when:**
- Task status changes
- Files added/modified
- Contract updated
- Implementation verified

---

## Step 5: Task Completion

### Checklist before marking DONE

- [ ] All acceptance criteria met
- [ ] Contract compliance verified
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Traceability matrix updated
- [ ] Task log entry created
- [ ] Backlog status updated to DONE

### Update Files

1. **master-backlog.md:**
```markdown
| TOK-003 | P1 | Generate CSS from tokens | **DONE** | Design-System | Tailwind | 🔺 TOK-002 |
```

2. **tasks/TOK-003.md:**
```markdown
**Status:** DONE  
**Completed:** 2025-01-07
```

3. **traceability-matrix.csv:**
```csv
TOK-003,CONTRACT-TOKENS-001,EPIC-TOKENS,"scripts/generate-css.js","scripts/generate-css.test.js","scripts/README.md",DONE,2025-01-07,"All tests passing"
```

4. **logs/2025-01-07-tasklog.md:**
```markdown
### TOK-003: Generate CSS from Tokens
**Status:** IN_PROGRESS → DONE

**What was done:**
- Completed dark theme support
- All tests passing
- Documentation updated
- Contract compliance verified
```

---

## Task States

| State | Meaning | Next Actions |
|-------|---------|--------------|
| **IDEA** | Rough concept, not yet defined | Needs refinement, contract creation |
| **TODO** | Ready to work, all deps met | Assign owner, start work |
| **IN_PROGRESS** | Active work happening | Daily updates in tasklog |
| **BLOCKED** | Cannot proceed due to dependency | Resolve blocker, update status |
| **DONE** | Completed and verified | Archive, update all files |
| **DEFERRED** | Postponed, not canceled | Revisit in future sprint |
| **BACKLOG** | Low priority, future work | Leave until capacity available |

---

## Dependency Management

### Types

- **🔺 Depends on:** Cannot start until dependency completes
- **🔴 Blocks:** Other tasks waiting on this
- **⛔ Blocked by:** External dependency (API, design, etc.)

### Example Dependency Chain

```
TOK-001 (Schema) ✅
  └─→ TOK-002 (Validation) ✅
        └─→ TOK-003 (CSS Gen) 🔄
              ├─→ BUG-050 (Fix hardcoded) 🔄
              └─→ THM-001 (Theme) ⛔ [Blocked by BUG-050]
```

### Resolving Blocks

1. Identify blocker in dependency graph
2. Escalate if external dependency
3. Update backlog with blocker status
4. Work on unblocked tasks meanwhile
5. Unblock when dependency resolved

---

## Sprint Management

### Sprint Focus Section

At top of `master-backlog.md`, list only **current sprint tasks**:

```markdown
## Sprint Focus — Token System Foundation

| Order | ID | Title | Status | Notes |
|-------|----|----|--------|-------|
| 1 | TOK-003 | Generate CSS from tokens | IN_PROGRESS | 80% done |
| 2 | BUG-050 | Fix hardcoded colors | TODO | 🔴 Blocks THM-001 |
| 3 | CMP-002 | Implement Button | TODO | 🔺 TOK-003 |
```

**Rules:**
- Keep focused (5-8 tasks max)
- Order by priority
- Update daily
- Archive completed sprints

---

## Best Practices

### Do
✅ Update backlog daily  
✅ One task = one row (details in task file)  
✅ Log decisions in tasklog  
✅ Link tasks to contracts  
✅ Mark dependencies explicitly  
✅ Keep sprint focus clean  

### Don't
❌ Put task details in backlog (bloats file)  
❌ Duplicate information across files  
❌ Let backlog get stale (update daily)  
❌ Skip traceability matrix  
❌ Forget to log blockers  
❌ Work without a task ID  

---

## Common Patterns

### Creating a Bug Task

1. Add to backlog with `BUG-` prefix
2. Mark priority (P0 if critical)
3. Note what it blocks
4. Create task file with root cause analysis
5. Link to failing tests or evidence

### Creating an Epic

1. Create `EPIC-[NAME].md` file
2. Add row to backlog with **EPIC** marker
3. List all child tasks under epic
4. Track epic-level progress
5. Link to contracts

### Handling External Blockers

1. Mark task as **BLOCKED** in backlog
2. Add ⛔ symbol with blocker description
3. Document in task file
4. Escalate to stakeholder
5. Work on unblocked tasks

---

## Tools & Automation

### Validation Scripts

```bash
# Check backlog consistency
node scripts/validate-backlog.js

# Generate traceability report
node scripts/generate-traceability-report.js

# Find orphaned tasks
node scripts/find-orphaned-tasks.js
```

### CI Integration

```yaml
# .github/workflows/task-management.yml
- name: Validate backlog
  run: node scripts/validate-backlog.js

- name: Check traceability
  run: node scripts/validate-traceability.js
```

---

## Anti-Patterns

### ❌ Backlog as Documentation Dump
**Problem:** Adding full task details, implementation notes, logs to backlog  
**Fix:** Keep backlog scannable, details in `tasks/` folder

### ❌ Stale Backlog
**Problem:** Tasks not updated, orphaned entries, wrong statuses  
**Fix:** Daily backlog review, automate validation

### ❌ Missing Dependencies
**Problem:** Tasks blocked but not marked, causing confusion  
**Fix:** Always document dependencies with 🔺🔴⛔ symbols

### ❌ No Traceability
**Problem:** Can't connect task → contract → implementation  
**Fix:** Maintain traceability matrix, link in task files

---

## Checklist: Starting New Work

Before starting any task:

- [ ] Task exists in `master-backlog.md`
- [ ] Detailed task file created in `tasks/`
- [ ] Contract referenced (if applicable)
- [ ] Dependencies identified and documented
- [ ] Owner assigned
- [ ] Acceptance criteria defined
- [ ] Entry added to traceability matrix

---

**See Also:**
- [Master Backlog Template](../templates/master-backlog.md)
- [Task Template](../templates/TASK-TEMPLATE.md)
- [Task Log Template](../templates/tasklog-template.md)
- [Epic Template](../templates/EPIC-TEMPLATE.md)
