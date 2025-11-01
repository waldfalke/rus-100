# CONTRACT-MIGRATION-001: Migrate contracts to YAML format per METACONTRACT-001

**Contract:** Infrastructure
**Epic:** EPIC-CONTRACTS
**Status:** TODO
**Owner:** @team
**Priority:** P1

## Overview
Migrate all 37 existing Markdown contracts to YAML format following METACONTRACT-001 specifications.

## Current State
- **37 contracts** in Markdown format
- **0 contracts** follow METACONTRACT-001 structure
- Missing: ID standardization, complexity classification, meta-contract references, typed props

## Target State
- All contracts in YAML format
- Standard IDs (CONTRACT-<NAME>-<NNN>)
- Cynefin domain classification (simple/complicated/complex)
- Meta-contract references
- Machine-checkable acceptance criteria
- Typed props with TypeScript types

## Migration Phases

### Phase 1: High Priority (5 contracts) - Week 1
1. **TestGenerator-Component-TaskCard** → CONTRACT-TASKCARD-001.yml
2. **Storybook-Tokens-And-Theming** → CONTRACT-STORYBOOK-TOKENS-001.yml
3. **INF-002_Tokens-Theming-Integration** → CONTRACT-TOKEN-INTEGRATION-001.yml
4. **TestGenerator-Product** → CONTRACT-TESTGEN-PRODUCT-001.yml
5. **TestGenerator-UI** → CONTRACT-TESTGEN-UI-001.yml

### Phase 2: Medium Priority (15 contracts) - Week 2
- All TestGenerator-* contracts
- All Storybook-* contracts
- Infrastructure contracts

### Phase 3: Low Priority (17 contracts) - Week 3
- Bugfix contracts
- Feature contracts
- Legacy contracts

## Migration Template

```yaml
id: CONTRACT-<NAME>-001
title: "<Human Readable Title>"
type: component | section | page | utility | service
version: 1.0
complexity_level: simple | complicated | complex
cynefin_domain: Simple | Complicated | Complex

meta_contract:
  id: "METACONTRACT-001"
  path: "rnd/distilled-methodology/contracts/METACONTRACT.yml"
  version: "1.0"

description: |
  <Clear description of what this contract defines>

# For components (complexity: simple)
props:
  required:
    - name: id
      type: string
      description: Unique identifier
  optional:
    - name: className
      type: string
      default: ""
      description: Additional CSS classes

# For all levels
invariants:
  - "Count is always >= 0 and <= maxCount"
  - "Disabled state matches count boundaries"

acceptance_criteria:
  - name: "Props validation"
    description: "All required props have correct types"
    validation: "automated"
    test: "TypeScript compilation passes"
  
  - name: "Invariants hold"
    description: "All invariants verified in tests"
    validation: "automated"
    test: "Unit tests pass"
  
  - name: "Visual regression"
    description: "Component matches design"
    validation: "automated"
    test: "Storybook visual tests pass"
```

## Validation
- [ ] All 37 contracts migrated to YAML
- [ ] All contracts reference METACONTRACT-001
- [ ] All contracts have complexity classification
- [ ] All contracts have machine-checkable acceptance criteria
- [ ] All component contracts have typed props
- [ ] YAML validation passes for all contracts
- [ ] Contract registry updated

## Success Metrics
- 100% contracts in YAML format
- 100% contracts reference meta-contract
- 100% contracts have testable acceptance criteria
- 0 validation errors

## Notes
This is foundational work for contract-driven development. Proper contracts enable automated validation, better agent delegation, and clearer implementation requirements.
