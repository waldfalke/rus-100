# Universal Rules

**Scope:** Apply to all projects, all contexts, always loaded first.

---

## Rule 1: Generators Over Generated Code

**Principle:** Control the source of truth (contracts, tokens, schemas), not the output (components, styles, pages).

**Why:** AI-generated code accumulates inconsistencies over time. Impossible to manually review all changes. Instead, ensure the generator (contract + process) is correct.

**Apply:**
- ✅ Modify contract → regenerate component
- ✅ Update token → rebuild styles  
- ❌ Fix component directly without updating contract
- ❌ Hardcode values that should be tokens

**Detection:** If you're tempted to edit generated code, ask "should I update the contract instead?"

---

## Rule 2: Blast Radius Isolation

**Principle:** Everything outside a contract's scope is invariant. Changes must be contained within contract boundaries.

**Why:** Prevents ripple effects where "improving" one component breaks three others.

**Contract defines:**
- **Inside:** Your sandbox, change freely
- **Outside:** Invariant, do not touch

**Example:**
```yaml
# CONTRACT-BUTTON-001.yml
scope:
  mutable:
    - components/Button/*
    - stories/Button.stories.tsx
  invariant:
    - design-tokens.json  # Read-only
    - components/Card/*    # Other components
    - globals.css          # Global styles
```

**Violation signals:**
- Changing files not listed in contract scope
- Modifying global state/styles
- Touching other components' code

---

## Rule 3: Cynefin-Aware Precision

**Principle:** Contract precision depends on problem domain complexity.

**Cynefin quadrants:**

### Simple Domain
- Solution known and repeatable
- Contract: Precise and detailed
- Example: Button with variants (primary, secondary, outline)
- Specify: Exact props, variants, states, measurements

### Complicated Domain  
- Solution knowable with expert analysis
- Contract: Structured but flexible
- Example: Form with validation
- Specify: API, constraints, but allow implementation choices

### Complex Domain
- Solution emergent, discovered through experiments
- Contract: Boundaries and invariants, NOT implementation
- Example: Camera API integration, performance optimization
- Specify: Goals, constraints, what must hold true
- Do NOT specify: Exact parameters (focusDistance=0.20), magic numbers

### Chaotic Domain
- Firefighting, no clear solution
- Contract: Minimal scope, focus on learning
- Example: Production hotfix, unknown edge case
- Specify: What to preserve (invariants), document learnings

**Rule:** More complex = less precise contract. Precision in Complex domain = false confidence.

---

## Rule 4: Explicit Over Implicit

**Principle:** Make all assumptions, constraints, and decisions explicit. No "obvious" or "as discussed" references.

**Why:** New AI instance has no memory of previous context. Everything must be self-contained.

**Apply:**
- ✅ "Button must use `--color-primary` token for background"
- ✅ "Spacing follows 8px grid (0.5rem increments)"
- ❌ "Use the usual pattern"
- ❌ "As we agreed before"
- ❌ Implicit dependencies without documentation

**In contracts:** List all dependencies, external APIs, assumptions.

---

## Rule 5: Single Source of Truth

**Principle:** Each piece of knowledge has exactly one authoritative source.

**Sources of truth:**
- Design tokens → `design-tokens/*.json`
- Component API → `contracts/COMPONENT-*.yml`
- Task structure → `backlog.yaml` or task graph
- Business rules → DBC contracts

**Anti-pattern:** Same information in multiple places (will drift)

**Detection:** If you need to update the same fact in 2+ files, consolidate.

---

## Rule 6: Contract-First Development

**Principle:** Write contract before code. Contract defines what to build, not how.

**Workflow:**
1. Analyze requirements
2. Write contract (props, variants, invariants, anti-patterns)
3. Validate contract against schema
4. Generate/implement code
5. Validate code against contract

**Never:** Code first, contract later (contract becomes documentation, not source of truth)

---

## Rule 7: Fail Fast on Violations

**Principle:** Catch contract violations immediately, don't accumulate technical debt.

**Implement:**
- Schema validation on contract save
- Automated checks in CI/CD
- Lint rules for token usage
- Tests verify contract compliance

**If violation detected:** Stop, fix contract or code, then proceed.

---

## Rule 8: Context Budget Management

**Principle:** Keep working context at 60-80% of available capacity.

**Why:** AI needs buffer for reasoning, not just memory. At 100% context, quality degrades.

**Signals to checkpoint:**
- Forgetting earlier decisions
- Inventing facts not in context
- Conflicting with own earlier statements

**Action:** Save state, reset context, reload essentials (contracts + current task).

---

## Rule 9: Graph Over List

**Principle:** Represent task dependencies as graph, not linear list.

**Why:** Reveals parallelizable work, critical paths, blockers, risk-triangles.

**In practice:**
- Tasks have dependencies (blocks/blocked-by)
- Priority from graph structure (what unblocks most)
- Can reach e2e without completing all tasks (follow critical path)

---

## Rule 10: Measurable Over Time-Based

**Principle:** Estimate task complexity by measurable criteria (Cynefin, dependencies, coupling), not time.

**Metrics:**
- Model invocations needed
- Context consumed
- Number of dependencies
- Cynefin quadrant

**Anti-pattern:** "This will take 2 weeks" (unknowable with AI)  
**Instead:** "Complex domain, expect multiple iterations, high context usage"

---

## Self-Check Questions

Before starting any task, ask:
1. What is the source of truth for this work?
2. What is my blast radius (contract scope)?
3. What Cynefin quadrant is this task?
4. Are all assumptions explicit?
5. Is this contract-first or code-first?

If unsure on any question, consult relevant rule before proceeding.

---

**Next:** Load domain-specific rules based on task context.
