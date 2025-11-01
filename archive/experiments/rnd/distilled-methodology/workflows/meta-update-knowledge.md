# Workflow: Update Knowledge Base

**Purpose:** How AI agents update this methodology based on learnings.

**Critical:** This is a self-evolving system. As you learn, update the knowledge.

---

## When to Update

### Update Rules When:
- Discovered new principle that applies universally
- Found violation of existing rule
- Rule is outdated/incorrect
- New anti-pattern identified

### Update Workflows When:
- Optimized existing process
- Found better approach
- Step was missing or unclear
- New procedure needed

### Update Memories When:
- Task completed with significant learnings
- Something worked unexpectedly well
- Something failed unexpectedly
- Complex domain insight gained

---

## How to Update Rules

**Location:** `rules/`

**Format:**
```markdown
## Rule N: [Name]

**Principle:** [One sentence core idea]

**Why:** [Explanation]

**Apply:**
- ✅ [Correct example]
- ❌ [Wrong example]

**Detection:** [How to recognize violation]
```

**Process:**
1. Identify what learned
2. Check if existing rule covers it
3. If yes: Add example to existing rule
4. If no: Add new rule
5. Validate rule applies to multiple contexts (not one-off)

**Example update:**
```markdown
<!-- Found new principle -->
## Rule 11: Progressive Disclosure

**Principle:** Load context progressively, not all at once.

**Why:** Prevents context overflow, maintains quality.

**Apply:**
- ✅ Load core rules → task context → examples
- ❌ Dump all documentation at start

**Detection:** Context >80% before starting work
```

---

## How to Update Workflows

**Location:** `workflows/`

**Format:**
```markdown
# Workflow: [Name]

**Purpose:** [What this achieves]

## Step 1: [Name]
[Instructions]

## Step 2: [Name]
[Instructions]

[...]

## Anti-Patterns
[What NOT to do]
```

**Process:**
1. Complete task using existing workflow
2. Note pain points, missing steps, unclear instructions
3. Update workflow with improvements
4. Add version note at bottom:
   ```
   ---
   Updated: YYYY-MM-DD - Added Step X for Y reason
   ```

**Example update:**
```markdown
<!-- Original -->
## Step 3: Implement Component
[vague instructions]

<!-- Updated -->
## Step 3: Implement Component

**Guidelines:**
1. Use tokens, never hardcode
2. Follow contract variants exactly
3. Handle all states from contract

[concrete examples added]
```

---

## How to Update Memories

**Location:** `memories/`

### lessons-learned.md

**Add when:** Significant learning from real work.

**Format:**
```markdown
### N. [Learning Title]

**Learning:** [What was discovered]

**Evidence:** [What showed this was true]

**Action/Solution:** [What to do with this knowledge]
```

**Example:**
```markdown
### 26. Device Capabilities Vary More Than Expected

**Learning:** Cannot assume uniform camera API across devices.

**Evidence:** 
- iPhone supports focusDistance
- Samsung uses focusMode instead
- Some devices have neither

**Solution:** Feature detection + progressive enhancement
```

### anti-patterns.md

**Add when:** Discovered mistake pattern.

**Format:**
```markdown
### N. [Anti-Pattern Name]

**Pattern:** [What people do wrong]

**Why wrong:** [Why this is problematic]

**Correct:** [What to do instead]
```

---

## Self-Check Before Updating

**Ask:**
1. Is this learning generalizable? (Not one-off)
2. Is there evidence? (Not just theory)
3. Is it actionable? (Can be applied)
4. Does it contradict existing knowledge? (If yes, resolve conflict)

**If all yes:** Update.

**If no to any:** Note as observation, don't formalize yet.

---

## Conflict Resolution

**If new learning contradicts existing rule:**

1. **Check context:** Does contradiction depend on domain?
   - Example: "Be precise" (Simple) vs "Be flexible" (Complex) → both correct in different contexts

2. **Check evidence:** Which has stronger evidence?
   - Anecdote vs measured result
   - One project vs multiple projects

3. **Update or refine:**
   - If new learning is better: Replace old rule
   - If both valid: Add context-dependent guidance
   - If unclear: Mark as "Under investigation"

**Example:**
```markdown
## Rule X: Contract Precision (Updated)

~~**Old:** Contracts should be as detailed as possible~~

**Current:** Contract precision depends on Cynefin domain:
- Simple: High precision
- Complex: Low precision (goals + invariants)

**Updated:** YYYY-MM-DD - Refined based on Complex domain learnings
```

