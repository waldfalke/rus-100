# Rule 5: Traceability Obligations

**Scope:** All projects, all team members, mandatory enforcement.

---

## Core Principle

**Every task must be traceable from requirement → contract → implementation → verification.**

Breaking the traceability chain makes it impossible to:
- Verify contract compliance
- Audit what was built vs. what was specified
- Understand why decisions were made
- Maintain or refactor code confidently

---

## Mandatory Artifacts

### 1. Master Backlog (`master-backlog.md`)

**Must contain:**
- All active and backlog tasks (one task = one row)
- Task status, owner, dependencies
- Sprint focus section (current work only)

**Must NOT contain:**
- Task implementation details (→ task files)
- Daily logs (→ tasklogs)
- Historical data (→ archive)

**Update frequency:** Daily

---

### 2. Task Files (`tasks/TASK-[ID].md`)

**Must contain:**
- Contract reference
- Acceptance criteria
- Implementation plan
- Dependencies
- Validation steps

**Create when:** Task moves to TODO or IN_PROGRESS

**Update when:** Status changes, blockers found, scope modified

---

### 3. Task Logs (`logs/[DATE]-tasklog.md`)

**Must contain:**
- Daily work summary per task
- Decisions made (with rationale)
- Blockers encountered
- Tomorrow's plan

**Create:** Daily (if any work done)

**Format:** One file per day, all tasks in one file

---

### 4. Traceability Matrix (`traceability-matrix.csv`)

**Must link:**
```
Task → Contract → Implementation Files → Tests → Documentation
```

**Update when:**
- Task status changes
- Files created/modified
- Contract updated
- Tests added

**Format:** CSV (machine-readable)

---

## Traceability Chain

```
Requirement
  ↓
Contract (YAML)
  ↓
Task (Backlog + Task File)
  ↓
Implementation (Code)
  ↓
Tests (Automated verification)
  ↓
Tasklog (Work record)
  ↓
Traceability Matrix (Links everything)
```

**Every link must be explicit and documented.**

---

## Enforcement Rules

### Before Starting Work

**AI/Developer must verify:**
1. [ ] Task exists in master-backlog.md
2. [ ] Task file created with contract reference
3. [ ] Dependencies documented
4. [ ] Traceability matrix entry exists

**If any missing → Create them first, then start work.**

---

### During Work

**AI/Developer must:**
1. Update tasklog daily (or per session)
2. Document decisions in tasklog
3. Link commits to task ID
4. Update task file if scope changes

**Commit message format:**
```
feat(TOK-003): add CSS generation for dark theme
^    ^         ^
type task-id   description
```

---

### Before Marking Task DONE

**AI/Developer must verify:**
1. [ ] All acceptance criteria met
2. [ ] Contract compliance verified (run validation)
3. [ ] Tests written and passing
4. [ ] Code reviewed
5. [ ] Documentation updated
6. [ ] Traceability matrix updated with all files
7. [ ] Final tasklog entry created
8. [ ] Backlog status updated to DONE

**Missing any? → Task is NOT done.**

---

## Traceability Matrix Format

### Required Columns

```csv
Task_ID,Contract_ID,Epic_ID,Implementation_Files,Test_Files,Documentation,Status,Last_Verified,Notes
```

### Example Entry

```csv
TOK-003,CONTRACT-TOKENS-001,EPIC-TOKENS,"scripts/generate-css.js,build/css/variables.css","scripts/generate-css.test.js","scripts/README.md,docs/TOKENS.md",DONE,2025-01-07,"Verified: all 47 tokens generate valid CSS"
```

### Validation Rules

- `Task_ID` must exist in master-backlog.md
- `Contract_ID` must exist in contracts/ directory
- `Implementation_Files` must exist in repository
- `Test_Files` must exist and pass
- `Status` must match backlog status
- `Last_Verified` must be recent (within 7 days for IN_PROGRESS)

---

## Anti-Patterns

### ❌ "I'll update docs later"

**Problem:** Work completed but not documented, traceability broken  
**Impact:** Can't verify compliance, orphaned code, lost context  
**Fix:** Update as you go. Tasklog daily, traceability on completion.

**Rule:** If it's not in tasklog/traceability matrix, it didn't happen.

---

### ❌ Working without a task ID

**Problem:** Code committed with no task reference  
**Impact:** Can't trace why code exists, what contract it fulfills  
**Fix:** Always create task in backlog before starting work.

**Rule:** No code without a task. No task without a contract (if applicable).

---

### ❌ Stale traceability matrix

**Problem:** Matrix says task is TODO, but code exists and tests pass  
**Impact:** False negatives in audits, confusion about project state  
**Fix:** Update matrix whenever status changes.

**Rule:** Matrix must always reflect current reality.

---

### ❌ Vague file references

**Problem:** "various files", "multiple components", no specific paths  
**Impact:** Can't audit what was actually modified  
**Fix:** List exact file paths in traceability matrix.

**Rule:** Specificity is mandatory. "components/" is not acceptable, "components/Button/Button.tsx" is.

---

## Validation Automation

### CI Checks

