# Quick Start — Contract-Driven Development

**For:** AI agents and developers starting with this methodology  
**Time:** 15 minutes to productive work

---

## Step 1: Understand the System (5 min)

### Core Principle
**Control generators, not generated code.**

Contracts define *what* to build → AI/Developer executes *how*.

### Three Layers

1. **Rules** (`rules/`) - Static principles that never change
2. **Workflows** (`workflows/`) - Step-by-step procedures for tasks
3. **Memories** (`memories/`) - Lessons learned, what worked/didn't

### Key Artifacts

- **Contracts** (`contracts/`) - YAML specs defining deliverables
- **Master Backlog** (`master-backlog.md`) - All tasks, one row each
- **Task Files** (`tasks/`) - Detailed task specifications
- **Task Logs** (`logs/`) - Daily work records
- **Traceability Matrix** (`traceability-matrix.csv`) - Links everything

---

## Step 2: Read Universal Rules (3 min)

**Must read before starting:**

1. [`rules/00-universal.md`](rules/00-universal.md)
   - 10 fundamental rules (Generators Over Code, Blast Radius, etc.)

2. [`rules/05-traceability-obligations.md`](rules/05-traceability-obligations.md)
   - Mandatory: How to maintain task→contract→code traceability

**Quick summary:**
- ✅ Control source (contracts, tokens), not output (code)
- ✅ Every task needs: backlog entry + task file + tasklog
- ✅ Update traceability matrix on completion
- ✅ No work without a task ID

---

## Step 3: Set Up Project (2 min)

### Copy Templates

```bash
# Copy essential templates to your project
cp -r distilled-methodology/templates/* ./
cp distilled-methodology/templates/master-backlog.md ./master-backlog.md
```

### Create Directories

```bash
mkdir -p tasks logs contracts artifacts
```

### Install Script Dependencies

```bash
cd distilled-methodology/scripts
npm install
```

---

## Step 4: Start First Task (5 min)

### Example: Create Design Token System

#### 4.1 Create Task in Backlog

Edit `master-backlog.md`:

```markdown
## Sprint Focus — Token System Foundation

| Order | ID | Title | Status | Notes |
|-------|----|----|--------|-------|
| 1 | TOK-001 | Create tokens.json schema | TODO | |

---

## Master Task List

| ID | Priority | Title | Status | Primary | Affected | Dependencies |
|----|----------|-------|--------|---------|----------|--------------|
| TOK-001 | P1 | Create tokens.json schema | TODO | Design-System | | |
```

#### 4.2 Create Task File

File: `tasks/TOK-001.md`

```markdown
# TOK-001: Create tokens.json Schema

**Contract:** CONTRACT-TOKENS-001  
**Status:** TODO  
**Owner:** @you

## Overview
Create JSON schema for design token validation.

## Acceptance Criteria
- [ ] Schema validates color tokens
- [ ] Schema validates spacing tokens
- [ ] Schema has examples

## Implementation Plan
1. Read contract: CONTRACT-TOKENS-001
2. Create schemas/token.schema.json
3. Add validation examples
4. Test with real tokens.json
```

#### 4.3 Start Work → Update Status

In `master-backlog.md`:
```markdown
| TOK-001 | P1 | Create tokens.json schema | **IN_PROGRESS** | Design-System | | |
```

#### 4.4 Do the Work

```bash
# Follow the workflow
# Read: workflows/create-component.md (or applicable workflow)
```

#### 4.5 Log Work

File: `logs/2025-01-08-tasklog.md`

```markdown
# Task Log — 2025-01-08

## Work Summary
**Hours:** 3h  
**Primary Task:** TOK-001

### TOK-001: Create tokens.json Schema
**Time:** 3h  
**Status:** TODO → IN_PROGRESS → DONE

**What was done:**
- Created schemas/token.schema.json
- Added validation for colors, spacing, typography
- Tested with example tokens
- All validations passing

**Blockers:** None
```

#### 4.6 Update Traceability Matrix

File: `traceability-matrix.csv`

```csv
Task_ID,Contract_ID,Epic_ID,Implementation_Files,Test_Files,Documentation,Status,Last_Verified,Notes
TOK-001,CONTRACT-TOKENS-001,EPIC-TOKENS,"schemas/token.schema.json","tests/token-schema.test.js","docs/TOKENS.md",DONE,2025-01-08,"Schema validates all token types"
```

#### 4.7 Mark Complete

In `master-backlog.md`:
```markdown
| TOK-001 | P1 | Create tokens.json schema | **DONE** | Design-System | | |
```

---

## Common Workflows

### Creating a Component
→ Read: [`workflows/create-component.md`](workflows/create-component.md)

### Validating Tokens
→ Run: `node scripts/validate-tokens.js`

### Checking Contract Compliance
→ Run: `node scripts/check-contract-compliance.js CONTRACT-XXX-001.yml Component.tsx`

### Managing Tasks
→ Read: [`workflows/task-management.md`](workflows/task-management.md)

---

## Daily Routine

### Morning (5 min)
1. Review `master-backlog.md` Sprint Focus
2. Check for blockers
3. Plan today's work (update Sprint Focus if needed)

### During Work
1. Work on task
2. Make decisions → document in tasklog
3. Find bugs → create task in backlog
4. Update task file if scope changes