---

## Version Control

**All updates include:**
```markdown
---
**Version:** 1.1
**Updated:** YYYY-MM-DD  
**Changes:** Brief description of what changed
```

**Rationale:** Track evolution, understand why knowledge changed.

---

## Templates for Updates

### Adding New Rule
```markdown
## Rule [N]: [Name]

**Principle:** [Core idea]

**Why:** [Reasoning]

**Apply:**
- ✅ [Do this]
- ❌ [Not this]

**Detection:** [How to spot violation]

**Added:** YYYY-MM-DD - [Why added]
```

### Adding New Learning
```markdown
### [N]. [Title]

**Learning:** [What discovered]

**Evidence:** [How known]

**Action:** [What to do]

**Applies to:** [Which domains/contexts]
```

### Adding New Anti-Pattern
```markdown
### [N]. [Pattern Name]

**Pattern:** [What's being done wrong]

**Why wrong:** [Problem it causes]

**Correct:** [Right approach]

**Example:**
❌ [Bad code]
✅ [Good code]
```

---

## Periodic Review

**Monthly (or after 10 tasks):**

1. Review all updates made
2. Check for patterns in updates
3. Consolidate redundant learnings
4. Archive outdated knowledge
5. Refine unclear sections

**Questions:**
- Are rules being followed?
- Are workflows actually used?
- Are memories helpful?
- What's missing?

---

## What NOT to Update

**Don't add:**
- One-off situations (not generalizable)
- Obvious facts (already in AI training)
- Project-specific details (belongs in project docs, not methodology)
- Unverified theories (need evidence first)

**Examples of what NOT to add:**
- "User John prefers blue buttons" → project-specific
- "React uses JSX" → obvious
- "Maybe focusDistance should be 0.25" → unverified

---

## Collaboration Between AI Instances

**Scenario:** Multiple AI agents working on same project.

**Conflict prevention:**
1. Each agent logs learnings to shared file
2. Daily consolidation (deduplicate, merge)
3. Human review for conflicting updates

**Format:**
```markdown
## Pending Learnings (To Be Consolidated)

- [Agent 1, Task X]: Discovery about token validation
- [Agent 2, Task Y]: Different approach to token validation
- [Human review needed]: Resolve which approach better
```

---

## Update Checklist

Before committing update:

- [ ] Learning is generalizable
- [ ] Evidence provided
- [ ] No contradiction with existing knowledge (or conflict resolved)
- [ ] Actionable guidance included
- [ ] Example provided (if applicable)
- [ ] Version/date noted
- [ ] Clear and explicit (no "as discussed")

---

## Example: Complete Update Flow

**Situation:** Discovered that schema validation catches 80% of contract errors.

**1. Identify learning:**
"Schema validation is more valuable than previously thought"

**2. Check existing knowledge:**
- Rule 7: "Fail Fast on Violations" mentions validation
- But doesn't emphasize schema importance

**3. Decide update type:**
Enhance existing rule (not new rule)

**4. Update Rule 7:**
```markdown
## Rule 7: Fail Fast on Violations

**Principle:** Catch contract violations immediately.

**Why:** [existing text]

**High-value check:** Schema validation catches 80% of errors before implementation.

**Implement:**
- Schema validation on contract save (catches most errors)
- Automated checks in CI/CD
- Lint rules for token usage
- Tests verify contract compliance

**Updated:** 2025-10-08 - Emphasized schema validation ROI
```

**5. Also add to memories:**
```markdown
### 26. Schema Validation Has High ROI

**Learning:** JSON Schema validation catches 80% of contract errors.

**Evidence:** 
- Missing required fields
- Wrong types
- Invalid references
- Schema violations

**Action:** Always validate contracts against schema before implementation.
```

**6. Commit with clear message:**
```
docs: emphasize schema validation ROI

Found that schema catches 80% of errors early.
Updated Rule 7 and added to lessons-learned.
```

---

## Meta-Learning

**This workflow itself can evolve.**

If you find better way to update knowledge:
1. Document what's better
2. Update this workflow
3. Note why changed

**Self-improving system.**

---

**Remember:** You are not just using this methodology, you are improving it. Every task is an opportunity to make it better for the next AI agent.
