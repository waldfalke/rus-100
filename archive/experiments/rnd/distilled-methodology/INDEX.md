# Distilled Methodology — Complete Index

**Version:** 1.0  
**Last Updated:** 2025-10-08  
**Status:** Production-ready

---

## 📖 Entry Points

### For First-Time Users
1. **[QUICK-START.md](QUICK-START.md)** ⭐ - 15 min to productive work
2. **[SUMMARY.md](SUMMARY.md)** - Quick reference card
3. **[README.md](README.md)** - Full methodology overview

### For Experienced Users
- **[workflows/task-management.md](workflows/task-management.md)** - Task system deep dive
- **[rules/05-traceability-obligations.md](rules/05-traceability-obligations.md)** - Mandatory practices

---

## 📁 Complete File Structure

```
distilled-methodology/
├── README.md                        ⭐ Start here
├── QUICK-START.md                   ⭐ 15-min guide
├── SUMMARY.md                       📋 Quick reference
├── INDEX.md                         📖 This file
│
├── rules/                           📏 Static principles
│   ├── 00-universal.md             ⭐ 10 core rules (MUST READ)
│   ├── 01-cynefin.md               🎯 Complexity classification
│   └── 05-traceability-obligations.md ⭐ Mandatory (MUST READ)
│
├── workflows/                       🔄 Step-by-step procedures
│   ├── create-component.md         🆕 New component workflow
│   ├── extract-contract.md         📤 Legacy extraction
│   ├── task-management.md          ⭐ Task system (MUST READ)
│   └── meta-update-knowledge.md    📝 Update methodology
│
├── schemas/                         ✅ JSON validation
│   ├── contract.schema.json        📜 Contract validation
│   └── token.schema.json           🎨 Token validation
│
├── templates/                       📄 Copy & fill
│   ├── CONTRACT-COMPONENT.yml      📜 Component contract
│   ├── design-tokens.json          🎨 Token structure
│   ├── master-backlog.md           ⭐ Backlog template
│   ├── TASK-TEMPLATE.md            📋 Task specification
│   ├── EPIC-TEMPLATE.md            📦 Epic grouping
│   ├── tasklog-template.md         📝 Daily work log
│   └── traceability-matrix.csv     🔗 Task→Code mapping
│
├── contracts/                       📜 Universal contracts
│   ├── README.md                   📖 How to use contracts
│   ├── METACONTRACT.yml            ⭐ Meta-contract (rules for contracts)
│   └── CONTRACT-TOKENS-EXAMPLE.yml 🎨 Token system example
│
├── scripts/                         🔧 Working validation tools
│   ├── README.md                   📖 Script documentation
│   ├── package.json                📦 Dependencies
│   ├── validate-tokens.js          ✅ Token validation
│   ├── generate-css-from-tokens.js 🎨 CSS generation
│   └── check-contract-compliance.js ✅ Contract checker
│
├── cookbook/                        👨‍🍳 Real examples
│   ├── 00-onboarding-exercise.md   🎓 Learning exercise
│   ├── 01-button-simple-domain.md  🔘 Simple: Button
│   └── 02-scanner-complex-domain.md 📷 Complex: Scanner
│
├── memories/                        🧠 Accumulated knowledge
│   ├── lessons-learned.md          💡 What worked
│   └── anti-patterns.md            ⚠️ What didn't work
│
└── migration/                       📦 Legacy transformation
    └── legacy-to-contracts.md      🔄 Migration guide
```

---

## 🎯 By Use Case

### "I'm starting a new project"
1. Read: [QUICK-START.md](QUICK-START.md)
2. Read: [rules/00-universal.md](rules/00-universal.md)
3. Copy: [templates/master-backlog.md](templates/master-backlog.md)
4. Copy: [templates/design-tokens.json](templates/design-tokens.json)
5. Install: [scripts/package.json](scripts/package.json)
6. Create first task following: [workflows/task-management.md](workflows/task-management.md)

### "I need to create a component"
1. Check: [workflows/create-component.md](workflows/create-component.md)
2. Reference: [cookbook/01-button-simple-domain.md](cookbook/01-button-simple-domain.md)
3. Use template: [templates/CONTRACT-COMPONENT.yml](templates/CONTRACT-COMPONENT.yml)
4. Validate: `node scripts/check-contract-compliance.js`

### "I'm migrating legacy code"
1. Read: [workflows/extract-contract.md](workflows/extract-contract.md)
2. Read: [migration/legacy-to-contracts.md](migration/legacy-to-contracts.md)
3. Extract contracts incrementally
4. Validate with scripts

