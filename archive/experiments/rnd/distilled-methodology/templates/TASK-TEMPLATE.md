# TASK-[EPIC]-[NUMBER]: [Task Title]

**Contract:** CONTRACT-XXX-001  
**Epic:** EPIC-[NUMBER]  
**Owner:** [owner.name]  
**Status:** Pending | In Progress | Complete | Blocked | Cancelled  
**Created:** [ISO8601]  
**Updated:** [ISO8601]

---

## 📋 Overview

**Description:**
Clear, concise description of what needs to be done.

**Context:**
Why this task is needed, background information.

**Acceptance Criteria:**
- [ ] Criterion 1 is met
- [ ] Criterion 2 is met
- [ ] Criterion 3 is met

---

## 🎯 Scope

### In Scope
- What this task includes
- Specific deliverables
- Files to be created/modified

### Out of Scope
- What this task explicitly does NOT include
- Future work to be done separately

---

## 📊 Metadata

| Field | Value |
|-------|-------|
| **Complexity** | Simple \| Complicated \| Complex |
| **Cynefin Domain** | Clear \| Complicated \| Complex \| Chaotic |
| **Estimated Effort** | [hours or story points] |
| **Actual Effort** | [hours] (filled after completion) |
| **Priority** | High \| Medium \| Low |
| **Labels** | frontend, design-system, tokens |

---

## 🔗 Dependencies

### Depends On (Blockers)
- TASK-XXX-XXX: [Task name] - Status: [status]
- TASK-YYY-YYY: [Task name] - Status: [status]

### Blocks (This task blocks)
- TASK-ZZZ-ZZZ: [Task name]
- EPIC-002: [Epic name]

### Related Tasks
- TASK-AAA-AAA: [Related task]

---

## 📝 Implementation Plan

### Step 1: [Step Name]
**What:** Brief description  
**How:** Implementation approach  
**Output:** What gets created

### Step 2: [Step Name]
**What:** Brief description  
**How:** Implementation approach  
**Output:** What gets created

### Step 3: [Step Name]
**What:** Brief description  
**How:** Implementation approach  
**Output:** What gets created

---

## 🧪 Validation

### Automated Tests
```bash
# Commands to run for validation
npm run test:unit
npm run test:e2e
node scripts/validate-contract.js
```

### Manual Checks
- [ ] Visual inspection in browser
- [ ] Storybook all variants rendered
- [ ] Dark theme working correctly
- [ ] Responsive on all breakpoints

### Contract Compliance
- [ ] All acceptance criteria met
- [ ] No anti-patterns introduced
- [ ] Within blast radius (mutable scope only)
- [ ] Hardcoded values check passed

---

## 📦 Deliverables

### Files Created
- [ ] `path/to/new/file.tsx`
- [ ] `path/to/another/file.ts`

### Files Modified
- [ ] `path/to/modified/file.tsx`
- [ ] `contracts/CONTRACT-XXX-001.yml` (if contract updated)

### Documentation
- [ ] `docs/ComponentName.md`
- [ ] Updated `README.md`
- [ ] Updated `CHANGELOG.md`

### Artifacts
- [ ] `artifacts/[ISO8601]-task-report.md`
- [ ] `logs/[ISO8601]-tasklog.md`

---

## 🚧 Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| External API not ready | Medium | High | Mock API responses, continue with stub data |
| Design changes during implementation | Low | Medium | Frequent check-ins with design lead |
| Performance issues | Low | Low | Profile early, optimize if needed |

---

## 📚 Resources

### References
- [Contract](../contracts/CONTRACT-XXX-001.yml)
- [Related Epic](../epics/EPIC-XXX.md)
- [Design Mockups](link-to-figma)

### Context
- Previous similar task: TASK-YYY-YYY
- Documentation: [Component Architecture](../docs/COMPONENT-ARCHITECTURE.md)

---

## 💬 Discussion

### Design Decisions
**Decision:** Use CVA (class-variance-authority) for variants  
**Rationale:** Type-safe, composable, matches existing patterns  
**Alternatives Considered:** Tailwind-variants, manual className logic  
**Date:** 2025-01-03

### Questions & Answers
**Q:** Should we support custom colors?  
**A:** No, use design tokens only (per CONTRACT-TOKENS-001)  
**Date:** 2025-01-04

---

## 📈 Progress Log

### 2025-01-05 14:30
- **Status:** In Progress
- **Progress:** 60% complete
- **Work Done:** 
  - ✅ Created component structure
  - ✅ Implemented basic variants
  - 🔄 Working on dark theme support
- **Next Steps:**
  - Complete dark theme
  - Add Storybook stories
  - Run validation tests
- **Blockers:** None

### 2025-01-04 10:00
- **Status:** Started
- **Progress:** 20% complete
- **Work Done:**
  - ✅ Read contract
  - ✅ Analyzed existing patterns
  - ✅ Created component file
- **Next Steps:**
  - Implement props interface
  - Add variants
- **Blockers:** None

### 2025-01-03 16:00
- **Status:** Created
- **Progress:** 0%
- **Work Done:** Task created, added to backlog
- **Next Steps:** Start implementation
- **Blockers:** Waiting for TASK-001-003 completion

---

## ✅ Completion Checklist

### Before Starting
- [ ] Contract read and understood
- [ ] Dependencies completed
- [ ] Environment setup

### During Development
- [ ] Following contract specifications
- [ ] Writing tests alongside code
- [ ] Documenting as you go
- [ ] Checking against anti-patterns

### Before Marking Complete
- [ ] All acceptance criteria met
- [ ] Automated tests passing
- [ ] Manual validation complete
- [ ] Contract compliance verified
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Artifacts generated
- [ ] Traceability matrix updated

---

## 📄 Task Report

**On completion, generate task report:**
```bash
node scripts/generate-task-report.js \
  --task TASK-001-004 \
  --output artifacts/[ISO8601]-task-001-004-report.md
```

**Report should include:**
- Task summary
- Work performed
- Validation results
- Contract compliance status
- Lessons learned
- Time tracking

---

## 🎓 Lessons Learned

*(Fill after completion)*

### What Went Well
- List positive outcomes
- Efficient processes

### What Could Be Improved
- Areas for improvement
- Process optimizations

### For Future Tasks
- Reusable patterns discovered
- Anti-patterns to avoid
- Best practices to adopt

---

**Last Updated:** [ISO8601]  
**Task Log:** [Link to logs/[ISO8601]-tasklog.md]
