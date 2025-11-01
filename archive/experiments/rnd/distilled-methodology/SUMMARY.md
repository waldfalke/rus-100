# Methodology Quick Reference

**For:** AI agents needing quick reminder of key principles.

**Full docs:** See individual files for detailed explanations.

---

## Core Philosophy

**Control generators (contracts, tokens), not generated code (components, styles).**

Methodology is about de-automating AI's default thinking patterns.

---

## 10 Universal Rules

1. **Generators Over Generated Code** - Control contracts/tokens, validate output
2. **Blast Radius Isolation** - Changes contained within contract scope
3. **Cynefin-Aware Precision** - Contract detail depends on domain complexity
4. **Explicit Over Implicit** - No assumptions, all context self-contained
5. **Single Source of Truth** - Each fact has one authoritative source
6. **Contract-First Development** - Contract before code, always
7. **Fail Fast on Violations** - Catch problems immediately
8. **Context Budget Management** - Keep at 60-80%, checkpoint when needed
9. **Graph Over List** - Tasks as dependency graph, not linear list
10. **Measurable Over Time-Based** - Estimate by complexity metrics, not hours

**Details:** `rules/00-universal.md`

---

## Cynefin Quick Guide

| Domain | When | Contract | Implementation |
|--------|------|----------|----------------|
| **Clear** | Solution known | Precise specs | Follow exactly |
| **Complicated** | Expert can solve | Structured + flexible | Needs review |
| **Complex** | Solution emergent | Goals + boundaries | Experiment & iterate |
| **Chaotic** | Crisis mode | Minimal scope | Stabilize fast |

**Rule:** Match precision to complexity. Wrong match = failure.

**Details:** `rules/01-cynefin.md`

---

## Standard Workflow

### Creating Component

1. **Assess** Cynefin domain
2. **Write** contract (`templates/CONTRACT-COMPONENT.yml`)
3. **Identify** token dependencies
4. **Implement** from contract
5. **Validate** against contract
6. **Update** exports and registry

**Details:** `workflows/create-component.md`

### Extracting from Legacy

1. **Inventory** component
2. **Analyze** props, variants, states
3. **Extract** invariants and anti-patterns
4. **Write** contract (current state, not ideal)
5. **Validate** extraction
6. **Plan** incremental improvements

**Details:** `workflows/extract-contract.md`

---

## Contract Structure

```yaml
id: CONTRACT-NAME-001
title: Component Name
type: component
cynefin_domain: [simple|complicated|complex|chaotic]

props:
  required: [...]
  optional: [...]

variants: [...]
states: [...]

invariants:
  - "What must ALWAYS be true"

dependencies:
  tokens: [...]
  components: [...]

scope:
  mutable: [...]      # Can change
  invariant: [...]    # Cannot change

anti_patterns:
  - pattern: "..."
    reason: "..."
    alternative: "..."

acceptance_criteria:
  - criterion: "Testable requirement"
    validation: [visual|unit-test|integration-test|manual|automated]
```

**Validate:** Against `schemas/contract.schema.json`

---

## Token Layers

```
Base Tokens (primitives)
  ↓ reference
Semantic Tokens (meaning)
  ↓ reference  
Component Tokens (usage)
```

**Example:**
```json
{
  "base": {
    "blue": { "600": "#3B82F6" }
  },
  "semantic": {
    "primary": "{base.blue.600}"
  },
  "component": {
    "button": { "bg": "{semantic.primary}" }
  }
}
```

**Never:** Hardcode colors/spacing. **Always:** Use tokens.

**Details:** `templates/design-tokens.json`

---

## Top Anti-Patterns

1. **Hardcoded values** - Use tokens
2. **Code-first** - Contract before code
3. **Non-semantic HTML** - `<button>` not `<div onclick>`
4. **Over-spec in Complex** - Goals, not implementation
5. **Under-spec in Simple** - Be precise
6. **Blast radius violation** - Stay in scope
7. **No validation** - Automate checks
8. **Big bang refactor** - Incremental changes
9. **Ignoring context budget** - Checkpoint at 60-80%
10. **Mixing concerns** - Separate component/business logic

**Full list:** `memories/anti-patterns.md`

---

## Key Learnings

- **Context budget is real** - Quality degrades >80%
- **Simple domain needs precision** - Vague = inconsistent
- **Complex domain needs flexibility** - Precise = brittle
- **Hardcoded values always creep in** - Need automation
- **Graph beats list** - Dependencies matter
- **Time estimates are fiction** - Use complexity metrics
- **Simple parallelism works** - Complex orchestration doesn't
- **Contracts must evolve** - Especially in Complex domain
- **Examples essential** - Theory alone insufficient

