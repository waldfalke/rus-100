# 🧭 RND — Research & Development Index

**Purpose:** Navigation hub for Contract-Driven Development ecosystem  
**Version:** 1.0  
**Last Updated:** 2025-01-10

---

## 🎯 **For AI Agents: Quick Navigation**

### **I'm learning the methodology**
1. Start: [`Onboarding/00-onboarding-exercise.md`](Onboarding/00-onboarding-exercise.md) (20 min)
2. Core principles: [`distilled-methodology/rules/00-universal.md`](distilled-methodology/rules/00-universal.md) (15 min)
3. Complexity classification: [`distilled-methodology/rules/01-cynefin.md`](distilled-methodology/rules/01-cynefin.md) (15 min)

### **I'm writing a contract**
1. Read meta-contract: [`distilled-methodology/contracts/METACONTRACT.yml`](distilled-methodology/contracts/METACONTRACT.yml)
2. Choose template: [`distilled-methodology/templates/`](distilled-methodology/templates/)
3. See example: [`distilled-methodology/contracts/CONTRACT-TOKENS-EXAMPLE.yml`](distilled-methodology/contracts/CONTRACT-TOKENS-EXAMPLE.yml)

### **I'm implementing E2E testing**
1. Read contract: [`field-manuals/e2e-testing/CONTRACT.yml`](field-manuals/e2e-testing/CONTRACT.yml) (30 min)
2. Learn approach: [`Onboarding/03-e2e-testing-complicated-domain.md`](Onboarding/03-e2e-testing-complicated-domain.md) (40 min)
3. Copy examples: [`field-manuals/e2e-testing/examples/`](field-manuals/e2e-testing/examples/)

### **I want to see tooling vision**
1. CLI workflow: [`examples/CLI-WORKFLOW.md`](examples/CLI-WORKFLOW.md)
2. Multi-agent pattern: [`examples/MULTI-AGENT-IMPLEMENTATION.md`](examples/MULTI-AGENT-IMPLEMENTATION.md)
3. Roadmap: [`SCALING-METHODOLOGY.md`](SCALING-METHODOLOGY.md)

---

## 📚 **Document Architecture**

```
rnd/
├── RND-INDEX.md                        ← You are here
│
├── 🎓 TRAINING: Learning materials
│   └── Onboarding/
│       ├── 00-onboarding-exercise.md   ← Start here (Card component)
│       ├── 01-button-simple-domain.md  ← Simple: Known solution
│       ├── 02-scanner-complex-domain.md ← Complex: Emergent behavior
│       └── 03-e2e-testing-complicated-domain.md ← Complicated: Requires expertise
│
├── 🏛️ CORE: Universal methodology
│   └── distilled-methodology/
│       ├── README.md                   ← Methodology overview
│       ├── QUICK-START.md              ← 15-min guide
│       ├── INDEX.md                    ← Complete file structure
│       │
│       ├── rules/                      ← Principles
│       │   ├── 00-universal.md         ← 10 core rules (MUST READ)
│       │   ├── 01-cynefin.md           ← Complexity framework
│       │   └── 05-traceability-obligations.md ← Mandatory practices
│       │
│       ├── contracts/                  ← Meta-contracts
│       │   ├── METACONTRACT.yml        ← Rules for writing contracts
│       │   └── CONTRACT-TOKENS-EXAMPLE.yml ← Token system example
│       │
│       ├── templates/                  ← Copy & customize
│       │   ├── CONTRACT-COMPONENT.yml
│       │   ├── design-tokens.json
│       │   ├── master-backlog.md
│       │   └── TASK-TEMPLATE.md
│       │
│       ├── workflows/                  ← Procedures
│       │   ├── create-component.md
│       │   ├── extract-contract.md
│       │   ├── task-management.md
│       │   └── meta-update-knowledge.md
│       │
│       ├── schemas/                    ← JSON validation
│       │   ├── contract.schema.json
│       │   └── token.schema.json
│       │
│       ├── scripts/                    ← Validation tools
│       │   ├── validate-tokens.js
│       │   ├── generate-css-from-tokens.js
│       │   └── check-contract-compliance.js
│       │
│       └── memories/                   ← Lessons learned
│           ├── lessons-learned.md
│           └── anti-patterns.md
│
├── 🎯 SPECIALIZATIONS: Domain-specific contracts
│   └── field-manuals/e2e-testing/
│       ├── README.md                   ← Entry point
│       ├── CONTRACT.yml                ← Universal E2E contract (1650 lines)
│       │                                 Derives from: METACONTRACT.yml
│       │                                 Contains: Problem domain, principles,
│       │                                          invariants, patterns, metrics
│       │
│       ├── examples/                   ← Production-ready code
│       │   ├── playwright-e2e.config.example.ts
│       │   ├── test-utils.example.ts
│       │   ├── smoke.spec.example.ts
│       │   ├── visual-regression.spec.example.ts
│       │   └── ... (11 files total)
│       │
│       └── success-story/              ← Validation evidence
│           ├── CASE-STUDY.md           ← rus-100: 41/41, 0% flaky
│           └── FIXES-APPLIED.md        ← 7 critical fixes
│
├── 💡 DEMOS: Future tooling examples
│   └── examples/
│       ├── CLI-WORKFLOW.md             ← Vision: 60-min dashboard
│       └── MULTI-AGENT-IMPLEMENTATION.md ← Pattern: Orchestrator
│
└── 🚀 ROADMAP: Development plans
    └── SCALING-METHODOLOGY.md          ← Phases: Starter Kit, CLI, Agents
```