### End of Day (10 min)
1. Create/update tasklog: `logs/[DATE]-tasklog.md`
2. Update task status in backlog
3. Commit with task ID: `feat(TOK-001): add schema validation`
4. If task done → update traceability matrix

### Weekly (30 min)
1. Review completed tasks
2. Update traceability matrix for all DONE tasks
3. Run validation scripts
4. Archive completed sprint tasks

---

## Validation Checklist

Before marking any task **DONE**:

- [ ] All acceptance criteria met
- [ ] Contract compliance verified (if applicable)
- [ ] Tests written and passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Tasklog entry created
- [ ] Traceability matrix updated
- [ ] Backlog status updated to DONE

**Missing any? Task is NOT done.**

---

## Key Scripts

### Validate Tokens
```bash
node scripts/validate-tokens.js design-tokens/tokens.json
```

### Generate CSS from Tokens
```bash
node scripts/generate-css-from-tokens.js \
  design-tokens/tokens.json \
  build/css/variables.css
```

### Check Contract Compliance
```bash
node scripts/check-contract-compliance.js \
  contracts/CONTRACT-BUTTON-001.yml \
  components/Button/Button.tsx
```

### Validate Backlog (coming soon)
```bash
node scripts/validate-backlog.js
```

---

## File Naming Conventions

### Tasks
- Format: `TASK-[ID].md` or `[MODULE]-[NUMBER].md`
- Examples: `TOK-001.md`, `CMP-002.md`, `BUG-050.md`
- Location: `tasks/`

### Epics
- Format: `EPIC-[NAME].md`
- Examples: `EPIC-TOKENS.md`, `EPIC-COMPONENTS.md`
- Location: `tasks/`

### Task Logs
- Format: `[YYYY-MM-DD]-tasklog.md`
- Examples: `2025-01-08-tasklog.md`
- Location: `logs/`

### Contracts
- Format: `CONTRACT-[NAME]-[NNN].yml`
- Examples: `CONTRACT-BUTTON-001.yml`, `CONTRACT-TOKENS-001.yml`
- Location: `contracts/`

---

## Anti-Patterns to Avoid

### ❌ Working Without a Task ID
**Problem:** Code committed with no traceability  
**Fix:** Always create task in backlog first

### ❌ Bloated Backlog
**Problem:** Task details cluttering backlog file  
**Fix:** Keep backlog clean, details in `tasks/` folder

### ❌ Skipping Task Logs
**Problem:** Decisions lost, context forgotten  
**Fix:** Log daily, even if brief

### ❌ Stale Traceability Matrix
**Problem:** Can't verify what was built  
**Fix:** Update on task completion (mandatory)

---

## When Things Go Wrong

### "I forgot to create a task"
1. Create retroactive task in backlog (mark DONE)
2. Create task file with "RETROACTIVE" note
3. Update traceability matrix
4. Add pre-commit hook to prevent future

### "Backlog is a mess"
1. Archive completed tasks (move to `archive/`)
2. Clean up Sprint Focus (only current work)
3. Verify all IN_PROGRESS tasks have recent logs
4. Run validation scripts

### "Lost traceability"
1. Check git history for file origins
2. Search commit messages for context
3. Create retroactive entries
4. Document in tasklog why it happened

---

## Resources

### Essential Reading
- [`rules/00-universal.md`](rules/00-universal.md) - Core principles
- [`rules/05-traceability-obligations.md`](rules/05-traceability-obligations.md) - Mandatory practices
- [`workflows/task-management.md`](workflows/task-management.md) - How to manage work

### Templates
- [`templates/master-backlog.md`](templates/master-backlog.md)
- [`templates/TASK-TEMPLATE.md`](templates/TASK-TEMPLATE.md)
- [`templates/tasklog-template.md`](templates/tasklog-template.md)
- [`templates/EPIC-TEMPLATE.md`](templates/EPIC-TEMPLATE.md)

### Examples
- [`cookbook/01-button-simple-domain.md`](cookbook/01-button-simple-domain.md) - Real component example
- Real backlog reference: `rnd/MASTER_BACKLOG.md` (CATME project)

---

## Success Criteria

You're using the methodology correctly when:

✅ Every task has one row in backlog  
✅ Details live in task files, not backlog  
✅ Daily tasklog entries exist  
✅ All commits reference task IDs  
✅ Traceability matrix stays current  
✅ Contracts referenced in tasks  
✅ Validation scripts passing  

---

## Next Steps

1. **Read Universal Rules** (15 min)
   - [`rules/00-universal.md`](rules/00-universal.md)
   - [`rules/05-traceability-obligations.md`](rules/05-traceability-obligations.md)

2. **Try Onboarding Exercise** (30 min)
   - [`cookbook/00-onboarding-exercise.md`](cookbook/00-onboarding-exercise.md)

3. **Study Real Examples** (30 min)
   - [`cookbook/01-button-simple-domain.md`](cookbook/01-button-simple-domain.md)
   - Real backlog: `rnd/MASTER_BACKLOG.md`

4. **Start First Task** (follow Step 4 above)

---

**Questions?** See [`workflows/`](workflows/) for specific procedures or [`memories/anti-patterns.md`](memories/anti-patterns.md) for common mistakes.

**Ready to start?** Create your first task in `master-backlog.md` and go! 🚀
