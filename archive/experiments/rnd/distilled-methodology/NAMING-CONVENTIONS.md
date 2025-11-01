# Naming Conventions — Task Management System

**Version:** 1.0  
**Status:** Mandatory

---

## Task ID Format

### Structure
```
[PREFIX]-[NUMBER]
```

### Prefixes by Type

| Prefix | Type | Example | Description |
|--------|------|---------|-------------|
| **TOK** | Tokens | TOK-001 | Design token system tasks |
| **CMP** | Component | CMP-042 | UI component implementation |
| **LYT** | Layout | LYT-010 | Layout/structure tasks |
| **THM** | Theme | THM-003 | Theming (light/dark) tasks |
| **STY** | Styling | STY-015 | CSS/styling tasks |
| **TST** | Testing | TST-020 | Test creation/fixes |
| **DOC** | Documentation | DOC-008 | Documentation tasks |
| **BUG** | Bug | BUG-050 | Bug fixes |
| **REF** | Refactor | REF-012 | Code refactoring |
| **INF** | Infrastructure | INF-005 | CI/CD, tooling, setup |
| **A11Y** | Accessibility | A11Y-003 | Accessibility improvements |
| **PERF** | Performance | PERF-007 | Performance optimization |
| **SEC** | Security | SEC-001 | Security fixes |
| **DB** | Database | DB-025 | Database/backend tasks |
| **API** | API | API-018 | API implementation |
| **UX** | User Experience | UX-011 | UX improvements |
| **EXP** | Experiment | EXP-002 | Experimental/POC work |

### Custom Project Prefixes

Add project-specific prefixes as needed:
```markdown
| **RUS** | Rus100-specific | RUS-045 | Project-specific feature |
| **FIT** | FitLead-specific | FIT-023 | Project-specific feature |
```

---

## Number Format

- **3 digits minimum:** `001`, `042`, `153`
- **Sequential per prefix:** TOK-001, TOK-002, TOK-003
- **Never reuse numbers** (even after task completion/deletion)

---

## Epic ID Format

### Structure
```
EPIC-[NAME]
```

### Examples
```
EPIC-TOKENS       # Design token system
EPIC-COMPONENTS   # Component library
EPIC-THEME        # Theming system
EPIC-STORYBOOK    # Storybook integration
EPIC-MIGRATION    # Legacy migration
```

---

## File Naming

### Task Files
```
tasks/[TASK-ID].md
tasks/TOK-001.md
tasks/CMP-042.md
tasks/BUG-050.md
```

### Epic Files
```
tasks/EPIC-[NAME].md
tasks/EPIC-TOKENS.md
tasks/EPIC-COMPONENTS.md
```

### Task Logs
```
logs/[YYYY-MM-DD]-tasklog.md
logs/2025-10-08-tasklog.md
```

### Contracts
```
contracts/CONTRACT-[NAME]-[NNN].yml
contracts/CONTRACT-BUTTON-001.yml
contracts/CONTRACT-TOKENS-001.yml
```

---

## Commit Message Format

### Structure
```
type(TASK-ID): description

[optional body]

[optional footer]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactor (no feature/fix)
- `test` - Adding/updating tests
- `chore` - Tooling, dependencies

### Examples
```bash
feat(TOK-001): add design token schema validation

fix(BUG-050): remove hardcoded colors from Button component

docs(DOC-008): update README with task management guide

refactor(REF-012): extract theme logic to custom hook