---

## 🔗 **Key Relationships**

### **Derivation Chain**
```
METACONTRACT.yml (how to write contracts)
    ↓ defines structure & rules
    ↓
CONTRACT-E2E-TESTING.yml (E2E specialization)
    ↓ implements METACONTRACT principles
    ↓ 
examples/*.spec.ts (production code)
    ↓ demonstrates contract compliance
```

### **Learning Path**
```
Onboarding/00 (intro)
    ↓ teaches
    ↓
rules/00-universal.md (principles)
    ↓ applied in
    ↓
Onboarding/01-03 (practice)
    ↓ references
    ↓
contracts/METACONTRACT.yml (rules)
    ↓ used in
    ↓
field-manual/CONTRACT.yml (real contract)
```

### **Tool Development**
```
workflows/create-component.md (manual process)
    ↓ will be automated by
    ↓
CLI-WORKFLOW.md (vision)
    ↓ planned in
    ↓
SCALING-METHODOLOGY.md (roadmap)
```

---

## 📖 **Document Types Explained**

### **1. CORE (distilled-methodology/)**
**What:** Universal Contract-Driven Development methodology  
**Who:** Any frontend project  
**Status:** Production-ready, battle-tested

**Key documents:**
- `METACONTRACT.yml` — Meta-law: how to write contracts
- `rules/00-universal.md` — 10 fundamental principles
- `templates/*` — Ready-to-use templates
- `workflows/*` — Step-by-step procedures

**Use when:** Starting new project, writing contracts, establishing processes

---

### **2. TRAINING (Onboarding/)**
**What:** Hands-on exercises teaching CORE methodology  
**Who:** New AI agents, team members  
**Status:** 3 exercises covering all Cynefin domains

**Exercises:**
- **00**: Intro & Card component
- **01**: Simple domain (Button) — known solution
- **02**: Complex domain (Scanner) — emergent behavior
- **03**: Complicated domain (E2E) — requires expertise

**Use when:** Learning methodology, onboarding new agents

---

### **3. SPECIALIZATIONS (field-manuals/)**
**What:** Domain-specific contracts derived from METACONTRACT  
**Who:** Specific problem domains (E2E testing, API design, etc.)  
**Status:** E2E testing complete; others pending

**Current:**
- `field-manuals/e2e-testing/` — Universal E2E testing contract

**Future:**
- `api-design/` — REST/GraphQL contract
- `state-management/` — Redux/Zustand contract
- `accessibility/` — WCAG compliance contract

**Use when:** Implementing domain-specific solutions

---

### **4. DEMOS (examples/)**
**What:** Vision documents showing future tooling  
**Who:** Developers interested in automation  
**Status:** Mockups, not implemented

**Documents:**
- `CLI-WORKFLOW.md` — How CLI would work (60-min dashboard)
- `MULTI-AGENT-IMPLEMENTATION.md` — Orchestrator pattern (57 lines)

**Use when:** Planning tooling, understanding automation potential

---

### **5. ROADMAP (SCALING-METHODOLOGY.md)**
**What:** Development plan for CDD ecosystem  
**Who:** Project stakeholders  
**Status:** Planning phase

**Phases:**
1. **Starter Kit** — GitHub template repo
2. **CLI Scaffolding** — `npx create-contract-driven-app`
3. **Multi-Agent** — Parallel AI generation

**Use when:** Understanding project direction, planning investments

---

## 🎓 **Usage Scenarios**

### **Scenario 1: New AI Agent Onboarding**
```
1. Read: RND-INDEX.md (this file)
2. Complete: Onboarding/00-onboarding-exercise.md
3. Study: distilled-methodology/rules/00-universal.md
4. Practice: Onboarding/01-button-simple-domain.md
5. Ready: Start real work with methodology
```

### **Scenario 2: Writing Component Contract**
```
1. Read: distilled-methodology/contracts/METACONTRACT.yml
2. Choose: Cynefin domain (Simple/Complicated/Complex)
3. Copy: distilled-methodology/templates/CONTRACT-COMPONENT.yml
4. Fill: Required fields per METACONTRACT rules
5. Validate: distilled-methodology/scripts/check-contract-compliance.js
```