### "I need to manage tasks"
1. Read: [workflows/task-management.md](workflows/task-management.md) ⭐
2. Read: [rules/05-traceability-obligations.md](rules/05-traceability-obligations.md) ⭐
3. Use: [templates/master-backlog.md](templates/master-backlog.md)
4. Use: [templates/TASK-TEMPLATE.md](templates/TASK-TEMPLATE.md)
5. Use: [templates/tasklog-template.md](templates/tasklog-template.md)
6. Maintain: [templates/traceability-matrix.csv](templates/traceability-matrix.csv)

### "I need design tokens"
1. Check: [contracts/CONTRACT-TOKENS-EXAMPLE.yml](contracts/CONTRACT-TOKENS-EXAMPLE.yml)
2. Use template: [templates/design-tokens.json](templates/design-tokens.json)
3. Validate: `node scripts/validate-tokens.js tokens.json`
4. Generate CSS: `node scripts/generate-css-from-tokens.js`

### "I'm learning the methodology"
1. Start: [QUICK-START.md](QUICK-START.md)
2. Exercise: [cookbook/00-onboarding-exercise.md](cookbook/00-onboarding-exercise.md)
3. Read: [rules/00-universal.md](rules/00-universal.md)
4. Examples: [cookbook/01-button-simple-domain.md](cookbook/01-button-simple-domain.md)
5. Reference: [SUMMARY.md](SUMMARY.md)

---

## 🎓 Learning Path

### Level 1: Basics (1 hour)
1. ✅ [QUICK-START.md](QUICK-START.md) - 15 min
2. ✅ [rules/00-universal.md](rules/00-universal.md) - 20 min
3. ✅ [rules/05-traceability-obligations.md](rules/05-traceability-obligations.md) - 15 min
4. ✅ [SUMMARY.md](SUMMARY.md) - 10 min

### Level 2: Practice (2 hours)
5. ✅ [cookbook/00-onboarding-exercise.md](cookbook/00-onboarding-exercise.md) - 30 min
6. ✅ [workflows/create-component.md](workflows/create-component.md) - 20 min
7. ✅ [workflows/task-management.md](workflows/task-management.md) - 30 min
8. ✅ [cookbook/01-button-simple-domain.md](cookbook/01-button-simple-domain.md) - 40 min

### Level 3: Mastery (ongoing)
9. ✅ [rules/01-cynefin.md](rules/01-cynefin.md) - Complexity assessment
10. ✅ [memories/anti-patterns.md](memories/anti-patterns.md) - Learn from mistakes
11. ✅ [memories/lessons-learned.md](memories/lessons-learned.md) - Proven insights
12. ✅ [cookbook/02-scanner-complex-domain.md](cookbook/02-scanner-complex-domain.md) - Complex example

---

## 🔧 Tools & Scripts

### Validation
```bash
# Validate design tokens
node scripts/validate-tokens.js design-tokens/tokens.json

# Check contract compliance
node scripts/check-contract-compliance.js \
  contracts/CONTRACT-BUTTON-001.yml \
  components/Button.tsx
```

### Generation
```bash
# Generate CSS from tokens
node scripts/generate-css-from-tokens.js \
  design-tokens/tokens.json \
  build/css/variables.css
```

### Setup
```bash
# Install dependencies
cd scripts/
npm install
```

**Full documentation:** [scripts/README.md](scripts/README.md)

---

## 📋 Task Management System

### Core Files
1. **`master-backlog.md`** - Single source of truth for all tasks
2. **`tasks/TASK-[ID].md`** - Detailed task specifications
3. **`logs/[DATE]-tasklog.md`** - Daily work records
4. **`traceability-matrix.csv`** - Task→Contract→Code links

### Key Principles
- **One task = one row** in backlog (no details)
- **Sprint focus** section (current work only)
- **Dependencies visible** (🔺 depends, 🔴 blocks, ⛔ blocked)
- **Daily updates** mandatory
- **Traceability** enforced

**Full guide:** [workflows/task-management.md](workflows/task-management.md)  
**Obligations:** [rules/05-traceability-obligations.md](rules/05-traceability-obligations.md)

---

## 📜 Contracts System

### Meta-Contract
**[contracts/METACONTRACT.yml](contracts/METACONTRACT.yml)** - Rules for writing all contracts

### Example Contracts
- **[contracts/CONTRACT-TOKENS-EXAMPLE.yml](contracts/CONTRACT-TOKENS-EXAMPLE.yml)** - Design token system