test(TST-020): add unit tests for TokenValidator
```

---

## Branch Naming

### Structure
```
type/TASK-ID-short-description
```

### Examples
```bash
feature/TOK-001-token-schema
bugfix/BUG-050-hardcoded-colors
refactor/REF-012-theme-hook
docs/DOC-008-task-guide
```

---

## Status Conventions

### Task Status (in backlog)
```
IDEA        # Rough concept, not defined
TODO        # Ready to work, deps met
IN_PROGRESS # Active work
BLOCKED     # Cannot proceed (dependency)
DONE        # Completed and verified
DEFERRED    # Postponed, not canceled
BACKLOG     # Low priority, future work
```

### Priority Levels
```
P0  # Critical (blocking production/other work)
P1  # High (current sprint)
P2  # Medium (next sprint)
P3  # Low (backlog)
```

### Dependency Markers
```
🔺  # Depends on (this task needs X)
🔴  # Blocks (other tasks waiting on this)
⛔  # Blocked by (external dependency)
```

---

## Examples in Context

### Master Backlog Entry
```markdown
| TOK-001 | P1 | Create tokens.json schema | DONE | Design-System | | 🔺 None |
| CMP-042 | P2 | Implement Card component | TODO | Components | | 🔺 TOK-001 |
| BUG-050 | P0 | Fix hardcoded colors | IN_PROGRESS | Components | Design-System | 🔴 Blocks: THM-001, THM-002 |
```

### Task File Name
```
tasks/TOK-001.md
tasks/CMP-042.md
tasks/BUG-050.md
```

### Task Log Entry
```markdown
# Task Log — 2025-10-08

### TOK-001: Create tokens.json Schema
**Time:** 3h
**Status:** TODO → DONE
```

### Traceability Matrix
```csv
TOK-001,CONTRACT-TOKENS-001,EPIC-TOKENS,"schemas/token.schema.json","tests/schema.test.ts","docs/TOKENS.md",DONE,2025-10-08
```

### Git Commit
```bash
git commit -m "feat(TOK-001): add token schema with color/spacing validation"
```

---

## Anti-Patterns

### ❌ Wrong
```
Task-1                    # No prefix
task001                   # No prefix, lowercase
TOK1                      # No separator, no leading zeros
Token-System-Schema       # Not scannable, too verbose
TOK-001-schema           # Don't include description in ID
```

### ✅ Right
```
TOK-001                   # Clear prefix, 3 digits
CMP-042                   # Scannable, consistent
BUG-050                   # Type obvious from prefix
```

---

## When to Create New Prefix

**Ask:**
1. Does existing prefix fit? (use it)
2. Will there be >5 tasks of this type? (create prefix)
3. Is it project-specific or universal?

**Examples:**

**Use existing:**
- "Add button tests" → `TST-020` (not BTN-TEST-001)
- "Fix theme bug" → `BUG-051` (not THM-BUG-001)

**Create new:**
- 10+ database tasks → Add `DB` prefix
- Project-specific feature set → Add `[PROJECT]` prefix

---

## Migration from Existing Systems

### If you have existing task IDs

**Option 1: Restart numbering**
- Map old → new in migration doc
- Start fresh with 001

**Option 2: Offset numbering**
- Start new system at 100+ to avoid conflicts
- Example: TOK-101, TOK-102 (if TOK-001 to TOK-050 already exist)

**Option 3: Keep old, adopt for new**
- Don't rename existing tasks
- Use new convention for all new tasks

---

## Enforcement

### Pre-commit Hook
```bash
# Check task ID in commit message
if ! git log -1 --pretty=%B | grep -E '\([A-Z]+-[0-9]{3}\)'; then
  echo "ERROR: Commit must include task ID"
  echo "Format: type(TASK-ID): description"
  exit 1
fi
```

### CI Validation
```yaml
- name: Validate task IDs
  run: |
    # Check all task files match pattern
    find tasks/ -name "*.md" | grep -vE '^tasks/(EPIC-[A-Z]+|[A-Z]+-[0-9]{3})\.md$' && exit 1
```

---

## Quick Reference

**Task ID:** `[PREFIX]-[NUMBER]` → `TOK-001`  
**Epic ID:** `EPIC-[NAME]` → `EPIC-TOKENS`  
**Commit:** `type(TASK-ID): desc` → `feat(TOK-001): add schema`  
**Branch:** `type/TASK-ID-desc` → `feature/TOK-001-schema`  
**File:** `tasks/TASK-ID.md` → `tasks/TOK-001.md`

---

**Related:**
- [Master Backlog Template](templates/master-backlog.md)
- [Task Template](templates/TASK-TEMPLATE.md)
- [Task Management Workflow](workflows/task-management.md)
