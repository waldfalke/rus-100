# Lessons Learned

**Purpose:** Accumulated knowledge from real projects. Update this file as new learnings emerge.

---

## General Principles

### 1. Context Budget is Real

**Learning:** AI quality degrades sharply above 80% context capacity.

**Evidence:** 
- Starts forgetting earlier decisions
- Invents facts not in context
- Contradicts earlier statements

**Action:** Checkpoint at 60-80%, reload essentials only.

---

### 2. Generators Beat Generated Code

**Learning:** Impossible to review all AI-generated code for consistency.

**Evidence:**
- Components drift from token system
- Hardcoded values sneak in
- Patterns diverge across files

**Solution:** Control contracts + tokens (generators), validate output automatically.

---

### 3. Blast Radius Violations are Expensive

**Learning:** "Improving" one component breaks others in subtle ways.

**Evidence:**
- Changed global CSS → all components affected
- Modified token → broke dependent components
- Updated shared hook → cascade failures

**Prevention:** Explicit scope in contracts, automated boundary checks.

---

## Contract Precision

### 4. Simple Domain Needs Precision

**Learning:** Vague contracts in Simple domain lead to inconsistent implementations.

**Example:** 
- "Button should look good" → 5 different button styles
- vs "Button uses bg-primary, px-4, py-2" → consistent

**Rule:** If solution is known, specify exactly.

---

### 5. Complex Domain Needs Flexibility

**Learning:** Precise contracts in Complex domain become outdated immediately.

**Example:**
- "Use focusDistance=0.20" → fails on 40% devices
- vs "Focus must work on 95% devices" → adaptive solution

**Rule:** Specify goals and invariants, not implementation.

---

### 6. Cynefin Classification is Hard

**Learning:** Easy to misjudge domain complexity.

**Mistakes:**
- Treated camera API as Complicated → actually Complex (emergent)
- Treated form validation as Complex → actually Complicated (expert knowledge)

**Heuristic:** If you know exactly how to solve it → not Complex.

---

## Token System

### 7. Hardcoded Values Always Creep In

**Learning:** Without automated checks, hardcoded values appear.

**Evidence:**
- "Just this one color" → proliferates
- "Temporary spacing" → becomes permanent

**Solution:** Lint rules, automated validation, CI/CD checks.

---

### 8. Token Layers Matter

**Learning:** Flat token structure doesn't scale.

**Better:**
```
base → semantic → component
```

**Allows:** Theming, brand changes, component-specific overrides.

---

## Task Management

### 9. Graph Beats List

**Learning:** Task lists hide dependencies and blockers.

**Evidence:**
- Worked on task for hours → blocked by dependency
- Completed "priority" task → didn't unblock anything

**Solution:** Represent as graph, prioritize by unlocking power.

---

### 10. Time Estimates are Fiction with AI

**Learning:** AI can write fast but debug slowly. Time unpredictable.

**Better metric:** 
- Model invocations
- Context usage
- Cynefin quadrant

**Not:** "This will take 2 days"

---

### 11. E2E Without All Tasks

**Learning:** Can reach working product without completing all backlog tasks.

**How:** Follow critical path in task graph, skip non-blocking tasks.

**Evidence:** Delivered e2e in ExoScan without 40% of planned tasks.

---

## Multi-Agent

### 12. Simple Parallelism Works, Orchestration Doesn't

**Learning:** Complex agent coordination is unreliable.

**What works:**
- Agent 1: Feature implementation
- Agent 2: Fix lint errors
- Independent streams, no coordination

**What doesn't:**
- Orchestrator directing multiple agents
- Sequential handoffs between agents
- Cannot pause/correct mid-process

---

## Testing

### 13. Machine-Readable Output Essential

**Learning:** AI can't parse visual test output.

**Need:** Structured logs, JSON results, clear pass/fail.

**Allows:** AI self-corrects based on test failures.

---

### 14. Acceptance Criteria Must Be Testable

**Learning:** "Looks good" is not a criterion.

**Better:**
- "WCAG AA contrast" → automated check
- "Keyboard accessible" → integration test
- "No hardcoded colors" → lint rule

---

## Performance

### 15. Progressive Enhancement Beats One-Size-Fits-All

**Learning:** Assuming uniform environment leads to failures.

**Example:** Scanner assumes all devices support advanced camera features → breaks on 40%.

**Solution:** Feature detection, adaptive constraints, graceful degradation.

---

### 16. Measure Before Optimizing

**Learning:** "This seems slow" leads to wrong optimizations.

**Process:**
1. Measure actual performance
2. Identify bottleneck
3. Set goal from contract
4. Optimize
5. Measure again

---

## Contract Evolution

### 17. Contracts Must Update

**Learning:** Contracts become outdated as understanding deepens.

**Mistake:** Treating contract as immutable spec.

**Better:** 
- Version contracts
- Update after learnings
- Document why changed

**Especially in Complex domain.**

---

### 18. Document Anti-Patterns

**Learning:** Knowing what NOT to do is as valuable as what to do.

**Include in contracts:**
- What was tried and failed
- Why it's wrong
- What to do instead

**Prevents repeating mistakes.**

---

## Onboarding

### 19. Curriculum Beats Dump

**Learning:** Giving AI all context at once → overwhelm.

**Better:** Progressive disclosure
1. Core principles
2. Specific task context
3. Related examples
4. Edge cases

**Like teaching a person.**

---

### 20. Examples Essential

**Learning:** Abstract principles alone → inconsistent application.

**Need:** Concrete examples with code.

**Format:** 
- ✅ Correct implementation
- ❌ Wrong implementation
- Why different

---

## Meta-Learning

### 21. Holonic Analysis Finds Hidden Dependencies

**Learning:** Functional decomposition misses cross-cutting concerns.

**Holonic view reveals:**
- Resource contention (CPU, memory)
- Risk triangles (deadlocks)
- Natural boundaries (cohesion)

**Use:** As second perspective, not replacement for functional.

---

### 22. Simple Workflows Beat Complex

**Learning:** Multi-step procedures with branches → AI gets lost.

**Better:**
- Linear workflows
- Clear checkpoints
- One decision at a time

**Especially under context pressure.**

---

## What Didn't Work

### 23. Pure Documentation Approach Failed

**Attempt:** Wrote detailed docs, expected AI to follow.

**Result:** AI didn't reference docs, made up own approach.

**Better:** Rules + workflows + examples + validation.

---

### 24. Contract Networks Too Complex

**Attempt:** Created network of interconnected contracts.

**Result:** AI couldn't navigate relationships, forgot links.

**Better:** Medium-sized contracts (epic/module level), clear boundaries.

---

### 25. Overly Detailed Schemas Brittle

**Attempt:** JSON schema with every possible field validated.

**Result:** Contracts hard to write, schema broke often.

**Better:** Required fields only, flexible optionals.

---

## Current Open Questions

- How to detect Simple→Complex transition automatically?
- Optimal contract size metric?
- When to create new contract vs update existing?
- How to share learnings across projects?

---

**Update protocol:** When completing a task with significant learnings, append to this file with evidence and recommended action.