### **Scenario 3: Implementing E2E Tests**
```
1. Read: field-manuals/e2e-testing/CONTRACT.yml (problem domain, principles)
2. Understand: Why flakiness occurs (principle violations)
3. Copy: field-manuals/e2e-testing/examples/*.spec.ts
4. Apply: Patterns (waitForPageReady, :visible, fonts.ready)
5. Measure: success_metrics (determinism, visual stability)
```

### **Scenario 4: Creating New Field Manual**
```
1. Identify: Domain problem (e.g., API design)
2. Classify: Cynefin complexity (Simple/Complicated/Complex)
3. Derive: Contract from METACONTRACT.yml
4. Document: Problem domain, principles, patterns
5. Validate: Real implementation (like rus-100 for E2E)
```

### **Scenario 5: Planning Automation**
```
1. Review: examples/CLI-WORKFLOW.md (vision)
2. Study: SCALING-METHODOLOGY.md (roadmap)
3. Identify: Manual workflows to automate
4. Design: Multi-agent architecture
5. Implement: Phase by phase
```

---

## 📊 **Metrics & Health**

### **Methodology Maturity**
- ✅ **CORE**: Complete, production-ready
- ✅ **TRAINING**: 3/3 Cynefin domains covered
- ✅ **SPECIALIZATIONS**: 1 domain (E2E testing) complete
- 🚧 **DEMOS**: Vision only, not implemented
- 📋 **ROADMAP**: Planning phase

### **Coverage**
- **Cynefin domains trained:** 3/3 (Simple, Complicated, Complex)
- **Field manuals:** 1 complete (E2E testing)
- **Production validation:** rus-100 (41/41 tests, 0% flaky)

### **Next Steps**
1. Implement CLI tooling (SCALING phase 2)
2. Create additional field manuals (API, State, A11y)
3. Build starter kit (SCALING phase 1)

---

## 🔍 **Finding What You Need**

### **"I don't know where to start"**
→ [`Onboarding/00-onboarding-exercise.md`](Onboarding/00-onboarding-exercise.md)

### **"I need to write a contract"**
→ [`distilled-methodology/contracts/METACONTRACT.yml`](distilled-methodology/contracts/METACONTRACT.yml)

### **"My E2E tests are flaky"**
→ [`field-manuals/e2e-testing/CONTRACT.yml`](field-manuals/e2e-testing/CONTRACT.yml) (section: anti_patterns)

### **"I want to understand the methodology"**
→ [`distilled-methodology/README.md`](distilled-methodology/README.md)

### **"I need a quick reference"**
→ [`distilled-methodology/SUMMARY.md`](distilled-methodology/SUMMARY.md)

### **"I want to see real examples"**
→ [`field-manuals/e2e-testing/examples/`](field-manuals/e2e-testing/examples/)

### **"I'm planning a new domain contract"**
→ [`distilled-methodology/contracts/METACONTRACT.yml`](distilled-methodology/contracts/METACONTRACT.yml) + [`field-manuals/e2e-testing/CONTRACT.yml`](field-manuals/e2e-testing/CONTRACT.yml) (as reference)

### **"I want to automate this"**
→ [`examples/CLI-WORKFLOW.md`](examples/CLI-WORKFLOW.md) + [`SCALING-METHODOLOGY.md`](SCALING-METHODOLOGY.md)

---

## 🧠 **Philosophy**

**This R&D directory embodies:**

1. **Generators over Generated**  
   Control contracts & tokens, not components & pages

2. **Universal over Specific**  
   CORE methodology works for any frontend project

3. **Derived over Duplicated**  
   Field manuals derive from METACONTRACT, don't reinvent

4. **Validated over Theoretical**  
   E2E contract proven on rus-100 (100% pass, 0% flaky)

5. **Documented over Implicit**  
   Every decision traceable to principle

---

## 📞 **Support & Updates**

### **How to Update This Ecosystem**

**Adding new field manual:**
1. Create `field-manuals/[domain]/`
2. Write `CONTRACT.yml` following METACONTRACT
3. Add practical examples
4. Validate on real project
5. Update this index

**Improving CORE:**
1. Document pattern in `memories/lessons-learned.md`
2. Update relevant `rules/*.md` or `workflows/*.md`
3. Follow `workflows/meta-update-knowledge.md`

**Proposing automation:**
1. Document use case in `examples/`
2. Reference in `SCALING-METHODOLOGY.md`
3. Prioritize by impact

---

**Version:** 1.0  
**Created:** 2025-01-10  
**Nature:** Living document (update as ecosystem grows)  
**Next Review:** When adding 2nd field manual

---

**Start your journey:** [`Onboarding/00-onboarding-exercise.md`](Onboarding/00-onboarding-exercise.md)