**Full list:** `memories/lessons-learned.md`

---

## Task Assessment

**Before starting:**

1. What Cynefin domain?
2. What's the blast radius?
3. What tokens needed?
4. What must remain invariant?
5. How to validate success?

**If unsure:** Consult relevant docs before proceeding.

---

## Context Management

**Signs to checkpoint:**
- Forgetting earlier decisions
- Inventing facts not in context
- Contradicting previous statements

**Action:**
1. Save progress
2. Note current position
3. Reset context
4. Reload: Contract + current task + relevant rules
5. Resume

**Keep working context at 60-80% capacity.**

---

## Validation Checklist

**Every component:**
- [ ] Contract exists and schema-valid?
- [ ] All props match contract?
- [ ] All variants working?
- [ ] Using only tokens (no hardcoded values)?
- [ ] Only modified files in mutable scope?
- [ ] Acceptance criteria met?
- [ ] Tests passing?
- [ ] Accessibility compliant?

**If any fails:** Fix before marking complete.

---

## Update Protocol

**When learning something significant:**

1. Check if existing rule/workflow covers it
2. If yes: Add example
3. If no: Add new entry
4. Include evidence, not just theory
5. Note version and date

**Update locations:**
- Rules: `rules/*.md`
- Workflows: `workflows/*.md`
- Learnings: `memories/lessons-learned.md`
- Anti-patterns: `memories/anti-patterns.md`

**Details:** `workflows/meta-update-knowledge.md`

---

## Common Questions

**Q: Contract or code first?**  
A: Contract. Always. Contract is source of truth.

**Q: How precise should contract be?**  
A: Depends on Cynefin. Simple = precise, Complex = flexible.

**Q: Can I modify files outside scope?**  
A: No. Blast radius violation. Update scope if needed.

**Q: What if I need new token?**  
A: Add to token system first, then use.

**Q: Contract doesn't match reality?**  
A: Update contract (especially in Complex domain).

**Q: How to handle context overflow?**  
A: Checkpoint at 60-80%, reload essentials.

---

## Emergency Procedures

### If Stuck
1. Identify which domain (Cynefin)
2. Check relevant examples in cookbook
3. Review applicable rules
4. Ask clarifying questions

### If Breaking Things
1. Check blast radius - are you outside scope?
2. Review anti-patterns - is this a known mistake?
3. Roll back changes
4. Fix contract first, then regenerate

### If Context Full
1. Save current state
2. Note what you were doing
3. Reset context
4. Reload contract + current task
5. Continue

---

## Resources by Scenario

**Starting new component:**
- `workflows/create-component.md`
- `cookbook/01-button-simple-domain.md`

**Migrating legacy:**
- `workflows/extract-contract.md`
- `migration/legacy-to-contracts.md`

**Learning methodology:**
- `cookbook/00-onboarding-exercise.md`
- `rules/00-universal.md`

**Assessing complexity:**
- `rules/01-cynefin.md`

**Understanding tokens:**
- `templates/design-tokens.json`

**Avoiding mistakes:**
- `memories/anti-patterns.md`

**Learning from experience:**
- `memories/lessons-learned.md`

---

## Task Management (NEW)

**System:** Backlog → Task Files → Task Logs → Traceability Matrix

### Master Backlog
- **One task = one row** (no details in backlog)
- Sprint focus at top (current work only)
- Full task list below (all modules)
- Dependencies marked: 🔺 depends on | 🔴 blocks | ⛔ blocked by

### Task Files (`tasks/TASK-ID.md`)
- Detailed specification per task
- Contract reference
- Acceptance criteria
- Implementation plan

### Task Logs (`logs/[DATE]-tasklog.md`)
- Daily work record
- Decisions made
- Blockers found
- Tomorrow's plan

### Traceability Matrix (`traceability-matrix.csv`)
- Links: Task → Contract → Implementation → Tests → Docs
- **Mandatory:** Update on task completion

**Details:** `workflows/task-management.md`, `rules/05-traceability-obligations.md`

---

## Success Metrics

**Project level:**
- Contract compliance: >90%
- Token usage: >90%
- Blast radius violations: 0
- Automated validation: Yes
- Team trained: Yes
- **Traceability current: >95%**

**Component level:**
- Schema valid: ✓
- Props match contract: ✓
- No hardcoded values: ✓
- Acceptance criteria met: ✓
- Tests passing: ✓
- **Traceability matrix updated: ✓**

---

**Remember:** This is a self-evolving system. As you learn, update the knowledge base.

**Start:** [`QUICK-START.md`](QUICK-START.md) for 15-minute productive work, then [`README.md`](README.md) for full methodology.