```yaml
# .github/workflows/traceability.yml
jobs:
  validate-traceability:
    steps:
      - name: Check backlog consistency
        run: node scripts/validate-backlog.js
      
      - name: Verify traceability matrix
        run: node scripts/validate-traceability.js
      
      - name: Check orphaned tasks
        run: node scripts/find-orphaned-tasks.js
      
      - name: Verify contract links
        run: node scripts/verify-contract-links.js
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Extract task ID from commit message
TASK_ID=$(git log -1 --pretty=%B | grep -oP '(?<=\()[A-Z]+-\d+(?=\))')

if [ -z "$TASK_ID" ]; then
  echo "ERROR: Commit message must include task ID"
  echo "Format: type(TASK-ID): description"
  exit 1
fi

# Check task exists in backlog
if ! grep -q "$TASK_ID" master-backlog.md; then
  echo "ERROR: Task $TASK_ID not found in master-backlog.md"
  exit 1
fi
```

---

## Obligations by Role

### AI Agent

**Must do:**
- Create task file before starting work
- Update tasklog after each work session
- Document all decisions with rationale
- Update traceability matrix on task completion
- Verify contract compliance before marking DONE
- Link all commits to task IDs

**Must NOT do:**
- Work on tasks without backlog entry
- Skip tasklog updates
- Mark tasks DONE without full verification
- Leave orphaned files without traceability

---

### Human Developer

**Must do:**
- Review AI's traceability updates
- Verify contract compliance claims
- Approve task completion checklist
- Maintain backlog priorities
- Audit traceability matrix weekly

**Can delegate to AI:**
- Creating/updating task files
- Writing tasklogs
- Updating traceability matrix
- Running validation scripts

---

## Metrics & Auditing

### Health Metrics

**Backlog Health:**
- % of tasks with detailed task files (target: 100% for IN_PROGRESS)
- Average age of tasks in IN_PROGRESS (target: < 3 days)
- % of tasks with documented dependencies (target: 100%)

**Traceability Health:**
- % of code files linked to tasks (target: 100%)
- % of tasks with contract references (target: 90%+)
- % of traceability matrix entries verified (target: 100% for DONE)

**Compliance Health:**
- % of commits with task ID (target: 100%)
- % of tasks with passing tests (target: 100% for DONE)
- % of contracts validated (target: 100% before release)

---

### Audit Process

**Weekly:**
1. Run `node scripts/validate-traceability.js`
2. Check for orphaned tasks (task in backlog, no work logged)
3. Verify all IN_PROGRESS tasks have recent tasklog entries
4. Check all DONE tasks have traceability matrix entries

**Before Release:**
1. Full traceability audit (every task → contract → code)
2. Verify all tests passing
3. Check no orphaned code (code without task reference)
4. Validate all contracts compliance
5. Generate traceability report

---

## Traceability Report Example

```markdown
# Traceability Report — 2025-01-07

## Summary
- Total tasks: 15
- Traced tasks: 15 (100%)
- Orphaned code files: 0
- Missing tests: 0
- Contract compliance: 100%

## Task → Contract Mapping
✅ TOK-001 → CONTRACT-TOKENS-001 (verified)
✅ TOK-002 → CONTRACT-TOKENS-001 (verified)
✅ TOK-003 → CONTRACT-TOKENS-001 (verified)
✅ CMP-001 → CONTRACT-BUTTON-001 (verified)
✅ CMP-002 → CONTRACT-BUTTON-001 (verified)

## Implementation Coverage
- Contracts covered: 2/2 (100%)
- Tasks completed: 5/15 (33%)
- Tests passing: 47/47 (100%)

## Issues Found
None

## Recommendations
- Continue current traceability practices
- All obligations met
```

---

## Emergency Procedures

### Lost Traceability

**Symptom:** Code exists but no task reference found

**Recovery:**
1. Identify affected files via git history
2. Search commit messages for context
3. Create retroactive task entry in backlog (mark as DONE)
4. Create task file with "RETROACTIVE" note
5. Add traceability matrix entry
6. Document in tasklog why traceability was lost
7. Implement prevention (pre-commit hooks)

---

### Conflicting Information

**Symptom:** Backlog says TODO, traceability says DONE

**Resolution:**
1. Check actual implementation (does code exist and work?)
2. Check tests (are they passing?)
3. Check contract compliance (is contract fulfilled?)
4. Update ALL sources to match reality
5. Document discrepancy in tasklog
6. Investigate why sync failed

---

## Key Takeaways

1. **Traceability is not optional** - it's how we prove correctness
2. **Update as you go** - don't accumulate "documentation debt"
3. **Automate validation** - CI checks enforce obligations
4. **Be specific** - exact file paths, explicit links
5. **No work without trace** - if it's not logged, it didn't happen

**The rule:** Better to spend 10 minutes updating traceability than 10 hours debugging why undocumented code exists.

---

**Related:**
- [Workflow: Task Management](../workflows/task-management.md)
- [Master Backlog Template](../templates/master-backlog.md)
- [Traceability Matrix Template](../templates/traceability-matrix.csv)
