# Cynefin Framework for AI Development

**Purpose:** Classify problem complexity to determine appropriate approach.

**Core insight:** Different problems need different strategies. Applying wrong strategy causes failure.

---

## Four Domains

```
         Known              Unknowable
    ┌─────────────┬─────────────────┐
    │   CLEAR     │    COMPLEX      │
    │  (Simple)   │   (Emergent)    │
    │             │                 │
    │  Sense →    │  Probe →        │
    │  Categorize │  Sense →        │
    │  → Respond  │  Respond        │
    ├─────────────┼─────────────────┤
    │ COMPLICATED │    CHAOTIC      │
    │  (Expert)   │  (Crisis)       │
    │             │                 │
    │  Sense →    │  Act →          │
    │  Analyze →  │  Sense →        │
    │  Respond    │  Respond        │
    └─────────────┴─────────────────┘
```

---

## Clear (Simple) Domain

### Characteristics
- Solution is known and repeatable
- Cause and effect obvious
- Best practice exists
- Low variability

### Examples
- Button component with standard variants
- Form input with validation
- Navigation menu
- Card layout

### Contract Approach
**High precision:**
```yaml
props:
  variant: "'primary' | 'secondary' | 'outline'"  # Exact
  size: "'sm' | 'md' | 'lg'"  # Exact
states:
  - default
  - hover
  - focus
  - active
  - disabled
```

**Specify:**
- Exact props and types
- All variants
- All states
- Precise measurements

### Implementation
- Follow established patterns
- Implement exactly as specified
- High automation possible
- AI can generate with minimal supervision

### Testing
- All scenarios enumerable
- Comprehensive test coverage
- Visual regression testing

### Red Flags
If you think it's Simple but:
- Edge cases keep appearing
- Solution works sometimes
- Needs device-specific code

→ Might actually be Complex

---

## Complicated Domain

### Characteristics
- Solution knowable with expert analysis
- Multiple valid approaches
- Cause and effect separated in time/space
- Good practice, not best practice

### Examples
- Form with complex validation rules
- Data table with sorting/filtering
- Multi-step wizard
- Authentication flow

### Contract Approach
**Structured but flexible:**
```yaml
props:
  validationRules: ValidationRule[]  # Interface, not implementation
  onSubmit: (data: FormData) => Promise<Result>

constraints:
  - "Validation feedback within 100ms"
  - "Supports custom validators"

# Specify interface, allow implementation choices
```

**Specify:**
- API surface
- Constraints and goals
- Integration points
- Performance requirements

**Don't specify:**
- Exact algorithm
- Internal state structure
- Implementation details

### Implementation
- Expert knowledge needed
- Multiple iterations likely
- AI + human collaboration
- Design review recommended

### Testing
- Test interface compliance
- Test constraints met
- Integration tests important
- Performance benchmarks

### Red Flags
If you think it's Complicated but:
- Expert can't determine solution
- Multiple attempts all fail
- Solution differs per context

→ Might actually be Complex

---

## Complex Domain

### Characteristics
- Solution emergent (discovered through doing)
- Cause and effect only obvious in retrospect
- Requires experimentation
- Novel practice (no established patterns)

### Examples
- Camera API integration (device variance)
- Performance optimization (device-dependent)
- AI/ML feature (unpredictable results)
- Novel interaction pattern

### Contract Approach
**Goals and boundaries:**
```yaml
invariants:
  - "Works on 95% of target devices"
  - "Detection latency < 500ms average"
  - "Graceful degradation if feature unavailable"

constraints:
  performance:
    - "No memory leaks"
  accessibility:
    - "Alternative input available"

# NO exact implementation details
# NO magic numbers
# NO assumed solutions
```

**Specify:**
- What must always be true (invariants)
- Performance/quality goals
- Boundaries (what NOT to do)
- Acceptance criteria (measurable)

**Don't specify:**
- Exact parameters
- Implementation approach
- Optimal values

### Implementation
- Start with hypothesis
- Measure results
- Learn and adapt
- Iterate rapidly
- Update contract with learnings

### Example Evolution
```yaml
# Version 1.0 (Hypothesis)
invariants:
  - "Focus works automatically"

# Version 1.1 (After testing)
invariants:
  - "Focus works on devices with capability"
  - "Graceful degradation without auto-focus"
  
lessons_learned:
  - "Auto-focus unavailable on 40% devices"
  - "Manual focus better on some devices"
```

### Testing
- Test invariants hold
- Test goals achieved
- Measure actual performance
- Test on real devices/environments
- Document what works/doesn't

### Red Flags
If you think it's Complex but:
- Solution obvious after analysis
- Works identically everywhere
- No variance or unknowns

→ Might actually be Complicated

---

## Chaotic Domain