### Templates
- **[templates/CONTRACT-COMPONENT.yml](templates/CONTRACT-COMPONENT.yml)** - Component contract

### Documentation
- **[contracts/README.md](contracts/README.md)** - How to use contracts

---

## 🎨 Design Tokens

### Schema
- **[schemas/token.schema.json](schemas/token.schema.json)** - JSON Schema validation

### Template
- **[templates/design-tokens.json](templates/design-tokens.json)** - Token structure

### Scripts
- **Validate:** `scripts/validate-tokens.js`
- **Generate CSS:** `scripts/generate-css-from-tokens.js`

### Example Contract
- **[contracts/CONTRACT-TOKENS-EXAMPLE.yml](contracts/CONTRACT-TOKENS-EXAMPLE.yml)**

---

## ⚠️ Anti-Patterns

Common mistakes and fixes:

1. **Hardcoded values** → Use tokens
2. **Code-first** → Contract before code
3. **Bloated backlog** → Details in task files
4. **Missing traceability** → Update matrix on completion
5. **Working without task ID** → Always create task first
6. **Stale logs** → Update daily
7. **Vague acceptance criteria** → Be specific, measurable

**Full list:** [memories/anti-patterns.md](memories/anti-patterns.md)

---

## 💡 Key Learnings

Proven insights from real projects:

- Context budget is real (>80% = degraded quality)
- Simple domain needs precision
- Complex domain needs flexibility
- Hardcoded values always creep in (automate detection)
- Dependencies matter (graph > list)
- Time estimates are fiction (use complexity)
- Contracts must evolve (especially Complex domain)

**Full list:** [memories/lessons-learned.md](memories/lessons-learned.md)

---

## 🚀 Quick Actions

### Start New Work
```bash
# 1. Add to backlog
echo "| TSK-001 | P1 | Task title | TODO | Module | | |" >> master-backlog.md

# 2. Create task file
cp templates/TASK-TEMPLATE.md tasks/TSK-001.md

# 3. Start work...

# 4. Log daily
cp templates/tasklog-template.md logs/$(date +%Y-%m-%d)-tasklog.md
```

### Validate Work
```bash
# Check tokens
node scripts/validate-tokens.js design-tokens/tokens.json

# Check contract compliance
node scripts/check-contract-compliance.js \
  contracts/CONTRACT-XXX-001.yml \
  components/Component.tsx
```

### Complete Task
```bash
# 1. Update backlog (DONE status)
# 2. Update task file (completion notes)
# 3. Update traceability matrix
# 4. Create final tasklog entry
```

---

## 📊 Success Metrics

### Project Health
- ✅ Contract compliance: >90%
- ✅ Token usage: >90%
- ✅ Blast radius violations: 0
- ✅ Traceability current: >95%
- ✅ Automated validation: Yes

### Task Health
- ✅ All IN_PROGRESS tasks have recent logs (<3 days)
- ✅ All DONE tasks in traceability matrix
- ✅ No orphaned code (all files traced to tasks)
- ✅ Dependencies documented

---

## 🆘 Help

### Stuck?
1. Check [SUMMARY.md](SUMMARY.md) for quick reference
2. Search [memories/anti-patterns.md](memories/anti-patterns.md)
3. Review relevant [cookbook/](cookbook/) example
4. Consult applicable [workflows/](workflows/)

### Breaking Things?
1. Check blast radius (in scope?)
2. Review anti-patterns
3. Roll back
4. Fix contract first

### Context Full?
1. Save state
2. Note position
3. Reset
4. Reload: contract + task + rules
5. Continue

---

## 📝 Contributing

To add new knowledge:

1. **New rule:** Add to `rules/` with evidence
2. **New workflow:** Add to `workflows/` with steps
3. **New learning:** Add to `memories/lessons-learned.md`
4. **New anti-pattern:** Add to `memories/anti-patterns.md`
5. **New example:** Add to `cookbook/`

**Process:** [workflows/meta-update-knowledge.md](workflows/meta-update-knowledge.md)

---

## 📞 Reference

- **Methodology:** Based on 3 real production projects
- **Version:** 1.0 (2025-10-08)
- **Status:** Production-ready
- **License:** Internal use

**Distilled from:**
- CATME PIM project (real backlog example)
- Fit&Lead project (contracts, tokens, validation)
- Multiple client projects (patterns, anti-patterns)

---

**Start here:** [QUICK-START.md](QUICK-START.md) → 15 minutes to productive work! 🚀