### Characteristics
- No clear cause and effect
- Urgent action required
- High turbulence
- Novel situation

### Examples
- Production crash (unknown cause)
- Security incident
- Critical bug in live system
- Emergency feature request

### Contract Approach
**Minimal scope, document learnings:**
```yaml
scope: "Fix immediate issue only"

invariants:
  - "Don't break existing functionality"
  - "Document what was done"

post_action:
  - "Write proper contract after stabilization"
  - "Plan proper solution"
  - "Document lessons learned"
```

**Specify:**
- Minimum scope
- What to preserve
- Documentation requirements

**Don't:**
- Try to solve everything
- Optimize or refactor
- Change unrelated code

### Implementation
- Act quickly
- Stabilize first
- Document everything
- Move to proper domain after

### Process
1. **Act:** Stop the bleeding
2. **Sense:** What happened?
3. **Respond:** Proper fix
4. **Learn:** Update knowledge

### Transition
After stabilization:
- Chaotic → Complex: If novel problem
- Chaotic → Complicated: If expert can solve
- Chaotic → Simple: If obvious in retrospect

**Critical:** Don't stay in Chaotic. Transition deliberately.

---

## Domain Transitions

### Simple → Complicated
**Trigger:** Edge cases accumulate

**Example:** Button seemed simple, but needs:
- Loading states
- Error states  
- Async onClick
- Tooltip integration

**Action:** Reclassify as Complicated, allow more flexibility.

### Complicated → Complex
**Trigger:** Expert analysis doesn't yield solution

**Example:** "Just optimize the query" but:
- Performance varies by data
- Different strategies for different cases
- No one approach works

**Action:** Reclassify as Complex, experiment and measure.

### Complex → Complicated
**Trigger:** Pattern emerges from experiments

**Example:** After testing camera API:
- Learned which constraints work
- Found reliable patterns
- Can now specify approach

**Action:** Codify learnings, can now teach others.

### Chaotic → Any
**Trigger:** Situation stabilized

**Action:** Assess properly, move to appropriate domain.

---

## Assessment Questions

### Is it Clear?
- [ ] Solution known and proven?
- [ ] Works identically in all contexts?
- [ ] Can specify exactly how to implement?
- [ ] Best practice exists?

**All yes → Clear**

### Is it Complicated?
- [ ] Solution knowable with analysis?
- [ ] Expert can determine approach?
- [ ] Multiple good approaches exist?
- [ ] Cause and effect understandable?

**All yes → Complicated**

### Is it Complex?
- [ ] Solution unknown upfront?
- [ ] Requires experimentation?
- [ ] High variance in results?
- [ ] Patterns emerge only after doing?

**All yes → Complex**

### Is it Chaotic?
- [ ] Urgent action needed?
- [ ] No time for analysis?
- [ ] Novel crisis situation?
- [ ] Must act to stabilize?

**All yes → Chaotic**

---

## Common Mistakes

### Treating Complex as Clear
**Mistake:** Write precise contract for emergent problem.

**Result:** Contract wrong, constrains exploration.

**Fix:** Recognize complexity, write flexible contract.

### Treating Clear as Complex
**Mistake:** Over-complicate simple problem.

**Result:** Waste time, inconsistent implementation.

**Fix:** Use established patterns, be precise.

### Staying in Chaotic
**Mistake:** Keep firefighting without proper solution.

**Result:** Technical debt, recurring issues.

**Fix:** Stabilize, then move to proper domain.

---

## Practical Application

### Before Starting Task

1. **Assess domain:**
   - Ask assessment questions
   - Check for domain signals
   - Consult with human if unclear

2. **Choose approach:**
   - Clear → Precise contract, implement exactly
   - Complicated → Structured contract, expert guidance
   - Complex → Flexible contract, experiment
   - Chaotic → Minimal scope, stabilize

3. **Set expectations:**
   - Clear: High confidence, fast
   - Complicated: Medium confidence, needs review
   - Complex: Low confidence upfront, iterative
   - Chaotic: Uncertainty high, document heavily

### During Implementation

**Monitor for domain shifts:**
- Simple task has many edge cases → Reclassify
- Complex task has clear pattern → Codify
- Stable task becomes urgent → Handle chaos

**Adapt approach accordingly.**

---

## Summary

| Domain | Contract Style | Implementation | Testing |
|--------|---------------|----------------|---------|
| **Clear** | Precise specification | Follow exactly | All scenarios |
| **Complicated** | Structured flexibility | Expert guidance | Interface + constraints |
| **Complex** | Goals + boundaries | Experiment | Invariants + goals |
| **Chaotic** | Minimal scope | Act quickly | Stabilization checks |

**Key principle:** Match your approach to domain complexity. Wrong match = failure.

---

**Next:** Apply this framework when assessing any new task. Start every contract by determining Cynefin domain.
